/**
 * 
 */
const utf8_encoding = (utf8Str:String)=>{
    return Array.prototype.map.call(utf8Str.split(''),(element)=> `\\u${element.charCodeAt().toString(16)}`).join("")
}

console.log(utf8_encoding("无边落木萧萧下"))  // \u65e0\u8fb9\u843d\u6728\u8427\u8427\u4e0b


const unicode_utf8 = (uniStr:String)=>{
    return unescape(uniStr.replace(/\\u/g, '%u'))
}

console.log(unicode_utf8(`\u65e0\u8fb9\u843d\u6728\u8427\u8427\u4e0b`))  // 无边落木萧萧下

