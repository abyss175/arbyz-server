// ===== Поиск игрока для страницы профиля =====
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

    document.getElementById('p-name').textContent = p.name;
    document.getElementById('p-steamid').textContent = p.steamid;
    document.getElementById('p-hours').textContent = p.hours;
    document.getElementById('p-kills').textContent = p.kills;
    document.getElementById('p-deaths').textContent = p.deaths;
    document.getElementById('p-kd').textContent =
      p.deaths > 0 ? (p.kills / p.deaths).toFixed(2) : p.kills.toFixed(2);
    document.getElementById('p-mutes').textContent = p.mutes;
    document.getElementById('p-bans').textContent = p.bans;
    document.getElementById('p-friends').textContent = p.friends.join(', ') || 'нет';

    const statusEl = document.getElementById('p-status');
    if (p.bans > 0) {
      statusEl.textContent = '⚠ У игрока есть активные наказания';
    } else {
      statusEl.textContent = '✓ Замечаний нет';
    }

    document.getElementById('profile').style.display = 'block';
  } catch (e) {
    console.error('Ошибка загрузки данных:', e);
    document.getElementById('not-found').style.display = 'block';
    document.getElementById('not-found').querySelector('.note').textContent =
      'Не удалось загрузить данные игроков.';
  }
}

// ===== Копирование команды connect (главная страница) =====
function copyConnect() {
  const command = 'connect IP_АДРЕС:ПОРТ';
  navigator.clipboard.writeText(command)
    .then(() => {
      const btn = document.querySelector('.btn-copy');
      const old = btn.textContent;
      btn.textContent = 'Скопировано ✓';
      setTimeout(() => btn.textContent = old, 2000);
    })
    .catch(() => alert('Не удалось скопировать. Скопируйте вручную: ' + command));
}

// ===== Подгрузка карты и онлайна (главная страница) =====
fetch('status.json')
  .then(res => res.json())
  .then(data => {
    const mapEl = document.getElementById('current-map');
    const plEl = document.getElementById('players-online');
    if (mapEl && data.map) mapEl.textContent = data.map;
    if (plEl && data.players) plEl.textContent = data.players;
  })
  .catch(() => {});
