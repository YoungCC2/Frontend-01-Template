var regexp = /([0-9\.]+)|([ ]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g

var dict = ["Number", "WhiteSpace", "LineTerminator", "+", "-", "*", "/"]


function emitToken() { }

function* tokenize(source) {
    var result = null;
    var lastIndex = 0;

    do {
        lastIndex = regexp.lastIndex
        result = regexp.exec(source)

        if (!result) break;

        if (regexp.lastIndex - lastIndex > result[0].length) {
            throw new Error("Unexpected token \"" + source.slice(lastIndex, regexp.lastIndex - result[0].length) + "\"!")
        }

        let token = {
            type: null,
            value: null
        }

        for (var i = 0; i < dict.length; i++) {
            if (result[i + 1]) {
                token.type = (dict[i])
            }
        }

        token.value = (result[0])
        yield token
        // console.log(token)
    } while (result)

    yield { type: "EOF" }
}


function Expression(source) {
    if(source[0].type === "AdditiveExpression" && source[1] && source[1].type=== "EOF"){
        let node = {
            type: "Expression",
            children: [source.shift(),source.shift()]
        }

        source.unshift(node)
        return node
    }

    AdditiveExpression(source)
    return Expression(source)
}

function AdditiveExpression(source) {
    if (source[0].type === "Number") {
        // 先处理 乘除法  再处理加减法
        MultiplicativeExpression(source)
        // 再处理加减法
        return AdditiveExpression(source)
    }

    // 遇到乘法表达式
    if (source[0].type === "MultiplicativeExpression") {
        let node = {
            type: "AdditiveExpression",
            children: [source.shift()]
        }

        source.unshift(node);
        return AdditiveExpression(source)
    }



    if (source[0].type === "AdditiveExpression" &&
        source.length > 1 && source[1].type === "+") {
        let node = {
            type: "AdditiveExpression",
            children: [source.shift(), source.shift()]
        }
        //   加法 此处需要考虑   + 或者- 之后的数字 可能进行 乘除法 需要处理
        // 乘除法 因为处理优先级最高 不需考虑
        MultiplicativeExpression(source)

        node.children.push(source.shift())

        source.unshift(node);

        return AdditiveExpression(source)
    }

    if (source[0].type === "AdditiveExpression" &&
        source.length > 1 && source[1].type === "-") {

        let node = {
            type: "AdditiveExpression",
            children: [source.shift(), source.shift()]
        }

        MultiplicativeExpression(source)
        node.children.push(source.shift())

        source.unshift(node);

        return AdditiveExpression(source)
    }

    if (source[0].type === "AdditiveExpression") {
        return source[0]
    }


}


/*
乘法  
普通 a  * b
连乘 a * *b *  c  递归调用

*/

function MultiplicativeExpression(source) {
    if (source[0].type === "Number") {

        let node = {
            type: "MultiplicativeExpression",
            children: source.shift()
        }

        source.unshift(node);
        return MultiplicativeExpression(source)
    }

    if (source[0].type === "MultiplicativeExpression" &&
        source.length > 1 && source[1].type === "*") {

        let node = {
            type: "MultiplicativeExpression",
            children: [source.shift(), source.shift(), source.shift()]
        }

        source.unshift(node);

        return MultiplicativeExpression(source)
    }

    if (source[0].type === "MultiplicativeExpression" &&
        source.length > 1 && source[1].type === "/") {

        let node = {
            type: "MultiplicativeExpression",
            children: [source.shift(), source.shift(), source.shift()]
        }

        source.unshift(node);
        return MultiplicativeExpression(source)
    }


    // 检测到 除 *  /  数字之外的符号
    if (source[0].type === "MultiplicativeExpression") {
        return source[0]
    }

    throw new Error();

}


let source = [];





for (let token of tokenize("5 + 1024 * 2")) {
    if (token.type !== "WhiteSpace" && token.type !== "LineTerminator") {
        source.push(token)
    }

}

// MultiplicativeExpression(source)
console.log(Expression(source))
