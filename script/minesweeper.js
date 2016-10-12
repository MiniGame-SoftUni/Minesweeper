var userResult; //TODO: това ще пази резултата на всеки играч / това да остане var защото ще го ползвам за юзърите

let s = { // TODO: let matrix / това е матрицата, представена като обект
    rows: 10,
    cols: 10,
    width: 38,
    height: 38
};

let c; //Това е фактически е канваса, демек контролер върху цялата игра
let canvas; // Нека всички променливи които се използват в дадена функция да са изнесени непосредствено преди нея

let bombs = [];

let clickedBs = [];

window.onload = function () {
    canvas = document.getElementById('gCanvas');
    c = canvas.getContext('2d'); // TODO: по-хубави имена на променливите

    timer();
    init();
};

let mX;
let mY;
let clickedX;
let clickedY;
let totalClicked;

window.onclick = function (e) {
    mX = e.pageX;
    mY = e.pageY;


    if(Math.floor(mX/s.width) < s.cols && Math.floor(mY/s.height) < s.rows){
        clickedX = Math.floor(mX/s.width);
        clickedY = Math.floor(mY/s.height);
    }

    for(let i in bombs){ //let
        if(clickedX == bombs[i][0] && clickedY == bombs[i][1]){
            lose();
        }
    }

    let clickedBomb=false;

    for (let i = 0; i < 10; i++) {
        if(clickedX == bombs[i][0] && clickedY == bombs[i][1]){
            clickedBomb = true;
            lose();
        }
    }

    if(clickedBomb == false && mX < s.rows * s.width && mY < s.cols * s.height){
        totalClicked = rClickedBs.length + clickedBs.length;
        //console.log(totalClicked);
        if(totalClicked == 100){
            win();
        }
        clickPass(clickedX, clickedY);
    }
};
let rClickedX;
let rClickedY;
let rClickedBs = [];
let inRClickedBs = [false, 0];
let n;
let rightClicks = 0;

window.oncontextmenu = function(e){
    e.preventDefault();

    mX = e.pageX;
    mY = e.pageY;

    if(Math.floor(mX/s.width) < s.cols && Math.floor(mY/s.height) < s.rows){
        rClickedX = Math.floor(mX/s.width);
        rClickedY = Math.floor(mY/s.height);
    }

    inRClickedBs = [false, 0];

    for(let i in rClickedBs){ //let

        if(rClickedBs[i][0] ==rClickedX && rClickedBs[i][1] == rClickedY){
            inRClickedBs = [true, i];
        }
    }

    if(inRClickedBs[0] ==false){
        if(rClickedBs.length < 10){
            rightClicks++;
            console.log(rightClicks);
            n = rClickedBs.length;
            rClickedBs[n] = [];
            rClickedBs[n][0] = rClickedX;
            rClickedBs[n][1] = rClickedY;

            totalClicked = rClickedBs.length + clickedBs.length;
            console.log(totalClicked);
            if(totalClicked == 100){
                win();
            }
        }
    }else{
        rClickedBs.slice(inRClickedBs[1], 1);
        if(rightClicks > 0) {
            rightClicks--;
        }
        console.log(rightClicks);
    }
    drawCanvas();
};

let box;
let num;
let zero;
let flag;
//let bomb;

function init() {
    box = new Image();
    box.src = "./img/box.png";
    num = new Image();
    num.src = "./img/num.png";
    zero = new Image();
    zero.src = "./img/zero.png";
    flag= new Image();
    flag.src = "./img/flag.png";
    //bomb = new Image();
    //flag.src = "./img/bomb.png";

    for(let i = 0; i < 10;i++){
        bombs[i]=[Math.floor(Math.random() * 8) +1,
            Math.floor(Math.random() * 8 )+1]
    }

    drawCanvas();

}

let time = 0;
function timer() {
    setTimeout(function () {
        let timerDiv = document.getElementById('timer');
        time++;
        timerDiv.innerHTML = time + "s";
        timer();
    }, 1000);
}

