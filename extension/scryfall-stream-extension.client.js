window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

const streamSettings = {
};

function loadSettings() {
    window.browser.storage.local.get('room', data => {
        console.log(`room: ${data.room}`);
        streamSettings.room = data.room;
    });

    window.browser.storage.local.get('server', data => {
        console.log(`server: ${data.server}`);
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

const images = document.querySelectorAll(`img[src*="img.scryfall.com/cards/"], img[data-src*="img.scryfall.com/cards/"]`);

images.forEach(element => {
    let jpgUrl = element.src;

    if (element.attributes['data-src']) {
        jpgUrl = element.attributes['data-src'].value;
    }

    // ex: https://img.scryfall.com/cards/normal/en/jou/30.jpg?1517813031
    const pngUrl = jpgUrl
        .replace('/normal/', '/png/')
        .replace('/large/', '/png/')
        .replace('.jpg', '.png');
    createButton(element, pngUrl);
});
