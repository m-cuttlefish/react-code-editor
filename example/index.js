/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/3
 * @description: Index of Example
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CodeEditor from '../src';

import 'highlight.js/styles/tomorrow-night.css'

const code = `
import React from 'react';
export default () => <h1>abc</h1>;
`

ReactDOM.render(
    <div>
        <CodeEditor
            workerUrl={"/example/hljs.worker.js.file"}
            // workerURL={null}
            mountStyle={true}
            language="jsx"
            className="language-jsx"
            code={code + '\n // sss'}
            ignoreTabKey
            onChange={data => {

            }}
        />
        <CodeEditor
            workerUrl={"/example/hljs.worker.js.file"}
            // workerURL={null}
            mountStyle={true}
            language="jsx"
            className="language-jsx"
            code={code}
            ignoreTabKey
            onChange={data => {

            }}
        />
    </div>,
    document.getElementById('root')
);