function * g(){
    yield console.log(1);
    yield console.log(2);
    yield console.log(3);
}


function run(iterator){
    let {value,done} = iterator.next()

    if(done){
        return ;
    }

    // 检查Promise

    value.then(()=>{
        co(iterator)
    })
}


function co(generator){
    return function (){
        return run(generator())
    }
}

co(g())
