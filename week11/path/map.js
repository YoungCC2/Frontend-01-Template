// function 
// var map = new Array(10001).join(0).split('').map(s=>Number(s))
var map = localStorage.map ?  JSON.parse(localStorage.map) : new Array(10000).fill(0)


var containter = document.getElementById("containter")
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        let cell = document.createElement("div")

        cell.classList.add("cell");

        if(map[i*100 + j] === 1){
            cell.style.backgroundColor = 'black';
        }

        cell.addEventListener("mousemove",()=>{
            if(mouse){
                cell.style.backgroundColor = "black";
                if(clear){
                    cell.style.backgroundColor = '';
                    map[i*100 + j] = 0
                }else{
                    cell.style.backgroundColor = 'black';
                    map[i*100 + j] = 1
                }
            }
        })

        containter.appendChild(cell)
    }
}


let mouse = false;
let clear = false

document.addEventListener("mousedown",e=>{
    mouse = true
    clear = (e.which === 3)
})
document.addEventListener("mouseup",()=>mouse = false)
document.addEventListener("contextmenu",(e)=>e.preventDefault())

document.getElementById("save").addEventListener("click",()=>{
    localStorage.map = JSON.stringify(map)
})


function path(map,start,end){

}