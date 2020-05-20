const EOF = Symbol("EOF") // EOF

let currentToken = null
let currentAttribute = null
let currentTextNode = null;

// 开始生成token
let  stack = [
    {
        type:"document",
        children:[]
    }
]

// 把生成的token 进行提交
function  emit(token){
    // if(token.type != "text"){
    //     console.log(token)
    // }
    let top = stack[stack.length - 1];
    if(token.type == "startTag"){
        let element = {
            type: "element",
            children: [],
            attributes: []
        }

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" &&  p != "tagName"){
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element)
        }

        currentTextNode = null



    }else if(token.type == "endTag"){
        if(top.tagName != token.tagName){
            throw new Error("tag start end doesn`t mathch !")
        }else{
            stack.pop();
        }
        currentTextNode = null
    }else if(token.type == "text"){
        if(currentTextNode == null){
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }

}

// 接收 tag
/*
1.   开始tag  <
2.  结束tag  /
3.  自封闭 tag </>
*/

function data(c){
    if(c == "<"){
        return tagOpen;
    }else if (c == EOF){
        // 文件结束
        emit({
            type: "EOF"
        })
        return ;
    }else {
        // dom节点的 text， text 类型token
        emit({
            type: "text",
            content: c
        })
        return data
    }
}


function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        // tag名
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    }else {
        emit({
            type:"text",
            content: c
        })
        return ;
    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)){
        // 在tag名后面 解析到 空格 \t  换行 时 开始解析 属性
        return beforeAttributeName;
    }else if(c == "/"){
        // 自结束标签
        return selfClosingStartTag(c);

    }else if(c.match(/^[a-zA-Z]$/)){
        // 继续匹配到字母 说明还是一个标签名 只是在 中间夹杂 空白 \t 换行 等符号
        // 返回继续匹配

        currentToken.tagName += c   // c.toLowerCase();  组装标签名
        return tagName
    }else if(c == ">"){
        // 说明这是一个普通标签的 开始标签
        // 开始匹配下一个  回到 开头
        emit(currentToken)
        return data;
    }else {
        currentToken.tagName += c
        // 继续匹配当前标签
        return tagName
    }
}


function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c)
    }else if(c == ">"){
        // console.log()
        // console.log(currentToken)

    }else if(c == EOF){

    }else{

    }
}


function beforeAttributeName (c){
    // 忽略 空白 直到 找到有意义的字符
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
    }else if(c == ">" || c == "/" || c == EOF){
        //
        return afterAttributeName(c)
    }else if(c == "="){
        // 此时 应该是错误  因为 <html  ='x'>  没有先出现 属性名 却先出现 = 号

    }else{
        // 此处 已经避开大部分 异常 直接进入正常的属性创建
        // 创建属性节点
        currentAttribute = {
            name: "",
            value: ""
        }

        return attributeName(c);
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        return beforeAttributeValue
    }else if( c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<"){

    }else {
        
        currentAttribute.name += c;
        return attributeName
    }
}

// function afterAttributeName(c){
//     if(c.match(/^[\t\n\f ]$/)){
//         return beforeAttributeName;
//     }else if(c == "/"){
//         return selfClosingStartTag;
//     }else if(c == ">"){
//         currentToken[currentAttribute.name] = currentAttribute.value
//         emit(currentToken)
//         return data;
//     }else if(c == EOF){

//     }else {
//         currentAttribute.value += c;
//         return doubleQuoteAttributeValue
//     }
// }
function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c == "="){
        return beforeAttributeValue
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data;
    }else if(c == EOF){

    }else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: "",
            value: ""
        }
        currentAttribute.value += c;
        return doubleQuoteAttributeValue
    }
}


function beforeAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c ==">" || c == EOF ){
        return beforeAttributeValue;
    }else if(c == "\""){
        // 获取属性值  此处为第一个 双引号
        return doubleQuoteAttributeValue;
    }else if(c == "\'"){
        // 获取属性值  此处为第一个 单引号
        return singleQuoteAttributeValue;
    }else if(c==">"){

    }else{
        // 没有单双引号的 属性值
        return UnquotedAttributeValue(c)
    }
}

function UnquotedAttributeValue (c){
    if(c.match(/^[\t\n\f ]$/)){
        // 在 匹配完属性 x = a  之后 遇到空格  表示 一个属性结束 写入节点
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName;
    }else if( c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken);
        return data;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return UnquotedAttributeValue
    }
}


function doubleQuoteAttributeValue(c){
    if(c == "\""){
        // 属性值的第二个双引号   属性值 取 结束 写入节点
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }else if(c == "\u0000"){

    }else if (c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue
    }
}



function singleQuoteAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue
    }
}


// 在匹配完一个属性之后  的处理 继续进行 第二个属性 或者 标签的结尾
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        // 处理 属性之后的 空白
        return beforeAttributeName;
    }else if(c == "/"){
        // 属性值后是 / 表示 是一个  自封闭标签
        return selfClosingStartTag
    }else if(c == ">"){
        // 一个标签的 开始标签结束
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data;
    }else if(c == EOF) {

    }else {
        currentAttribute.value += c
        return doubleQuoteAttributeValue
    }
}


// 

function selfClosingStartTag (c){
    if( c== ">"){
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    }else if( c == "EOF"){
        return ;
    }else{
        // 此处 其实是  <a />   在 / 和 > 之间出现异常  的字符

    }
}


module.exports.parserHTML = function parserHTML (html) {
    // console.log(html)
    let state = data;
    for( let c of html){
        state = state(c)
    }
    state = state(EOF)
    return stack[0]

}