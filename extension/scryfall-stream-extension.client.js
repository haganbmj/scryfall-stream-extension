// window.browser = (function () {
//     return window.msBrowser || window.browser || window.chrome;
// })();

// if (typeof browser === 'undefined') {
//     browser = window.browser;
// }

const streamSettings = {
};

function loadSettings() {
    browser.storage.local.get('room').then(data => {
        // console.log(`room: ${data.room}`);
        streamSettings.room = data.room;
    });

    browser.storage.local.get('server').then(data => {
        // console.log(`server: ${data.server}`);
        streamSettings.server = data.server;
    });
}

function changeImage(url) {
    fetch(`${streamSettings.server}/set`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: streamSettings.room,
            url: url
        })
    });
}

function createButton(element, url) {
    const button = document.createElement('button');
    button.classList = "button-n stream-button";
    button.type = 'button';
    button.textContent = 'Stream';
    button.onclick = (e) => { 
        e.preventDefault(); 
        changeImage(url); 
    };

    element.insertAdjacentElement('beforebegin', button);
}

loadSettings();

setInterval(loadSettings, 5000);

const showScryfallStream = url => {
    scryfallStreamButton.style.display = 'block';
};

const images = document.querySelectorAll(`img[src*="c1.scryfall.com/file/scryfall-cards/"], img[data-src*="c1.scryfall.com/file/scryfall-cards/"]`);

images.forEach(element => {
    let jpgUrl = element.src;

    if (element.attributes['data-src']) {
        jpgUrl = element.attributes['data-src'].value;
    }

    // ex: https://c1.scryfall.com/file/scryfall-cards/large/front/3/6/367a67c7-54db-4336-b55a-3fa27625172a.jpg?1562876432
    const pngUrl = jpgUrl
        .replace('/normal/', '/png/')
        .replace('/large/', '/png/')
        .replace('.jpg', '.png');
    createButton(element, pngUrl);
});
