export declare class WorkerComponent {
    private module;
    private moduleReady;
    private events;
    constructor();
    private initializeModule;
    ensureModuleReady(): Promise<void>;
    onMessage(callback: (event: MessageEvent) => void): void;
    handleMessage(e: MessageEvent): Promise<void>;
}
