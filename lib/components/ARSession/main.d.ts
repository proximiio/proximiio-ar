export interface Options {
    immersalToken?: string;
    immersalMapId?: number;
    destinationFeatureId?: string;
}
declare class ARSession {
    private static onStopListeners;
    private static onStartListeners;
    static start(options?: Options): Promise<void>;
    static stop(destinationFeatureId?: string): Promise<void>;
    onStart(callback: () => void): void;
    onStop(callback: (destinationFeatureId?: string) => void): void;
}
export { ARSession };
