// ============================================================
// 1. ВКЛАДКИ ВНУТРИ ПРОФИЛЯ (Активность / Достижения / Отзывы)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) return; // если вкладок нет на странице — выходим

    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            if (tabContents[index]) tabContents[index].classList.add('active');
        });
    });
});

// ============================================================
// 2. КОПИРОВАНИЕ КОМАНДЫ CONNECT (главная страница)
// ============================================================
function copyConnect() {
    const command = 'connect 26.217.63.96';
    navigator.clipboard.writeText(command)
        .then(() => {
            const btn = document.querySelector('.btn-copy');
            const old = btn.textContent;
            btn.textContent = 'Скопировано ✓';
            setTimeout(() => btn.textContent = old, 2000);
        })
        .catch(() => alert('Не удалось скопировать. Скопируйте вручную: ' + command));
}

// ============================================================
// 3. ПОДГРУЗКА КАРТЫ И ОНЛАЙНА (главная страница)
// ============================================================
fetch('status.json')
    .then(res => res.json())
    .then(data => {
        const mapEl = document.getElementById('current-map');
        const plEl = document.getElementById('players-online');
        if (mapEl && data.map) mapEl.textContent = data.map;
        if (plEl && data.players) plEl.textContent = data.players;
    })
    .catch(() => {});

// ============================================================
// 4. ПОИСК ИГРОКА И ЗАПОЛНЕНИЕ ПРОФИЛЯ
// ============================================================
async function findPlayer() {
    const query = document.getElementById('player-input').value.trim().toLowerCase();
    if (!query) return;

    try {
        const res = await fetch('players.json');
        const players = await res.json();

        const p = players.find(x =>
            x.name.toLowerCase() === query || x.steamid === query
        );

        document.getElementById('not-found').style.display = 'none';
        document.getElementById('profile').style.display = 'none';

        if (!p) {
            document.getElementById('not-found').style.display = 'block';
            return;
        }

        // --- Основные данные ---
        document.getElementById('p-name').textContent = p.name;
        document.getElementById('p-steamid').textContent = p.steamid;

        // Часы наиграны — считаем из playtimeSeconds
        const seconds = p.playtimeSeconds || 0;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        document.getElementById('p-hours').textContent = hours + ' ч ' + minutes + ' м';

        // --- Боевые данные ---
        document.getElementById('p-kills').textContent = p.kills ?? 0;
        document.getElementById('p-deaths').textContent = p.deaths ?? 0;
        document.getElementById('p-kd').textContent =
            (p.deaths > 0) ? (p.kills / p.deaths).toFixed(2) : Number(p.kills || 0).toFixed(2);

        // --- Поля, которых пока нет в плагине (заглушки) ---
        document.getElementById('p-mutes').textContent = '—';
        document.getElementById('p-bans').textContent = '—';
        document.getElementById('p-friends').textContent = '—';

        // --- Статус ---
        const statusEl = document.getElementById('p-status');
        statusEl.textContent = '✓ Замечаний нет';

        // --- Даты (firstSeen / lastSeen из плагина) ---
        const regEl = document.getElementById('p-firstseen');
        const lastEl = document.getElementById('p-lastseen');
        if (regEl && p.firstSeen) {
            regEl.textContent = new Date(p.firstSeen).toLocaleDateString('ru-RU');
        }
        if (lastEl && p.lastSeen) {
            lastEl.textContent = new Date(p.lastSeen).toLocaleString('ru-RU');
        }

        document.getElementById('profile').style.display = 'block';
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
        document.getElementById('not-found').style.display = 'block';
        const note = document.getElementById('not-found').querySelector('.note');
        if (note) note.textContent = 'Не удалось загрузить данные игроков.';
    }
}
