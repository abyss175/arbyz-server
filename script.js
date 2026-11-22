// ============================================================
// КОПИРОВАНИЕ КОМАНДЫ CONNECT (главная страница)
// ============================================================
function copyConnect() {
    const command = 'connect 26.217.63.96';
    navigator.clipboard.writeText(command)
        .then(() => {
            document.querySelectorAll('.btn-copy').forEach(btn => {
                const old = btn.textContent;
                btn.textContent = 'Скопировано ✓';
                setTimeout(() => btn.textContent = old, 2000);
            });
        })
        .catch(() => alert('Не удалось скопировать. Скопируйте вручную: ' + command));
}

// ============================================================
// СТАТУС СЕРВЕРА (карта и онлайн) — главная страница
// ============================================================
fetch('status.json')
    .then(res => res.json())
    .then(data => {
        const map1 = document.getElementById('current-map');
        const map2 = document.getElementById('current-map-2');
        const pl1 = document.getElementById('players-online');
        const pl2 = document.getElementById('players-online-2');
        const timeEl = document.getElementById('status-updated');

        // Если сервер офлайн — показываем это честно
        const mapText = data.offline ? 'Сервер офлайн' : (data.map || '—');
        const plText = data.offline ? '0' : data.players + ' / ' + (data.maxPlayers || 20);

        if (map1) map1.textContent = mapText;
        if (map2) map2.textContent = mapText;
        if (pl1) pl1.textContent = plText;
        if (pl2) pl2.textContent = plText;

        if (timeEl && data.updated) {
            timeEl.textContent = 'Обновлено: ' + new Date(data.updated).toLocaleString('ru-RU');
        }
    })
    .catch(() => {});

// ============================================================
// ВКЛАДКИ ПРОФИЛЯ (Активность / Достижения / Отзывы)
// ============================================================
function switchProfileTab(index) {
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach((b, i) => b.classList.toggle('active', i === index));
    contents.forEach((c, i) => c.classList.toggle('active', i === index));
}

// ============================================================
// ПОИСК ИГРОКА И ЗАПОЛНЕНИЕ ПРОФИЛЯ
// ============================================================
async function findPlayer() {
    const inputEl = document.getElementById('player-input');
    if (!inputEl) return;

    const query = inputEl.value.trim().toLowerCase();
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

        // Основные данные
        document.getElementById('p-name').textContent = p.name;
        document.getElementById('p-name-banner').textContent = p.name;
        document.getElementById('p-steamid').textContent = p.steamid;

        // Часы из playtimeSeconds
        const seconds = p.playtimeSeconds || 0;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        document.getElementById('p-hours').textContent =
            hours > 0 ? hours + ' ч ' + minutes + ' м' : minutes + ' м';

        // Боевые данные
        document.getElementById('p-kills').textContent = p.kills ?? 0;
        document.getElementById('p-deaths').textContent = p.deaths ?? 0;
        document.getElementById('p-kd').textContent =
            p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : (p.kills || 0).toFixed(2);

        // Даты
        if (p.firstSeen) {
            document.getElementById('p-firstseen').textContent =
                new Date(p.firstSeen).toLocaleDateString('ru-RU');
        }
        if (p.lastSeen) {
            const last = new Date(p.lastSeen).toLocaleString('ru-RU');
            document.getElementById('p-lastseen').textContent = last;
            const last2 = document.getElementById('p-lastseen-2');
            if (last2) last2.textContent = last;
        }

        // Статус
        document.getElementById('p-status').textContent = '✓ Замечаний нет';

        document.getElementById('profile').style.display = 'grid';
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
        document.getElementById('not-found').style.display = 'block';
        const note = document.querySelector('#not-found .note');
        if (note) note.textContent = 'Не удалось загрузить данные игроков.';
    }
}

// ============================================================
// ПОКУПКА VIP (магазин)
// ============================================================
function buyVip(tier) {
    alert('Оплата VIP ' + tier + ':\n\nНапишите админу в Discord — ' +
          'укажите свой ник и выбранный тариф.\n' +
          'Привилегия выдаётся после подтверждения оплаты.');
}
