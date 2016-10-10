
let userProgress; //TODO: това ще пази резултата на всеки играч

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

    c.fillRect(50, 50, 300, 300);
    c.fillStyle = '#000';
    c.fill();

    init();
};

let mX;
let mY;
let clickedX;
let clickedY;
window.onclick = function (e) {
    mX = e.pageX;
    mY = e.pageY;

    if(Math.floor(mX/s.width) < s.cols && Math.floor(mY/s.height) < s.rows){
        clickedX = Math.floor(mX/s.width);
        clickedY = Math.floor(mY/s.height);
        console.log(clickedX + "," + clickedY);
    }

    let clickedBomb=false;

    for (let i = 0; i < 10; i++) {
        if(clickedX == bombs[i][0] && clickedY == bombs[i][1]){
            clickedBomb = true;
            lose();
        }
    }

    if(clickedBomb == false){
        clickPass(clickedX, clickedY);
    }
};

let box;
let num;
let zero;
function init() {
    box = new Image();
    box.src = "./img/box.png";
    num = new Image();
    num.src = "./img/num.png";
    zero = new Image();
    zero.src = "./img/zero.png";

    for(let i =0; i < 10;i++){
        bombs[i]=[Math.floor(Math.random() * 10),
                  Math.floor(Math.random() * 10)]
    }

    drawCanvas();

}

let x;
let y;
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
                c.drawImage(box, x, y);
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

    clickedBs[(clickedBs.length)] = [x, y, numbOfBombsSurrounding];

    if (numbOfBombsSurrounding == 0) {
        for(i in boxesToCheck ){
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

    console.log(numbOfBombsSurrounding);
}

function checkBomb(i,x,y) {
    if(bombs[i][0] == x && bombs[i][1] == y){
        return true;
    }else {
        return false;
    }

}

function  lose() {

}