let pattern = [
    [1, 2, 0],
    [0, 1, 0],
    [1, 0, 2]
]


let color = 2;

function show() {
    let pan = document.getElementById("pan");
    pan.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let s = document.createElement("div")
            s.classList.add("cell");
            s.innerText = pattern[i][j] == 2 ? "X" :
                pattern[i][j] == 1 ? "O" : "";

            s.addEventListener("click", () => move(j, i))

            pan.appendChild(s)
        }
        pan.appendChild(document.createElement("br"))
    }
}




function  move(x,y){
    // if(pattern[y][x] !== 0){
    //     return ;
    // }
    pattern[y][x] = color;

    if(check(pattern,color)){
        alert(color == 2 ? "X is win":"O is Win")
    }
    
    color = 3 - color

    show()

    if(willWin(pattern,color)){
        console.log(color == 2 ? "X will win":"O will Win")
    }
}

function clone (pattern){
    return JSON.parse(JSON.stringify(pattern))
}

function check(pattern,color) {
    // console.log(pattern)
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if(pattern[j][i]!==color){
                win = false
                break;
            }
        }
        if(win){
            return true
        }
    }

    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if(pattern[i][j]!==color){
                win = false
                break;
            }
        }
        if(win){
            return true
        }
    }

    {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if(pattern[j][j]!==color){
                win = false
                break;
            }
        }
        if(win){
            return true
        }
    }

    {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if(pattern[j][2-j]!==color){
                win = false
                break;
            }
        }
        if(win){
            return true
        }
    }

    return false
}


function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (pattern[i][j] !== 0) {
                continue
            }

            let tmp = clone(pattern)
                tmp[i][j] = color
            if (check(tmp, color)) {
                // return  true
                return [j, i]
            }
        }
    }
    return null;
}

function bestChoice(pattern,color){
    let point = willWin(pattern,color)

    console.log(point)

    if(point){
        return {
            point: point,
            result: 1
        }
    }

    let result = -1;

    for (let i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (pattern[i][j] !== 0) {
                continue
            }
            let tmp = clone(pattern)
            tmp[i][j] = color

            // let opp = bestChoice(tmp, 3 - color)
            // if ( -opp.result >= result) {
            //     point = [j, i]
            //     result = -opp.result
            //     // return [j,i]
            // }
        }

    }




    return {
        point: point,
        result : point ? result : 0
    }
    
}

show(pattern)