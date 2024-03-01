declare class WorkerHandler {
    private worker;
    constructor();
    private handleMessage;
    postMessageToWorker(message: any): void;
}
export default WorkerHandler;