let x;
let y;
let rBeenClicked = [0, false];
function drawCanvas() {
    c.clearRect(0, 0, 400, 400);

    for(let i = 0;i < s.rows;i++){
        for(let n = 0;n < s.cols;n++){
            x = n * s.width;
            y = i * s.height;

            let beenClicked = [0, false];
            if(clickedBs.length > 0){
                for(let k = 0; k < clickedBs.length; k++){
                    if(clickedBs[k][0] == n && clickedBs[k][1] == i){
                        beenClicked = [k, true];
                    }
                }
            }

            if(beenClicked[1] == true){
                if(clickedBs[(beenClicked[0])][2] > 0){
                    c.drawImage(num, x, y);
                }else{
                    c.drawImage(zero, x, y);
                }
            }else{
                rBeenClicked = [0, false];
                 if(rClickedBs.length > 0){
                    for(let k = 0; k < rClickedBs.length; k++){
                        if(rClickedBs[k][0] == n && rClickedBs[k][1] == i){
                            rBeenClicked = [k, true];
                        }
                    }
                }

                if(rBeenClicked[1] == true){
                    c.drawImage(flag, x, y);
                }else {
                    c.drawImage(box, x, y);
                }
            }
        }
    }

    for(let i in clickedBs){
        if(clickedBs[i][2] > 0){
            c.font = '20px arial';
            c.fillText(clickedBs[i][2], clickedBs[i][0] * s.width + 15, clickedBs[i][1] * s.height + 25); //TODO: от тук се центрират числата в/у боксчетата
        }
    }

}
var clicked;
function  clickPass(x, y) {
    let boxesToCheck=[
        [-1,-1],
        [0,-1],
        [1,-1],
        [1,0],
        [1,1],
        [0,1],
        [-1,1],
        [-1,0]
    ];

    let numbOfBombsSurrounding = 0;

    for(let i in boxesToCheck){
        for( let n = 0; n < 10 ;n++){
            if(checkBomb(n,x + boxesToCheck[i][0],y + boxesToCheck[i][1]) == true){
                numbOfBombsSurrounding++;
            }
        }
    }

    for(let k in rClickedBs){ // let
        if(rClickedBs[k][0] == x && rClickedBs[k][1] == y){
            rClickedBs.splice(k, 1);
        }
    }

    clicked = false;

    for(let k in clickedBs){ // let
        if(clickedBs[k][0] == x && clickedBs[k][1] == y){
            clicked = true;
        }
    }

    if(clicked == false) {
        clickedBs[(clickedBs.length)] = [x, y, numbOfBombsSurrounding];
    }
    if (numbOfBombsSurrounding == 0) {
        for(let i in boxesToCheck ){ // let
            if(x+ boxesToCheck[i][0] >= 0 && x + boxesToCheck[i][0] <= 9 && y + boxesToCheck[i][1] >= 0 && y + boxesToCheck[i][1] <= 9 ){
                let x1 = x + boxesToCheck[i][0];
                let y1 = y + boxesToCheck[i][1];

                var alreadyClicked = false;
                for (n in clickedBs){
                    if(clickedBs[n][0] == x1 && clickedBs[n][1] == y1 ){
                        alreadyClicked = true;
                    }
                }
                if(alreadyClicked == false) {
                    clickPass(x1, y1);
                }
            }
        }
    }

    drawCanvas();

    //console.log(numbOfBombsSurrounding);
}

function checkBomb(i,x,y) {
    if(bombs[i][0] == x && bombs[i][1] == y){
        return true;
    }else {
        return false;
    }

}

function  lose() {
    alert("You Lost!");
    //c.drawImage(bomb, x, y);
    newGame();
}

function win() {
    alert("You Won!");
}

function newGame() {
    userResult = time;    
    bombs = [];
    clickedBs = [];
    time = 0;
    init();
    //console.log(rBeenClicked);
    
    //rBeenClicked[1] = false;
    //console.log(userResult);
}