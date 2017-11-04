/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2017/11/3
 * @description: Index of Example
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CodeEditor from '..';

import 'highlight.js/styles/github.css'

const code = `
import React from 'react';
export default () => <h1>abc</h1>;
`

ReactDOM.render(
    <CodeEditor
        mountStyle={false}
        language="jsx"
        className="language-jsx"
        code={code}
        onChange={evt => {

        }}
    />,
    document.getElementById('root')
);