# react-code-editor


## Feature
1. Code Highlight  
2. Cmd/Ctrl + D (Duplicate Line or Selection)
3. Cmd/Ctrl + / (Append/Remove Inline Comment)


## Options

```js
static defaultProps = {
    // Web Worker for fast
    workerUrl: null,
    contentEditable: true,
    // whether inject preset style?
    mountStyle: true,
    // the language of code
    language: '',
    tabSize: 4,
    code: '',
    className: '',
    style: {},
    // true: TabKey performance is switching active item.
    ignoreTabKey: false,
    onChange: code => {},
    // ...rest props of dom
};
```

## Todo

- [ ] worker.js ?