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
    <CodeEditor
        mountStyle={true}
        language="jsx"
        className="language-jsx"
        code={code}
        ignoreTabKey
        onChange={data => {

        }}
    />,
    document.getElementById('root')
);