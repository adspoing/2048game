var board = new Array(),
    score = 0,
    hasConflicted = new Array();//用于防止二次碰撞

var startx, starty, endx, endy;//用于移动端触控操作

screenWidth = $(window).width();
gridContainerWidth = screenWidth * 0.92;
cellWidth = screenWidth * 0.18;
cellDistance = screenWidth * 0.04;
$(function () {
    newGame();
});
function newGame() {
    adjustForMobile();
    //初始化
    init();
}
function adjustForMobile() {
    //调整grid以根据适应移动端；
    if (screenWidth >= 500) {
        //适用于网页
        gridContainerWidth = 500;
        cellWidth = 100;
        cellDistance = 20;
    }
    //调整header部分样式
    $(".header").css("width", gridContainerWidth + "px");
    $(".header").css("left", cellWidth * 3 + "px");
    $(".header h2").css("margin-left", -(gridContainerWidth / 2 - cellDistance) + "px");

    var theGridContainer = $("#board");
    theGridContainer.css({
        "width": gridContainerWidth + "px",
        "height": gridContainerWidth + "px",
        "border-radius": gridContainerWidth * 0.02 + "px"
    });
//调整grid-cell
    $(".grid-cell").css({
        "height": cellWidth + "px",
        "width": cellWidth + "px",
        "border-radius": gridContainerWidth * 0.02 + "px"
    });
}
function init() {
    //初始化函数
    score = 0;
    updateScore();

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-cell-" + i + "-" + j).css("top", getPosTop(i, j));
            $("#grid-cell-" + i + "-" + j).css("left", getPosLeft(i, j));
        }

    }
    //初始化board数据
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

    updateBoardView();

}

function updateBoardView() {
    //更新页面视图-即根据board生成所有 number-cell
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#board").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $("#number-cell-" + i + "-" + j);//表示当前正在操作的cell

            if (board[i][j] == 0) {
                //此时不显示数字
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
                theNumberCell.html(board[i][j]);
                if (board[i][j] >= 128) {
                    theNumberCell.css("font-size", cellWidth * 0.5);
                }
            }
            hasConflicted[i][j] = false;
        }
    }
}
function generateOneNumber() {
    //随机的在一个位置生成2或者4
    if(!nospace(board))
    if (!nospace(board)) {
        //随机一个位置
        var randx = parseInt(Math.floor(Math.random() * 4));//向下取整
        var randy = parseInt(Math.floor(Math.random() * 4));
        var count = 0;
        while (count < 40) {
            //只循环40次，避免计算机一直找不到而循环
            if (board[randx][randy] == 0) {
                break;
            }
            randx = parseInt(Math.floor(Math.random() * 4));
            randy = parseInt(Math.floor(Math.random() * 4));
        }
        if (count == 39) {
            //查找一个空位置
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    if (board[i][j] == 0) {
                        randx = i;
                        randy = j;
                    }
                }
            }
        }
        //随机2或4
        var randNumber = Math.random() < 0.6 ? 2 : 4;

        //在随机位置显示随机数字
        board[randx][randy] = randNumber;

        showNumberWithAnimation(randx, randy, randNumber);
    }
    return true;
}

function isGameOver() {
    if (nospace(board) && noMove(board)) {
        gameOver("Just Try Again!")
    }
}

function gameOver(text) {
    generateOneNumber();
    alert(text);
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

//键盘操作
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            event.preventDefault();//阻止默认的方向键，避免滚动条出现
            if (moveLeft()) {
                setTimeout(generateOneNumber(), 220);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 38://up
            event.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 39://right
            event.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNumber(), 210);
                setTimeout(isGameOver(), 220);
            }
            break;
        case 40://down
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
                            gameOver("You Get 2048!");
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 210);
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
                            gameOver("You Get 2048!");
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 220);
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
                            gameOver("You Get 2048!");
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 500);
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
                            gameOver("You Get 2048!");
                        }
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(updateBoardView(), 220);
    return true;
}
function updateScore() {
    //更新分数
    $("#score").html(score);
}

function getPosTop(i, j) {
    return cellDistance + (cellDistance + cellWidth) * i;
}
function getPosLeft(i, j) {
    return cellDistance + (cellDistance + cellWidth) * j;
}

function getNumberBackgroundColor(number) {
//根据数字返回背景色
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
    //根据数字返回前景色
    if (number <= 4) {
        return "#776E65";
    }
    return "#F9F6F2";
}
function nospace(board) {
    //判断棋盘格里是否还有空间
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
    //判断棋盘格里是否还能移动
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
    numberCell.html(board[i][j]);
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