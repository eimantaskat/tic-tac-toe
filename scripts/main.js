const grid = document.querySelector(".grid");
const gameOverOverlay = document.querySelector(".game-over");
const gameOverImage = document.querySelector(".game-over img");
const gameOverMessage = document.querySelector(".game-over h1");
const winner = document.querySelector("#winner");
const playAgainButton = document.querySelector(".play-again");
const resetButton = document.querySelector("#reset");
const nextTurn = document.querySelector(".next-turn");

const positions = ["left", "right", "top", "bottom"];

const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");

var nextX = true;
var gameBoard = [null, null, null, null, null, null, null, null, null];
var moves = 0;


const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const updateScore = () => {
    const players = [player1, player2];

    players.forEach(player => {
        var score = sessionStorage.getItem(player.innerHTML);
        if (!score) {
            sessionStorage.setItem(player.innerHTML, 0);
            score = 0;
        }
    
        const scoreElement = document.querySelector(`#${player.id}-score span`);
        scoreElement.innerHTML = score;
    });
};

const determineWinner = (winningTile) => {
    var imgSrc = "images/";
    
    if (winningTile === null) {
        // draw
        playAgainButton.classList.remove("hover-red");
        playAgainButton.classList.remove("hover-blue");
        gameOverImage.classList.add("hidden");
        winner.innerHTML = "";
        gameOverMessage.innerHTML = "DRAW";
        gameOverOverlay.classList.remove("hidden");
        return;
    }
    
    var playerName;
    if (winningTile) {
        // o won
        imgSrc += "o/";
        imgSrc += getRandomInt(3) + ".png";
        winner.innerHTML = player2.innerHTML;
        gameOverImage.classList.remove("hidden");
        playAgainButton.classList.remove("hover-red");
        playAgainButton.classList.add("hover-blue");

        playerName = player2.innerHTML
    } else if (!winningTile) {
        // x won
        imgSrc += "x/";
        imgSrc += getRandomInt(3) + ".png";
        winner.innerHTML = player1.innerHTML;
        gameOverImage.classList.remove("hidden");
        playAgainButton.classList.remove("hover-blue");
        playAgainButton.classList.add("hover-red");

        playerName = player1.innerHTML;
    }

    gameOverImage.src = imgSrc;
    gameOverMessage.innerHTML = "WON!";
    gameOverOverlay.classList.remove("hidden");

    const currentScore = parseInt(sessionStorage.getItem(playerName));
    sessionStorage.setItem(playerName, currentScore + 1);

    updateScore();
};

const gameOver = () => {
    for (let i = 0; i < 3; i++) {
        if (
                // check lines
                (gameBoard[i*3] !== null) && 
                (gameBoard[i*3] === gameBoard[i*3 + 1]) && 
                (gameBoard[i*3 + 1] === gameBoard[i*3 + 2])
            ) {
                determineWinner(gameBoard[i*3]);
                return true;
        } else if (
                // check columns
                (gameBoard[i] !== null) && 
                (gameBoard[i] === gameBoard[i + 3]) && 
                (gameBoard[i + 3] === gameBoard[i + 6])
            ) {
                determineWinner(gameBoard[i]);
                return true;
        } else if (
            // check diagonal
            (gameBoard[2] !== null) &&
            (gameBoard[2] === gameBoard[4]) &&
            (gameBoard[4] === gameBoard[6])
            ) {
                determineWinner(gameBoard[2]);
                return true;
        } else if (
                // check antidiagonal
                (gameBoard[0] !== null) &&
                (gameBoard[0] === gameBoard[4]) &&
                (gameBoard[4] === gameBoard[8])
            ) {
                determineWinner(gameBoard[0]);
                return true;
        }
    }

    if (moves === 9) {
        determineWinner(null);
        return true;
    }

    return false;
};

const updateInfo = () => {
    var imgPath = "images/";
    if (nextX) {
        imgPath += "x/";
    } else {
        imgPath += "o/";
    }
    imgPath += getRandomInt(3) + ".png";

    const img = nextTurn.querySelector("img");
    img.src = imgPath;

    const infoText = nextTurn.querySelector("h2");
    if (infoText.innerHTML === "Starts") {
        infoText.innerHTML = "Turn";
    }
};

const handlePlayerNameChange = (e) => {
    const target = e.path[1];

    var newName = target.innerHTML.substring(0, 20);
    
    const id = `${target.id}-score`;

    var score = sessionStorage.getItem(newName);
    if (!score) {
        sessionStorage.setItem(newName, 0);
        score = 0;
    }

    const scoreElement = document.querySelector(`#${id} span`);
    scoreElement.innerHTML = score;

    sessionStorage.setItem(target.id, newName);
};

const setNames = () => {
    const p1Name = sessionStorage.getItem("player1");
    const p2Name = sessionStorage.getItem("player2");
    const p1NameField = document.querySelector("#player1");
    const p2NameField = document.querySelector("#player2");
    if (p1Name) {
        p1NameField.innerHTML = p1Name;
    } else {
        p1NameField.innerHTML = "Player1";
    }
    if (p2Name) {
        p2NameField.innerHTML = p2Name;
    } else {
        p2NameField.innerHTML = "Player2";
    }
};

const restartGame = () => {
    sessionStorage.clear();
    setNames();
    updateScore()
};


grid.addEventListener("click", (e) => {
    const tagName = e.target.tagName;
    const innerHTML = e.target.innerHTML;
    const pos = e.target.className[3];

    if (tagName === "IMG" || innerHTML.trim() !== "" || isNaN(pos)) {
        return;
    }

    var imgPath = "images/";
    if (nextX) {
        imgPath += "x/";
    } else {
        imgPath += "o/";
    }
    imgPath += getRandomInt(3) + ".png";

    imgHtml = "<img src=\"" + imgPath + "\"class=\"";

    const shuffled = positions.sort(() => 0.5 - Math.random());
    let selected_positions = shuffled.slice(0, getRandomInt(4));
    selected_positions.forEach(element => {
        imgHtml += element + " ";
    });

    imgHtml += "\">";
    e.target.innerHTML = imgHtml;

    nextX = !nextX;
    moves++;
    gameBoard[pos] = nextX;
    updateInfo();

    if (gameOver()) {
        const infoText = nextTurn.querySelector("h2");
        infoText.innerHTML = "Starts";
        nextX = true;

        var imgPath = "images/x/";
        imgPath += getRandomInt(3) + ".png";
    
        const img = nextTurn.querySelector("img");
        img.src = imgPath;
    }
});

playAgainButton.addEventListener("click", (e) => {
    gameBoard = [null, null, null, null, null, null, null, null, null];
    gameOverOverlay.classList.add("hidden");
    const children = grid.children;

    for (var i = 0; i < children.length; i++) {
        children[i].innerHTML = "";
    }
    moves = 0;
});

player1.addEventListener("DOMSubtreeModified", handlePlayerNameChange);
player2.addEventListener("DOMSubtreeModified", handlePlayerNameChange);
resetButton.addEventListener("click", restartGame);

setNames();
updateScore();