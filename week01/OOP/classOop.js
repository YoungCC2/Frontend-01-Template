
// let  Person = class {
    
// }
//  name 为公有字段  可以在类外部访问
class Person {
    static TYPE = "ADMIN"  // 静态字段
    static #MAX = 5;  // 私有静态字段
    static #max = 0;

    
    static #takeNames = [];

    static inNameToken(name) {
        return Person.#takeNames.includes(name)
    }


    #name;  // 私有字段   在class内部使用 
    type;   // 公开字段
    name = "Unknown"
    constructor(name,type){
        // super()
        Person.#max++

        if(Person.#max>Person.#MAX){
            throw new Error("xx")
        }

        this.#name = name;
        this.name = name;
        this.type = type
        Person.#takeNames.push(name)
    }
   
    

    setName(name) {
        this.#name = name
    }

    getName() {    
        return this.#name;  
    }

    nameContains(str){
        return this.getName().includes(str);
    }

    #nameValue = "";

    get name (){
        console.log("get")
        return this.#nameValue
    }

    set name (name){
        if(name == ""){
            throw new Error("error")
        }
        this.#nameValue = name
    }



}

const us = new Person("us",Person.TYPE)

const as = new Person("as", Person.TYPE)
// console.log(us.#name)  // ERROR
console.log(as)

// const ts = new Person("ts",Person.TYPE)

us.setName("uus")
console.log('us.getName()',us.getName())


us.name="xx"
console.log(us.name)

console.log(us.type)
console.log(Person.TYPE)

console.log(us.nameContains("xx"))

console.log(Person.inNameToken("us"))
console.log(Person.inNameToken("uss"))

// console.log(Person().foot)  // error

class User extends Person {
    posts = [];

    constructor(name,posts){
        super(name)

        this.posts = posts;
    }

    // 子类 重写了 父类的方法 getName
    //  方法重写
    getName() {
        const name = super.getName()
        if(name===''){
            return 'unKnown'
        }
        return name
    }
}

const user = new User("user","come")
const user1 = new User("",["Why I like JS"])

console.log(user1)

console.log('user',user, 'user.getName',user.getName())
console.log(user.name)
console.log(user.posts)


// 对象类型检测

// object instanceof Class   判断object 是否为 Class 实例的操作符

// instanceof 是多态的：该操作符认为子类实例也是父类的实例。
console.log(user instanceof User)
console.log({} instanceof User)







// class 版本的类

class Animal {
    constructor(name){
        this.name = name
    }

    getName() {
        return this.name
    }
}


const animal = new Animal("dog")

console.log('animal',animal)
console.log('animal.getName',animal.getName())

console.log('instanceof ', animal instanceof  Animal);

// prototype 版本

function AnimalPrototype(name){
    this.name = name
}


AnimalPrototype.prototype.getName = function(){
    return this.name
}


const animalPrototype = new AnimalPrototype("cat");

console.log('animalPrototype',animalPrototype);
console.log('animalPrototype',animalPrototype.getName());
console.log('instanceof ', animalPrototype instanceof  AnimalPrototype);