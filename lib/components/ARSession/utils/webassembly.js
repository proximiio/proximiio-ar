export async function loadWasm() {
    const imports = {}; // Omitted the contents since it's most likely irrelevant
    /*const response = await fetch('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/PosePlugin.wasm');
    const buffer = await response.arrayBuffer();
    const obj = await WebAssembly.instantiate(buffer, imports);*/
    const module = await WebAssembly.instantiateStreaming(fetch('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/PosePlugin.js'), imports);
    console.log(module);
    return module;
}
