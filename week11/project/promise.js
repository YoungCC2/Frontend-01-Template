function green() {
    var lighers = document.getElementsByTagName("div");
    for(var i =0;i<3;i++){
        lighers[i].classList.remove("light")
    }
    
    console.log(document.getElementsByClassName("green")[0])
    document.getElementsByClassName("green")[0].className="green"
}


function sleep(t){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,t * 1000)
    })
}



function go() {
    green()
    sleep(2).then(()=>{
        green()
        return sleep(5)
    }).then(()=>{
        green()
        return sleep(3)
    }).then(go)
}