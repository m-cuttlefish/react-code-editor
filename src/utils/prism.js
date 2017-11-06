import { highlight, highlightAuto } from 'highlight.js';

let workerPool = {};

const prism = async ({code, language, workerUrl, id}) => {
    let worker = workerPool[id]

    if (typeof Worker === 'function' && !worker && typeof workerUrl === 'string') {
        worker = new Worker(workerUrl);
        workerPool[id] = worker;
    }
    if (typeof workerUrl !== 'string' && worker) {
        killWorker(id)
    }

    if (worker) {
        return new Promise(function (resolve) {
            worker.postMessage({type: 'highlight', id, arguments: [code, language]})
            worker.addEventListener('message', ({data}) => resolve(data))
        })
    }

    return (language ? highlight(language, code, true) : highlightAuto(code)).value
}

export function killWorker(id) {
    let worker = workerPool[id]
    if (!worker) return

    worker.terminate()
    worker = null
}


export default prism;
