import { highlight, highlightAuto } from 'highlight.js';

let worker = null;

const prism = async ({code, language, workerUrl, id}) => {

    return new Promise(function (resolve) {
        if (typeof Worker === 'function' && !worker && typeof workerUrl === 'string') {
            worker = new Worker(workerUrl);
            worker.onmessage = ({data: {result, id: workerId}}) => (id === workerId) && resolve(result)
        }
        if (typeof workerUrl !== 'string' && worker) {
            killWorker()
        }

        if (worker) {
            worker.postMessage({type: 'highlight', id, arguments: [code, language]})
            return
        }
        resolve(
            (language ? highlight(language, code, true) : highlightAuto(code)).value
        )
    });

}

export function killWorker() {
    if (!worker) return

    worker.terminate()
    worker = null
}


export default prism;
