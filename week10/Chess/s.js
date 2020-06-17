let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]


let color = 2;

function show() {
    let pan = document.getElementById("pan");
    pan.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let s = document.createElement("div")
            s.classList.add("cell");
            s.innerText = 
                pattern[i][j] == 2 ? "❌" :
                pattern[i][j] == 1 ? "⭕️" : "";

            s.addEventListener("click", () => userMove(j, i))

            pan.appendChild(s)
        }
        pan.appendChild(document.createElement("br"))
    }
}




function  userMove(x,y){
    if(pattern[y][x] !== 0){
        return ;
    }
    pattern[y][x] = color;

    if(check(pattern,color)){
        alert(color == 2 ? "X is win":"O is Win")
    }
    
    color = 3 - color

    show()

    computerMove()

    // if(willWin(pattern,color)){
    //     console.log(color == 2 ? "X will win":"O will Win")
    // }
}

function computerMove() {
    let choice = bestChoice(pattern, color)

    console.log(choice)

    if(choice.point) {
      pattern[choice.point[1]][choice.point[0]] = color

      if(check(pattern, color, choice.point[0], choice.point[1])) {
        alert(color === 2 ? '❌ is winner!' : '⭕️ is winner!')
      }
    }


    color = 3 - color
    show()
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

let openings = new Map();

openings.set([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ].toString() + '1', {
    point: [1, 1],
    result: 0
  })



function bestChoice(pattern,color){
    let point = willWin(pattern,color)

    if (openings.has(pattern.toString() + color)) {
        return openings.get(pattern.toString() + color)
    }

    console.log(point)

    if(point){
        return {
            point: point,
            result: 1
        }
    }

    let result = -1;

    outer: for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== 0) 
                continue
            let tmp = clone(pattern)
            tmp[i][j] = color

            let opp = bestChoice(tmp, 3 - color)
            if ( -opp.result >= result) {
                point = [j, i]
                result = -opp.result
                // return [j,i]
            }

            if(result == 1)
                break outer;
        }

    }




    return {
        point: point,
        result : point ? result : 0
    }
    
}

show(pattern)