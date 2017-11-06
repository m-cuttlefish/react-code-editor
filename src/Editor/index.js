import React, {Component} from 'react'
import cn from '../utils/cn'
import prism, {killWorker} from '../utils/prism'
import normalizeCode from '../utils/normalizeCode'
import normalizeHtml from '../utils/normalizeHtml'
import htmlToPlain from '../utils/htmlToPlain'
import escape from '../utils/escape-html'
import selectionRange from '../vendor/selection-range'
import {getIndent, getLine, getLineRange, getDeindentLevel} from '../utils/getIndent'
import {setCaretPosition, deleteTimes} from '../utils/contentEditableUtils'
import Style from './Style'

class Editor extends Component {
    static defaultProps = {
        contentEditable: true,
        mountStyle: true,
        language: '',
        tabSize: 4,
        code: '',
        className: '',
        style: {},
        workerUrl: null,
        ignoreTabKey: false
    };

    id = Math.random() + '-' + new Date().getTime()

    componentWillUnmount() {
        killWorker(this.id)
    }

    undoStack = []
    undoOffset = 0
    undoTimestamp = 0
    compositing = false

    state = {
        html: ''
    }

    onRef = node => {
        this.ref = node
    }

    getPlain = () => {
        if (this._innerHTML === this.ref.innerHTML) {
            return this._plain
        }

        const plain = htmlToPlain(normalizeHtml(this.ref.innerHTML))

        this._plain = plain
        this._innerHTML = this.ref.innerHTML

        return this._plain
    }

    recordChange = (plain, selection) => {
        if (plain === this.undoStack[this.undoStack.length - 1]) {
            return
        }

        // if (this.undoOffset > 0) {
        //     this.undoStack = this.undoStack.slice(0, -this.undoOffset)
        //     this.undoOffset = 0
        // }

        const timestamp = Date.now()
        const record = {plain, selection}

        // Overwrite last record if threshold is not crossed
        if (timestamp - this.undoTimestamp < 3000) {
            this.undoStack[this.undoStack.length - 1] = record
        } else {
            this.undoStack.push(record)

            if (this.undoStack.length > 50) {
                this.undoStack.shift()
            }
        }

        this.undoTimestamp = timestamp
    }

    updateContent = async (plain = this.getPlain(), callback) => {
        const highlighted = await prism({id: this.id, code: plain, language: this.props.language, workerUrl: this.props.workerUrl});
        this.setState({html: highlighted}, callback)

        if (this.props.onChange) {
            this.props.onChange(plain)
        }
    }

    restoreStackState = offset => {
        const {plain, selection} = this.undoStack[this.undoStack.length - 1 - offset]

        this.selection = selection
        this.undoOffset = offset
        this.updateContent(plain)
    }

    undo = () => {
        const offset = this.undoOffset + 1
        if (offset >= this.undoStack.length) {
            return
        }

        this.restoreStackState(offset)
    }

    redo = () => {
        const offset = this.undoOffset - 1
        if (offset < 0) {
            return
        }

        this.restoreStackState(offset)
    }

    onKeyDown = evt => {
        const {
            onKeyDown,
            tabSize
        } = this.props;

        if (onKeyDown) {
            onKeyDown(evt);
        }

        if (this.props.ignoreTabKey && evt.keyCode === 9) {
            return
        }

        let shiftTab = false;
        if (evt.keyCode === 9 && !evt.shiftKey) { // Tab Key
            document.execCommand('insertText', false, ' '.repeat(tabSize))
            evt.preventDefault()
        } else if (
            evt.keyCode === 8 || (shiftTab = evt.keyCode === 9 && evt.shiftKey)
        ) { // Backspace Key / Shift Tab
            const {start: cursorPos, end: cursorEndPos} = selectionRange(this.ref)
            if (cursorPos !== cursorEndPos) {
                return // Bail on selections
            }

            const deindent = getDeindentLevel(this.getPlain(), cursorPos, tabSize);
            if (deindent <= 0) {
                shiftTab && evt.preventDefault();
                return // Bail when deindent level defaults to 0
            }

            // Delete chars `deindent` times
            deleteTimes(deindent);

            evt.preventDefault()
        } else if (evt.keyCode === 13) { // Enter Key
            const {start: cursorPos} = selectionRange(this.ref)
            const indentation = getIndent(this.getPlain(), cursorPos)
            document.execCommand('insertHTML', false, '\n' + indentation)
            evt.preventDefault()
            // this.undoTimestamp = 0
        } else if (
            // Undo / Redo
            evt.keyCode === 90 &&
            evt.metaKey !== evt.ctrlKey &&
            !evt.altKey
        ) {
            if (evt.shiftKey) {
                this.redo()
            } else {
                this.undo()
            }

            evt.preventDefault()
        } else if (
            // Cmd/Ctrl + `/`
            evt.ctrlKey !== evt.metaKey &&
            evt.keyCode === 191
        ) {
            evt.preventDefault();

            const {start: cursorPos, end: selectionEndPos} = selectionRange(this.ref);
            const plain = this.getPlain();
            const range = getLineRange(plain, cursorPos);
            const line = getLine(plain, cursorPos);
            // Remove `//` begin of line
            if (/^(\s*)(\/\/\s?)/.test(line)) {
                const pos = range[0] + RegExp.$1.length + RegExp.$2.length;
                selectionRange(this.ref, {start: pos, end: pos});
                deleteTimes(RegExp.$2.length);
                selectionRange(this.ref, {start: cursorPos - RegExp.$2.length, end: selectionEndPos - RegExp.$2.length});

                return;
            }

            // Append `// ` begin of line
            selectionRange(this.ref, {start: range[0], end: range[0]});
            document.execCommand('insertText', false, '// ');
            if (range[1] !== plain.length) {
                selectionRange(this.ref, {start: (cursorPos - range[0]) + range[1], end: (selectionEndPos - range[0]) + range[1]});
            } else {
                // EOF
                selectionRange(this.ref, {start: cursorPos + 3, end: selectionEndPos + 3});
            }
        } else if (
            // Cmd/Ctrl + `D`
            evt.ctrlKey !== evt.metaKey &&
            evt.keyCode === 68
        ) {
            evt.preventDefault();
            const {start: cursorPos, end: selectionEndPos} = selectionRange(this.ref)
            const plain = this.getPlain()
            const line = getLine(plain, cursorPos)
            const range = getLineRange(plain, cursorPos)
            if (cursorPos === selectionEndPos) {
                selectionRange(this.ref, {start: range[1], end: range[1]})
                if (range[1] !== plain.length) {
                    document.execCommand('insertText', false, line.replace(/\n$/, '\r\n'))
                } else {
                    document.execCommand('insertText', false, '\n' + line.replace(/\n$/, '\r\n'))
                }

                const {start, end} = selectionRange(this.ref)
                selectionRange(this.ref, {
                    start: range[1] + (cursorPos - range[0]),
                    end: range[1] + (selectionEndPos - range[0])
                });
            }
            else {
                selectionRange(this.ref, {
                    start: selectionEndPos,
                    end: selectionEndPos
                });
                const selectionText
                    = line.substring(cursorPos - range[0], selectionEndPos - range[0])
                document.execCommand('insertText', false, selectionText);
                selectionRange(this.ref, {
                    start: selectionEndPos,
                    end: selectionEndPos + selectionText.length
                });
            }
        }
    }

