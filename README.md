# scryfall-stream-extension

```sh
cd server
npm install
node index.js
```

## Firefox
Navigate to `about:debugging` and select "Load Temporary Add-on..."

Select `extension/manifest.json`

This only keeps it loaded until the browser restarts though and might only be enabled in Developer Mode?

## Chrome
Navigate to `chrome://extensions/` and select "Load unpacked"

Select the `extension` directory.

## OBS
Add a browser source for the url `http://localhost:8080`, set the size as needed. The scryfall images vary, but are around a 0.716 ratio. 

I had one that was 672x936 (appears to be common?) and another that was 745x1040.