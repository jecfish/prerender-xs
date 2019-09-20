import { join, dirname } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { RendererOptions } from './interfaces';

export class PrerenderUtils {
    static waitForRender(options: RendererOptions) {
        options = options || {};

        return new Promise((resolve, _) => {
            // Render when an event fires on the document.
            if (options.renderAfterDocumentEvent) {
                // tslint:disable-next-line
                if (window['__PRERENDER_STATUS'] && window['__PRERENDER_STATUS'].__DOCUMENT_EVENT_RESOLVED) {
                    resolve();
                }

                document.addEventListener(options.renderAfterDocumentEvent, () => resolve());

                // Render after a certain number of milliseconds.
            } else if (options.renderAfterTime) {
                setTimeout(() => resolve(), options.renderAfterTime);

                // Default: Render immediately after page content loads.
            } else {
                resolve();
            }
        });
    }

    static writeContent({ outputDir, route, html }) {
        // Defining the html file name that will be created
        const file = join(outputDir, route, 'index.html');

        // Test if the directory exist, if not create the directory
        const dir = dirname(file);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true } as any);
        }

        // Write the rendered html file
        writeFileSync(file, html);
    }

    static async handleRequestInterception(options: RendererOptions, page: any, baseURL: string) {
        await page.setRequestInterception(true);

        page.on('request', req => {
            // Skip third party requests if needed.
            if (options.skipThirdPartyRequests) {
                if (!req.url().startsWith(baseURL)) {
                    req.abort();
                    return;
                }
            }

            req.continue();
        });
    }
}
