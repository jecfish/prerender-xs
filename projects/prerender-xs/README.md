# prerender-xs

A framework agnostic library to prerender static web pages for Single Page Application (SPA). Built with [Puppeteer](https://github.com/GoogleChrome/puppeteer).

Typescript is supported out of the box.

* this is a fork from to [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) but without the need to use webpack.

# How to use it
1. Run `npm install prerender-xs`.
2. Use it in your code:

```
// create a file with any name. e.g. prerender-run.js

const { prerenderer } = require('prerender-xs');
const path = require('path');

const minimalConfig = {
    routes: ['/', '/route1', 'route2/b'], // all the routes you want to preredenr
    staticDir: path.join(__dirname, '/dist'), // where your SPA located
}

const data = await prerenderer(minimalConfig);

```

3. For example, you might want to prerender after your application build, you can hook it to npm lifecycle.

```
// your package.json file

{
    ...
    "script": {
        "build": "your existing build command",
        "postbuild": "node prerender-run.js"
    }
}

```

# Advance configurations

Some advance configuration are supported. Most configuration names are obvious, if need further clarification, can refer to [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) (please take notes that not all config of `prerender-spa-plugin` are supported in `prerender-xs`).

```
const fullConfig = {
    // mandatory config
    routes: ['/', '/route1', 'route2/b'],
    staticDir: path.join(__dirname, '/dist'),
    // optional config
    outputDir: path.join(__dirname, '/public'),
    indexHtml: '<html></html>', // instead of index.html file, you pass in the content

    renderOptions: {
        maxConcurrentRoutes: 100, //default is 10, set to 99 if you hv powerful pc
        skipThirdPartyRequests: true, // default is false
        renderAfterDocumentEvent: 'prerender-ready', // your custom event
        renderAfterTime: 1000, // wait for x milliseconds 
        renderAfterElementExists: '#container', // wait for element
    }
}
```