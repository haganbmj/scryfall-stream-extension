window.browser = (function () {
    return window.msBrowser || window.browser || window.chrome;
})();

const images = document.querySelectorAll(`img[src*="img.scryfall.com/cards/"]`);

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
    button.onclick = () => { changeImage(url); };

    // Mega quick hack to avoid putting the button within a link.
    // Happens on the search results page.
    if (element.parentElement.nodeName.toLowerCase() === 'a') {
        element.parentElement.insertAdjacentElement('beforebegin', button);
    } else {
        element.insertAdjacentElement('beforebegin', button);
    }
}

const showScryfallStream = url => {
    scryfallStreamButton.style.display = 'block';
};

images.forEach(element => {
    // ex: https://img.scryfall.com/cards/normal/en/jou/30.jpg?1517813031
    const pngUrl = element.src
        .replace('/normal/', '/png/')
        .replace('/large/', '/png/')
        .replace('.jpg', '.png');
    createButton(element, pngUrl);
});