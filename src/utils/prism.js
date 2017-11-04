import { highlight, highlightAuto } from 'highlight.js';

const prism = (code, language) =>
    (language ? highlight(language, code, true) : highlightAuto(code)).value


export default prism;
