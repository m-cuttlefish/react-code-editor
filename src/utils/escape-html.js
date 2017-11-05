/**
 * @file: escape-html
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description: 
 */

module.exports = function (str) {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
}