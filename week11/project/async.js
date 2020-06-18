function sleep(t){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,t * 1000)
    })
}


function green() {
    var lighers = document.getElementsByTagName("div");
    console.log(lighers)
    for(var i =0;i<3;i++){
        lighers[i].classList.remove("light")
    }
    
    document.getElementsByClassName("green")[0].classList="green"
}


function happen(element, evevtName) {
    return new Promise((resolve,reject)=>{
        element.addEventtListener(evevtName,resolve,{once: true})
    })
}


// async function go() {
//     while (true) {
//         green();
//         await sleep(4)
//         green();
//         await sleep(3)
//         green();
//     }
// }