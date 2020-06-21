// function 
// var map = new Array(10001).join(0).split('').map(s=>Number(s))
var map = localStorage.map ? JSON.parse(localStorage.map) : new Array(10000).fill(0)


var containter = document.getElementById("containter")
for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
        let cell = document.createElement("div")

        cell.classList.add("cell");

        if (map[y * 100 + x] === 1) {
            cell.style.backgroundColor = 'black';
        }

        cell.addEventListener("mousemove", () => {
            if (mouse) {
                cell.style.backgroundColor = "black";
                if (clear) {
                    cell.style.backgroundColor = '';
                    map[y * 100 + x] = 0
                } else {
                    cell.style.backgroundColor = 'black';
                    map[y * 100 + x] = 1
                }
            }
        })

        containter.appendChild(cell)
    }
}


let mouse = false;
let clear = false

document.addEventListener("mousedown", e => {
    mouse = true
    clear = (e.which === 3)
})
document.addEventListener("mouseup", () => mouse = false)
document.addEventListener("contextmenu", (e) => e.preventDefault())

document.getElementById("save").addEventListener("click", () => {
    localStorage.map = JSON.stringify(map)
})


function sleep(t) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t)
    })
}

/*
寻路  递归
1. 标记走过的路  （  不走回头路
2. 由内外向外搜索  直到 路径 包含终止点




*/
async function findPath(map, start, end) {
    map = map.slice();
    let queue = [start];


    function distance ([x,y]) {
        return (x - end[0]) ** 2 + (y-end[1]) ** 2
    }

    let collection = new Sorted([start],(a,b) => distance(a) - distance(b))

    async function insert([x, y], pre) {
        if (map[100 * y + x] !== 0) {
            return;
        }

        if (x < 0 || y < 0 || x >= 100 || y >= 100) {
            return;
        }

        map[100 * y + x] = pre

        containter.children[y * 100 + x].style.backgroundColor = "lightgreen"
        await sleep(5)
        collection.insert([x,y])
        // queue.push([x, y]);
    }

    // while (queue.length) {
        while (collection.length) {
        // let [x, y] = queue.shift()  // pop    unshift / push shift
        let [x,y] =  collection.take()

        if (x === end[0] && y === end[1]) {
            let path = []

            while (x !== start[0] || y !== start[1]) {
                path.push([x, y])
                console.log([x, y])
                containter.children[y * 100 + x].style.backgroundColor = "red";

                [x, y] = map[y * 100 + x]
            }

            return path

        }


        await insert([x - 1, y], [x, y])
        await insert([x + 1, y], [x, y])
        await insert([x, y - 1], [x, y])
        await insert([x, y + 1], [x, y])

        await insert([x - 1, y - 1], [x, y])
        await insert([x + 1, y - 1], [x, y])
        await insert([x - 1, y + 1], [x, y])
        await insert([x + 1, y + 1], [x, y])
    }

    return null

}




class Sorted {
    constructor(data,compare){
        this.data = data;
        this.compare = compare;
    }

    take (){
        if(!this.data.length){
            return ;
        }
        let min = this.data[0]
        let minIndex = 0

        for(let i= 0;i<this.data.length;i++) {
            if(this.compare(this.data[i], min ) < 0 ){
                min = this.data[i]
                minIndex = i;
            }
        }
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min
    }

    insert (v){
        this.data.push(v)
    }

     get length (){
         return this.data.length
     }
}