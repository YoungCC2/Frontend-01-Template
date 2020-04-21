/**
 *
 */
var utf8_encoding = function (utf8Str) {
    return Array.prototype.map.call(utf8Str.split(''), function (element) { return "\\u" + element.charCodeAt().toString(16); }).join("");
};
console.log(utf8_encoding("无边落木萧萧下")); // \u65e0\u8fb9\u843d\u6728\u8427\u8427\u4e0b
var unicode_utf8 = function (uniStr) {
    return unescape(uniStr.replace(/\\u/g, '%u'));
};
console.log(unicode_utf8("\u65E0\u8FB9\u843D\u6728\u8427\u8427\u4E0B")); // 无边落木萧萧下
