export const getLine = (plain, cursorPos) => {
    const endSlice = plain.slice(cursorPos);
    const startSlice = plain.slice(0, cursorPos)
    const lastNewline = startSlice.lastIndexOf('\n') + 1

    let endNewline = endSlice.indexOf('\n') + 1
    endNewline = endNewline === 0 ? plain.length : endNewline;

    return startSlice.slice(lastNewline) + endSlice.slice(0, endNewline)
}

export const getLineRange = (plain, cursorPos) => {
    const endSlice = plain.slice(cursorPos);
    const startSlice = plain.slice(0, cursorPos)
    const lastNewline = startSlice.lastIndexOf('\n') + 1

    let endNewline = endSlice.indexOf('\n') + 1
    endNewline = endNewline === 0 ? plain.length : endNewline;

    const prefix = startSlice.slice(lastNewline)
    const suffix = endSlice.slice(0, endNewline)

    return [cursorPos - prefix.length, cursorPos + suffix.length]
}


export const getBeforeLine = (plain, cursorPos) => {
    const startSlice = plain.slice(0, cursorPos)
    const lastNewline = startSlice.lastIndexOf('\n') + 1
    return startSlice.slice(lastNewline)
}

const indentRe = /^\s+/

export const getIndent = (plain, cursorPos) => {
    const line = getBeforeLine(plain, cursorPos)
    const matches = line.match(indentRe)
    if (matches === null) {
        return ''
    }

    return matches[0] || ''
}

const deindentSpacesRe = /^(\t|  )*  $/

export const getDeindentLevel = (plain, cursorPos, tabSize = 2) => {
    const line = getBeforeLine(plain, cursorPos)
    if (!deindentSpacesRe.test(line)) {
        return 0 // Doesn't match regex, so normal behaviour can apply
    }

    // The line contains only whitespace indentation
    // thus two characters must be deleted
    return tabSize;
}
