const fs = require('fs');
const Gamedig = require('gamedig');

const HOST = '26.217.63.96';
const PORT = 27015;

async function main() {
    let status;
    try {
        const state = await Gamedig.query({
            type: 'cs2',
            host: HOST,
            port: PORT,
            maxAttempts: 3,
            socketTimeout: 5000,
            attemptTimeout: 10000
        });

        status = {
            map: state.map,
            players: state.players.length,
            maxPlayers: state.maxplayers,
            serverName: state.name,
            offline: false,
            updated: new Date().toISOString()
        };
        console.log('Сервер онлайн:', JSON.stringify(status));
    } catch (e) {
        status = {
            map: null,
            players: 0,
            maxPlayers: 0,
            serverName: 'ZENTRAX CS2',
            offline: true,
            updated: new Date().toISOString()
        };
        console.error('Сервер не отвечает:', e.message);
    }

    fs.writeFileSync('status.json', JSON.stringify(status, null, 2));
}

main();

