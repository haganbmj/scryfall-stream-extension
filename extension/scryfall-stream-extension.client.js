window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

// chrome.storage.local.set({
//     'room': 'test'
// });

chrome.storage.local.get('room', value => {
    console.log(value);
});

const images = document.querySelectorAll(`img[src*="img.scryfall.com/cards/"], img[data-src*="img.scryfall.com/cards/"]`);

function changeImage(url) {
    fetch('http://localhost:8080/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: 'test',
            'url': url
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

const showScryfallStream = url => {
    scryfallStreamButton.style.display = 'block';
};

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