    onKeyUp = evt => {
        if (this.props.onKeyUp) {
            this.props.onKeyUp(evt)
        }
        // if (
        //     (
        //         evt.keyCode === 91 || // left cmd
        //         evt.keyCode === 93 || // right cmd
        //         evt.ctrlKey ||
        //         evt.metaKey
        //     ) && (evt.keyCode !== 191 || evt.keyCode !== 68)
        // ) {
        //     return;
        // }

        // Enter key
        if (evt.keyCode === 13) {
            this.undoTimestamp = 0
        }

        this.selection = selectionRange(this.ref)

        if (
            evt.keyCode !== 37 && // left
            evt.keyCode !== 38 && // up
            evt.keyCode !== 39 && // right
            evt.keyCode !== 40 // down
        ) {
            const plain = this.getPlain();

            this.recordChange(plain, this.selection);
            !this.compositing && this.updateContent(plain);
        } else {
            this.undoTimestamp = 0
        }
    }

    onCompositionStart = evt => {
        if (this.props.onCompositionStart) {
            this.props.onCompositionStart(evt)
        }
        this.compositing = true;
    }

    onCompositionEnd = evt => {
        if (this.props.onCompositionEnd) {
            this.props.onCompositionEnd(evt)
        }
        this.compositing = false;
    }

    onClick = evt => {
        if (this.props.onClick) {
            this.props.onClick(evt)
        }
        this.undoTimestamp = 0 // Reset timestamp
        this.selection = selectionRange(this.ref)
    }

    async componentDidMount() {
        const html = await prism({id: this.id, code: normalizeCode(this.props.code), language: this.props.language, workerUrl: this.props.workerUrl})
        this.setState({html})
        this.recordChange(this.getPlain())
        this.undoTimestamp = 0 // Reset timestamp
    }

    async componentWillReceiveProps({code, language, workerUrl}) {
        if (code !== this.props.code || language !== this.props.language || workerUrl !== this.props.workerUrl) {
            const html = await prism({id: this.id, code: normalizeCode(code), language, workerUrl})
            this.setState({html})
        }
    }

    componentDidUpdate() {
        const {selection} = this
        if (selection) {
            selectionRange(this.ref, selection)
        }
    }

    render() {
        const {
            contentEditable,
            className,
            mountStyle,
            tabSize,
            style,
            workerUrl,
            code, // ignored & unused
            ignoreTabKey, // ignored & unused
            language, // ignored & unused
            ...rest
        } = this.props
        const {html} = this.state
        return (
            <pre>
                {mountStyle && <Style/>}
                <code
                    spellCheck="false"
                    {...rest}
                    ref={this.onRef}
                    style={style}
                    onKeyDown={contentEditable ? this.onKeyDown : undefined}
                    onKeyUp={contentEditable ? this.onKeyUp : undefined}
                    onCompositionEnd={contentEditable ? this.onCompositionEnd : undefined}
                    onCompositionStart={contentEditable ? this.onCompositionStart : undefined}
                    onClick={contentEditable ? this.onClick : undefined}
                    contentEditable={contentEditable}
                    className={cn('code-editor', 'hljs', className)}
                    dangerouslySetInnerHTML={{__html: html}}
                />
            </pre>
        )
    }
}

export default Editor
