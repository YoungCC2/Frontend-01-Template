function green() {
    var lighers = document.getElementsByTagName("div");
    for(var i =0;i<3;i++){
        lighers[i].classList.remove("light")
    }
    
    document.getElementsByClassName("green")[0].classList.add("light")
}

function red() {
    var lighers = document.getElementsByTagName("div");
    for(var i =0;i<3;i++){
        lighers[i].classList.remove("light")
    }
    
    document.getElementsByClassName("red")[0].classList.add("light")
}

function yellow() {
    var lighers = document.getElementsByTagName("div");
    for(var i =0;i<3;i++){
        lighers[i].classList.remove("light")
    }
    
    document.getElementsByClassName("yellow")[0].classList.add("light")
}



function sleep(t){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,t * 1000)
    })
}



function happen(element, evevtName) {
    return new Promise((resolve,reject)=>{
        element.addEventListener(evevtName,resolve,{once: true})
    })
}


async function go() {
    while (true) {
        green();
        await happen(document.getElementById("next"),"click");
        // await sleep(4)
        red();
        await happen(document.getElementById("next"),"click");
        // await sleep(3)
        yellow();
        await happen(document.getElementById("next"),"click");
        // await sleep(1)
    }
}