export interface UserOptions {
    staticDir?: string;
    outputDir?: string;
    routes?: string[];
    indexHtml?: string;
    renderOptions?: RendererOptions;
}

export interface RendererOptions {
    maxConcurrentRoutes?: number;
    skipThirdPartyRequests?: boolean;
    renderAfterDocumentEvent?: string;
    renderAfterTime?: number;
    renderAfterElementExists?: string;
}
