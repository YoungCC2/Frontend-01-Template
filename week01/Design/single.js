
// 单例模式  

// 该类的方法每次调用都会返回当前实例对象

class Single {
    constructor(name){
        this.name = name
    }

    count(){
        this.name = this.name + "count"
        return this
    }

    getName(){
        this.name = this.name + "sec"
        return this
    }
}


var sing = new Single("sin")

var sing2 = new Single("sin2")
console.log(sing)
console.log(sing.getName().count().getName())

console.log(sing2)



function Single_proto (name){
    this.name = name
}

Single_proto.prototype.getName = function(){
    this.name = this.name + "sec"
    return this
}

Single_proto.prototype.count = function(){
    this.name = this.name + "count"
    return this
}


var sing_p = new Single_proto("sing_p")

console.log(sing_p)
console.log(sing_p.getName().count().getName()  instanceof Single_proto)

