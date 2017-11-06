import { highlight, highlightAuto } from 'highlight.js';

let worker;

const prism = async ({code, language, workerUrl}) => {

    if (typeof Worker === 'function' && !worker && typeof workerUrl === 'string') {
        worker = new Worker(workerUrl);
    }
    if (typeof workerUrl !== 'string' && worker) {
        worker.terminate();
        worker = null;
    }

    if (worker) {
        return new Promise(function (resolve) {
            worker.postMessage({type: 'highlight', arguments: [code, language]});
            worker.onmessage = ({data}) => resolve(data)
        })
    }

    return (language ? highlight(language, code, true) : highlightAuto(code)).value
}



export default prism;
