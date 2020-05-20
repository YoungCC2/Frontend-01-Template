const css = require('css')
let rules = [];

module.exports.addCSSRules = function parserHTML (text) {
    // console.log("==")
    
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null ,"   "))
    rules.push(...ast.stylesheet.rules);
    return rules;
}

function match (element,selector) {
    // 根据选择器 的类型 和元素属性 计算是否与当前元素匹配
    if(!selector || !element.attributes){
        return false
    }

    if(selector.charAt(0) == "#"){
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if(attr && attr.value === selector.replace("#",'')){
            return true
        }
    }else if(selector.charAt(0) == "."){
        var attr = element.attributes.filter(attr => attr.name === "class")[0]
        // if(attr && attr.value === selector.replace(".",'')){
        //     return true
        // }

        if (
            attr &&
            attr.value
              .split(/\s+/)
              .some((className) => className === selector.replace('.', ''))
          ) {
            return true
          }

    }else {
        if(element.tagName === selector){
            return true
        }
    }
    return false
}

function compare (sp1,sp2){
    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0];
    }
    if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1]
    }
    if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2]
    }
    return sp1[3] - sp2[3]

}

function specificity(selector){
    /**
     body div a.x#y
     [
         {body div a},
         {.}
         {#}
         {inline}
     ]

     选择的优先级 不同分为四个元素。越往后等级越高
     
     */
    var p = [0,0,0,0]
    var selectorParts = selector.split(" ");
    for(var part of selectorParts){
        if(part.charAt(0) == "#"){
            p[1] += 1;
        }else if(part.charAt(0) == "."){
            p[2] += 1;
        }else{
            p[3] += 1;
        }
    }
    return p;
}

module.exports.computeCSS = function  (stack,element) {
    //  必须知道元素的所有父元素 才能判断元素 与 css规则 是否匹配
    //  我们从上一步骤的 stack 可以获取本元素所有的父元素
    // 因为 我们首先获取的是 首先元素 所有我们获得和计算父元素匹配的顺序是从内向外
    // div div #myid
    //  最后一个元素 确定 一定匹配当前元素  根据最后一个元素 反推父元素的规则
    let elements = stack.slice().reverse();

    if(!element.computedStyle){
        element.computedStyle = {}
    }

    for(let rule of rules){
        // 选择器 从外向内排列
        let selectorParts = rule.selectors[0].split(" ").reverse()

        if(!match(element,selectorParts[0])){
            continue
        }

        let matched = false;

        var j = 1;  // 样式选择器
        // 复杂选择器 拆成 针对单个元素的选择器 用循环 匹配父元素队列
        for(let i = 0;i < elements.length; i++){
            // i  表示 元素
            if(match(elements[i],selectorParts[j])){
                j++;
            }
        }

        if(j >= selectorParts.length){
            matched = true
        }

        if(matched){

            var sp = specificity(rule.selectors[0])

            //  如果匹配到 我们要加入
            // console.log("Element",element, "matched rule", rule)
            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {}
                }
                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp;
                }else if(compare(computedStyle[declaration.property].specificity,sp) < 0){
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }

                // computedStyle[declaration.property].value = declaration.value
            }
            console.log(element.computedStyle)

        }
    }
}
