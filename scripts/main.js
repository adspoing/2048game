var board = new Array(),
    score = 0,
    hasConflicted = new Array();


screenWidth = $(window).width();
gridContainerWidth = screenWidth * 0.92;
cellWidth = screenWidth * 0.18;
cellDistance = screenWidth * 0.04;
$(function () {
    newGame();
});
function newGame() {
    adjustForMobile();
    init();
}
function adjustForMobile() {
    if (screenWidth >= 500) {
        gridContainerWidth = 500;
        cellWidth = 100;
        cellDistance = 20;
    }
    $(".header").css("width", gridContainerWidth + "px");
    $(".header").css("left", cellWidth * 3 + "px");
    $(".header h2").css("margin-left", -(gridContainerWidth / 2 - cellDistance) + "px");

    var theGridContainer = $("#board");
    theGridContainer.css({
        "width": gridContainerWidth + "px",
        "height": gridContainerWidth + "px",
        "border-radius": gridContainerWidth * 0.02 + "px"
    });
    $(".grid-cell").css({
        "height": cellWidth + "px",
        "width": cellWidth + "px",
        "border-radius": gridContainerWidth * 0.02 + "px"
    });
}
function init() {
    score = 0;
    updateScore();

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-cell-" + i + "-" + j).css("top", getPosTop(i, j));
            $("#grid-cell-" + i + "-" + j).css("left", getPosLeft(i, j));
        }

    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    generateOneNumber();
    generateOneNumber();

    updateBoard();

}

function updateBoard() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#board").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $("#number-cell-" + i + "-" + j);

            if (board[i][j] == 0) {
                theNumberCell.css("width", 0);
                theNumberCell.css("height", 0);
                theNumberCell.css("top", getPosTop(i, j) + cellWidth / 2);
                theNumberCell.css("left", getPosLeft(i, j) + cellWidth / 2);

            }
            else {theNumberCell.css({
                "width": cellWidth + "px",
                "height": cellWidth + "px",
                "line-height": cellWidth + "px",
                "border-radius": gridContainerWidth * 0.02 + "px",
                "top": getPosTop(i, j),
                "left": getPosLeft(i, j),
                "background-color": getNumberBackgroundColor(board[i][j]),
                "color": getNumberColor(board[i][j]),
                "font-size": cellWidth * 0.65 + "px"
            });
                theNumberCell.html(showWord(board[i][j]));
            }
            hasConflicted[i][j] = false;
        }
    }
}
function showWord(number){
    switch(number){
        case 2:return '清';
        case 4:return '明';
        case 8:return '元';
        case 16:return '宋';
        case 32:return '唐';
        case 64:return '隋';
        case 128:return '晋';
        case 256:return '汉';
        case 512:return '秦';
        case 1024:return '周';
        case 2048:return '商';
    }

}
function generateOneNumber() {
    if (!nospace(board)) {
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
        while (true) {
            if (board[randx][randy] == 0) {
                break;
            }
            randx = parseInt(Math.floor(Math.random() * 4));
            randy = parseInt(Math.floor(Math.random() * 4));
        }
        var randNumber = Math.random() < 0.6 ? 2 : 4;
        board[randx][randy] = randNumber;

        showNumberWithAnimation(randx, randy, randNumber);
        return false;
    }
    return true;
}

function isGameOver() {
    if (nospace(board) && noMove(board)) {
        gameOver()
    }
}

function gameOver() {
    generateOneNumber();
    $("#board").append("<div id='gameover' class='gameover'><p>本次得分</p><span>"+score+
    "</span><a href='javascript:restartgame();'id='restartgamebutton'>Restart</a></div>");
    var gameover=$("#gameover");
    gameover.css("width","500px");
    gameover.css("height","500px");
    gameover.css("background-color","rgba(0,0,0,0.5)");
}
function isWinGame(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 2048) {
                return true;
            }
        }
    }
    return false;
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:
            event.preventDefault();
            if (moveLeft()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 38:
            event.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 39:
            event.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 40:
            event.preventDefault();
            if (moveDown()) {
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameOver(), 220);
            }
            break;
        default :
    }
});

