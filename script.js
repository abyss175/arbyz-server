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
    .then(res => {
        if (!res.ok) throw new Error('status.json не найден');
        return res.json();
    })
    .then(data => {
        const map1 = document.getElementById('current-map');
        const map2 = document.getElementById('current-map-2');
        const pl1 = document.getElementById('players-online');
        const pl2 = document.getElementById('players-online-2');
        const timeEl = document.getElementById('status-updated');

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
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabs = [...document.querySelectorAll('.tab')];
        const panels = [...document.querySelectorAll('.tab-panel')];
        if (!panels.length) return;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const index = tabs.indexOf(tab);
        panels.forEach((p, i) => p.classList.toggle('active', i === index));
    });
});
