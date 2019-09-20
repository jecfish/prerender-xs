import puppeteer from 'puppeteer';
import promiseLimit from 'promise-limit';

import { Server } from './server.model';
import { UserOptions } from './interfaces';
import { PrerenderUtils } from './prerender.utils';

export async function render(config: UserOptions) {
    console.log('[prerendering] prerendering started');
    const renderingOptions = config.renderOptions || {};

    // start server
    const server = new Server({ staticDir: config.staticDir, indexHtml: config.indexHtml });
    const { port } = server.start();

    const baseURL = `http://localhost:${port}`;
    console.log(`[prerendering] server started: ${baseURL}!`);

    const browser = await puppeteer.launch();

    const limiter = promiseLimit(renderingOptions.maxConcurrentRoutes || 10);

    return Promise.all(
        config.routes.map(route => {
            return limiter(async () => {
                const page = await browser.newPage();

                await PrerenderUtils.handleRequestInterception({
                    skipThirdPartyRequests: renderingOptions.skipThirdPartyRequests
                }, page, baseURL);

                await page.goto(baseURL + route, { waituntil: 'networkidle0' });
                console.log(`[prerendering] rendering route ${route}`);

                if (renderingOptions.renderAfterElementExists) {
                    await page.waitForSelector(renderingOptions.renderAfterElementExists);
                }

                // Once this completes, it's safe to capture the page contents.
                await page.evaluate(PrerenderUtils.waitForRender, renderingOptions);
                const html = await page.content();

                PrerenderUtils.writeContent({ outputDir: config.outputDir || config.staticDir, route, html });
                console.log(`[prerendering] completed route ${route}`);

                await page.close();

                return { route, html };
            });
        })
    ).then((data) => {
        browser.close();
        console.log('[prerendering] shutting down server...');
        server.destroy();
        console.log('[prerendering] prerendering completed');
        return data;
    });
}