function moveLeft() {
    if (!canMoveLeft(board)) {
        generateOneNumber();
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore();
                        if (isWinGame(board)) {
                            winGameOver();
                        }
                    }
                }
            }
        }
    }
    setTimeout(updateBoard(), 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        generateOneNumber();
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore();
                        if (isWinGame(board)) {
                            winGameOver();
                        }
                    }
                }
            }
        }
    }
    setTimeout(updateBoard(), 200);
    return true;
}
function moveRight() {
    if (!canMoveRight(board)) {
        generateOneNumber();
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore();
                        if (isWinGame(board)) {
                            winGameOver();
                        }
                    }
                }
            }
        }
    }
    setTimeout(updateBoard(), 200);
    return true;
}
function moveDown() {
    if (!canMoveDown(board)) {
        generateOneNumber();
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    if (board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore();
                        if (isWinGame(board)) {
                            winGameOver();
                        }
                    }
                }
            }
        }
    }
    setTimeout(updateBoard(), 200);
    return true;
}
function updateScore() {
    $("#score").html(score);
}

function getPosTop(i, j) {
    return cellDistance + (cellDistance + cellWidth) * i;
}
function getPosLeft(i, j) {
    return cellDistance + (cellDistance + cellWidth) * j;
}

function getNumberBackgroundColor(number) {
    switch (number) {
        case 2:
            return "#EEE4DA";
            break;
        case 4:
            return "#EDE0C8";
            break;
        case 8:
            return "#F2B179";
            break;
        case 16 :
            return "#F59563";
            break;
        case 32:
            return "#F67C5F";
            break;
        case 64:
            return "#F65E3B";
            break;
        case 128:
            return "#EDCF72";
            break;
        case 256:
            return "#6BADF6";
            break;
        case 512: return "#EBC400";
            break;
        case 1024:
            return "#EBC400";
            break;
        case 2048:
            return "#EBC400";
            break;


    }
return "#FC6";
}

function getNumberColor(number) {
    if (number <= 4) {
        return "#776E65";
    }
    return "#F9F6F2";
}
function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
function noMove(board) {
    if (canMoveLeft(board) ||
        canMoveUp(board) ||
        canMoveRight(board) ||
        canMoveDown(board)) {
        return false;
    }
    return true;
}
function canMoveLeft(borad) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveUp(borad) {
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveRight(borad) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveDown(borad) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row, col1, col2, board) {
    //第row行，从col1到col2列没有障碍
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false;
        }
    }
    return true;
}
function noBlockVertical(row1, row2, col, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false;
        }
    }
    return true;
}

function showNumberWithAnimation(i, j, randNumber) {

    var numberCell = $("#number-cell-" + i + "-" + j);

    numberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
    numberCell.css("color", getNumberColor(board[i][j]));
    numberCell.css("border-radius", gridContainerWidth * 0.02 + "px");
    numberCell.css("line-height", cellWidth + "px");
    numberCell.css("font-size", cellWidth * 0.65 + "px");
    numberCell.html(showWord(board[i][j]));
    numberCell.animate({
        width: cellWidth,
        height: cellWidth,
        top: getPosTop(i, j),
        left: getPosLeft(j, j)
    }, 150)
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $("#number-cell-" + fromx + "-" + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 100)
}

function winGameOver(){
    alert("you win!");
}

function restartgame(){
    $("#gameover").remove();
    updateScore(0);
    newGame();
}


//移动端操作
function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY;
    var dx = endX - startX;
    var result = 0;

    //如果滑动距离太短
    if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
    }

    var angle = GetSlideAngle(dx, dy);
    if(angle >= -45 && angle < 45) {
        result = 4;
    }else if (angle >= 45 && angle < 135) {
        result = 1;
    }else if (angle >= -135 && angle < -45) {
        result = 2;
    }
    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    }

    return result;
}

//滑动处理
var startX, startY;
document.addEventListener('touchstart',function (ev) {
    //bodyScroll(e);
    event.preventDefault();
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
}, false);
document.addEventListener('touchend',function (ev) {
    //event.preventDefault();
    //bodyScroll(e);
    var endX, endY;
    endX = ev.changedTouches[0].pageX;
    endY = ev.changedTouches[0].pageY;
    var direction = GetSlideDirection(startX, startY, endX, endY);
    switch(direction) {
        case 0:
            break;
        case 1:
            //event.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 2:
            //event.preventDefault();
            if (moveDown()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 3:
            //event.preventDefault();
            if (moveLeft()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 4:
            //event.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        default:
    }
}, false);