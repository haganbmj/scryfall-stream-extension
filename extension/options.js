// window.browser = (function () {
//     return window.msBrowser || window.browser || window.chrome;
// })();

// if (typeof browser === 'undefined') {
//     browser = window.browser;
// }

const defaultSettings = {
    room: `${Math.random().toString(36).slice(7)}`,
    // server: 'http://localhost:8080'
    server: 'https://streamsgood.com'
};

const currentSettings = {
};

function saveOptions(e) {
    if (e) {
        e.preventDefault();
    }
    
    browser.storage.local.set({
        room: document.querySelector('#room').value,
        server: document.querySelector('#server').value
    });
    currentSettings.room = document.querySelector('#room').value;
    currentSettings.server = document.querySelector('#server').value;
    setImageUrl();
}

function setImageUrl() {
    document.querySelector('#image-url').href = `${currentSettings.server}/room/${encodeURIComponent(currentSettings.room)}?layer-name=Scryfall&layer-width=745&layer-height=1040`;
}

function restoreOptions() {
    try {
        browser.storage.local.get('room').then(data => {
            if (typeof data.room !== 'string' || data.room.trim() === '') {
                data.room = defaultSettings.room;
                browser.storage.local.set({
                    room: data.room
                });
            }

            currentSettings.room = data.room;
            document.querySelector('#room').value = data.room;
            setImageUrl();
        });

        browser.storage.local.get('server').then(data => {
            if (typeof data.server !== 'string' || data.server.trim() === '') {
                data.server = defaultSettings.server;
                browser.storage.local.set({
                    server: data.server
                });
            }

            currentSettings.server = data.server;
            document.querySelector('#server').value = data.server;
            setImageUrl();
        });
    } catch (e) {
        console.error(e);
    }
}

function generateRoom() {
    document.querySelector('#room').value = `${Math.random().toString(36).slice(7)}`;
    saveOptions();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#generate-room').addEventListener('click', generateRoom);