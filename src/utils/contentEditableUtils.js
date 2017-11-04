/**
 * @file: content-editable-utils
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description: 
 */

export function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

export function deleteTimes(times) {
    for (let i = 0; i < times; i++) {
        document.execCommand('delete', false);
    }
}