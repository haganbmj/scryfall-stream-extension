MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const observer = new MutationObserver((mutations, observer) => {
    console.log(mutations, observer);
    mutations.reduce(mutation => {
        mutation.target.nodeName === "IMG"
    })
});

observer.observe(document, {
    subtree: true,
    attributes: true
});