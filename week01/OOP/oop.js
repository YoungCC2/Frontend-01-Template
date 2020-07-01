/*
class的 特性
构造函数
方法 
    -静态方法
    -实例方法
    -类方法



*/


//

/*
1. 字面量创建对象
无法复用 
无法使用new关键字创建对象
无法通过原型链 添加方法属性
省略了构造函数传参初始化这一过程
*/
let Person = {
    name: "",
    age: 0,
    eat:function(){
        console.log(this.age)
    }
}


// Person.prototype.sc = function (){
//     console.log("xx")
// }
// 
// Person.sc()   // Cannot set property 'sc' of undefined


//
/*
2. 字面量创建原型对象

没有构造函数  无法设置初始值
实例对象共享属性
*/


function Person2(){}

Person2.prototype = {
    name:"JJ",
    age: 10,
    ss: [1],
    eat: function(){
        console.log(this.age)
        console.log("eat")
    }
}

var p = new Person2()

p.ss.push("xx")

var p2= new Person2()
// p2.age = 11;
console.log(p2.ss)
console.log(p.ss)
p2.eat()