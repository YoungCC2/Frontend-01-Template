async function show(){
    var bandNode = document.getElementsByTagName('div')
    console.log(bandNode)


    await setRed(bandNode[0],"red")

    await sleepsFn(2)

    await setRed(bandNode[1],"yellow")

    await sleepsFn(4)

    await setRed(bandNode[2],"green")
    
    await sleepsFn(1)
    show()
}
show()

function setRed (node,color) {
    var bandNode = document.getElementsByTagName('div')
    // console.log(typeof )
    Object.keys(bandNode).forEach(element => {
        bandNode[element].className = "grey"
    });

    return new Promise((resolve,reject)=>{
        
        node.className = color
        resolve()
    })
}

function sleepsFn (times){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },times * 1000)
        
    })    
}



