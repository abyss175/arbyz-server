// ============================================================
// КОНФИГУРАЦИЯ (меняй тут)
// ============================================================
const SERVER_ADDR = '26.217.63.96';

// Рулетка: только ВХ и Невидимость (в будущем добавишь другие)
const ROULETTE_MODES = ['ВХ (WallHack)', 'Невидимость', '1vsALL'];

// ============================================================
// КОПИРОВАНИЕ КОМАНДЫ CONNECT
// ============================================================
function copyConnect() {
    const command = 'connect ' + SERVER_ADDR;
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
// СТАТУС СЕРВЕРА (карта и онлайн)
// ============================================================
fetch('status.json')
    .then(res => {
        if (!res.ok) throw new Error('status.json не найден');
        return res.json();
    })
    .then(data => {
        const badge = document.getElementById('server-status');
        const map1 = document.getElementById('current-map');
        const map2 = document.getElementById('current-map-2');
        const pl1 = document.getElementById('players-online');
        const pl2 = document.getElementById('players-online-2');
        const timeEl = document.getElementById('status-updated');

        const mapText = data.offline ? 'Сервер офлайн' : (data.map || '—');
        const plText = data.offline ? '0' : data.players + ' / ' + (data.maxPlayers || 20);

        if (badge) {
            badge.textContent = data.offline ? 'Сервер офлайн' : 'Сервер онлайн';
            badge.className = 'status-badge ' + (data.offline ? 'status-offline' : 'status-online');
        }
        if (map1) map1.textContent = mapText;
        if (map2) map2.textContent = mapText;
        if (pl1) pl1.textContent = plText;
        if (pl2) pl2.textContent = plText;

        if (timeEl && data.updated) {
            timeEl.textContent = 'Обновлено: ' + new Date(data.updated).toLocaleString('ru-RU');
        }
    })
    .catch(err => console.warn('Не удалось загрузить status.json', err));

// ============================================================
// ПОДКЛЮЧЕНИЕ К СЕРВЕРУ КНОПКОЙ
// ============================================================
function connectToServer() {
    navigator.clipboard.writeText('connect ' + SERVER_ADDR).catch(() => {});
    window.location.href = 'steam://connect/' + SERVER_ADDR;

    document.querySelectorAll('.btn-connect').forEach(btn => {
        const old = btn.textContent;
        btn.textContent = 'Не подключило? → консоль: connect';
        setTimeout(() => btn.textContent = old, 4000);
    });
}

// ============================================================
// ВКЛАДКИ (магазин + правила — общая механика)
// ============================================================
document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.shop-panel').forEach(p => p.style.display = 'none');

        const target = document.getElementById(tab.getAttribute('data-tab'));
        if (target) target.style.display = 'block';
    });
});

// ============================================================
// РУЛЕТКА РАНДОМНОГО РЕЖИМА
// ============================================================
let rouletteBusy = false;

function spinRoulette() {
    if (rouletteBusy) return;

    const reel = document.getElementById('roulette-reel');
    const result = document.getElementById('roulette-result');
    const buyBtn = document.getElementById('roulette-buy');
    const btn = document.querySelector('.btn-roulette');

    if (!reel || !result || !buyBtn || !btn) return;

    rouletteBusy = true;
    btn.disabled = true;

    result.textContent = '';
    buyBtn.style.display = 'none';
    reel.classList.add('spinning');

    const icons = ['🎰', '👁️', '👻', '🎰', '👁️', '👻'];
    let ticks = 0;
    const totalTicks = 20;

    const interval = setInterval(() => {
        reel.textContent = icons[ticks % icons.length];
        ticks++;
        if (ticks >= totalTicks) {
            clearInterval(interval);
            reel.classList.remove('spinning');

            const winner = ROULETTE_MODES[Math.floor(Math.random() * ROULETTE_MODES.length)];
            const icon = winner.includes('ВХ') ? '👁️' : '👻';

            reel.textContent = icon;
            result.textContent = 'Выпало: ' + winner;

            buyBtn.style.display = 'block';
            btn.disabled = false;
            rouletteBusy = false;

            setTimeout(() => { result.textContent = ''; }, 15000);
        }
    }, 120);
}
