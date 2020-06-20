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



function go() {
    green()
    sleep(2).then(()=>{
        red()
        return sleep(5)
    }).then(()=>{
        yellow()
        return sleep(3)
    }).then(go)
}