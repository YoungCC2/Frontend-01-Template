function create(Cls,attribute,...children){
    let o ;

    if(typeof Cls === "string"){
        o = new Wrapper(Cls);
    }else{
        o = new Cls({
            timer: {}
        });
    }

    
    // console.log(arguments)

    for(let name in attribute){
        // o[name] = attribute[name]
        o.setAtttibute(name,attribute[name]);
    }

    for(let child of children){
        if(typeof child === "string"){
            child = new Text(child);
        }

        o.appendChild(child)
        
        // o.children.push(child)
    }

    // console.log(children)
    return o;
}

class Text {
    constructor(text){
        this.root = document.createTextNode(text)
    }

    mountTo(parent){
        parent.appendChild(this.root)
    }
}

class Wrapper {
    constructor(type){
        // console.log("config",config)
        this.children = []
        this.root = document.createElement(type)
    }

    setAtttibute(name,value) { // attribute
        // console.log(name,value)
        this.root.setAttribute(name,value)
    }

    mountTo(parent) {
        parent.appendChild(this.root)

        for(let child of this.children){
            child.mountTo(this.root)
        }
    }

    appendChild(child){ // children
        this.children.push(child)
    }
}

class MyComponent {
    constructor(config){
        // console.log("config",config)
        this.children = []
        this.root = document.createElement("div")
    }

    // set class (v){  // property class
    //     console.log("Parent::class",v)
    // }

    // set id (v){ // property id
    //     console.log("Parent::id",v)
    // }

    setAtttibute(name,value) { // attribute
        // console.log(name,value)
        this.root.setAttribute(name,value)
    }

   

    appendChild(child){ // children
        // console.log("Parent::appendChild",child)
        // this.root.appendChild(child)
        // child.mountTo(this.root)
        this.children.push(child)
    }

    render(){
        
        return <article>
            <header>header</header>
            {this.slot}
            <footer>footer</footer>
        </article>
    }

    mountTo(parent) {
        this.slot = <div></div>
        // parent.appendChild(this.root)
        

        for(let child of this.children){
            this.slot.appendChild(child)
        } 

        this.render().mountTo(parent)
    }
}

// class Child {
//     constructor(config){
//         console.log("config",config)
//         this.children = []
//         this.root = document.createElement("div")
//     }

//     // set class (v){  // property class
//     //     console.log("Parent::class",v)
//     // }

//     // set id (v){ // property id
//     //     console.log("Parent::id",v)
//     // }

//     setAtttibute(name,value) { // attribute
//         // console.log(name,value)
//         this.root.setAttribute(name,value)
//     }

//     mountTo(parent) {
//         parent.appendChild(this.root)
//     }

//     appendChild(child){ // children
//         // console.log("Parent::appendChild",child)
//         // this.root.appendChild(child)
//         child.mountTo(this.root)
//     }
// }

// let component = <div id="a" class="b" style="width:100px;height:100px;background-color:lightgreen">
//     <div/>
//     <div/>
//     <div/>
//     <p></p>
//     <div>x</div>
// </div>


// let component = <div>{new Wrapper("span")}</div>
// let component = <div>{1}</div>
let component = <MyComponent>
    <div>text</div>
</MyComponent>
component.mountTo(document.body)

// component.class = "c"
// component.id = "d"

// console.log(component)

// component.setAttribute("id",a);
