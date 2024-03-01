// MyWorker.ts
const ctx = self;
ctx.addEventListener('message', (event) => {
    const message = event.data;
    console.log('Worker received message:', message);
    ctx.postMessage(`Worker received: ${message}`);
});
export default null; // Trick to avoid TypeScript error, as Workers don't support imports directly
