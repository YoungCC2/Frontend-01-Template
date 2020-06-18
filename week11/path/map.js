// function 
// var map = new Array(10001).join(0).split('').map(s=>Number(s))
var map = new Array(10000).fill(0)


var containter = document.getElementById("containter")
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        let cell = document.createElement("div")

        cell.classList.add("cell");

        cell.addEventListener("mouseover",()=>{
            if(mouse){
                if(clear){

                }else{
                    cell.style.backgroundColor = 'black';
                }
            }
        })

        containter.appendChild(cell)
    }
}

