export interface Options {
    immersalToken?: string;
    immersalMapId?: number;
    destinationFeatureId?: string;
    parentElementId?: string;
    startText?: string;
    stopText?: string;
}
declare class ARButton {
    static createButton(options?: Options): Promise<HTMLButtonElement | HTMLAnchorElement>;
}
export { ARButton };
