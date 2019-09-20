import express from 'express';
import { join } from 'path';
import { UserOptions } from './interfaces';

export class Server {
    private listener: any;
    private options: UserOptions;

    constructor(options: UserOptions) {
        this.options = options;
    }

    start() {
        const app = express();
        app.get('*', express.static(join(this.options.staticDir), { dotfiles: 'allow' }));
        app.get('*', (_, res) => this.options.indexHtml ?
            res.send(this.options.indexHtml) :
            res.sendFile(join(this.options.staticDir, 'index.html')));

        this.listener = app.listen(0); // dynamic port
        return { port: this.listener.address().port as number };
    }

    destroy() {
        if (!this.listener) {
            return;
        }
        this.listener.close();
    }
}
