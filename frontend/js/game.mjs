//The HTML Board
const allTiles = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const tiles = [];

allTiles.forEach((t) => {
    tiles.push(document.getElementById(t));
})

//The Internal Board Array
const boardArray = Array.from(Array(9).keys())

//Winning Tile Combos
const winningCombos = [
    [0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

//The buttons
let coinFlip = "";
const flipSymbol = document.getElementById("flip-symbols");
const playAgain = document.getElementById("play-again");

//The Hidden/Unpopulated DIVs
const playerOneScoreArea = document.getElementById("player1-score");
const playerTwoScoreArea = document.getElementById("player2-score");
const playerOneTextSymbol =  document.getElementById("player1-symbol");
const playerTwoTextSymbol = document.getElementById("player2-symbol")
const theWinner = document.getElementById("the-winner");
const whoGoesFirst = document.getElementById("who-goes-first");

//Whose turn is it at start
let currentPlayer = "";

//Who is X and O
let playerOneSymbol = "X";
let playerTwoSymbol = "O";


//Misc
let tilesClicked = 0;
export let playerOneScore = 0;
export let playerTwoScore = 0;




//////////////HELPER FUNCTIONS BELOW////////////////////////
//Random number generator used in whoseTurn and --
const randomPick = (val) => {
    return Math.floor(Math.random() * val);
}
//Populates which player has which symbol in the HTML
const setPlayerSymbols = () => {
    playerOneTextSymbol.innerHTML = playerOneSymbol;
    playerTwoTextSymbol.innerHTML = playerTwoSymbol;
}
setPlayerSymbols();
//creating coin-flip button for who goes first
const createButton = () => {
    let coinFlip = document.createElement("button");
    coinFlip.innerHTML = "Coin Flip!";
    whoGoesFirst.appendChild(coinFlip);
    return coinFlip;
}
coinFlip = createButton();
//////////////END HELPER FUNCTIONS/////////////////////////



//////////////BUTTON LOGIC BELOW (left to right)////////////
//Sets up who goes first by random selection
const whoseTurn = () => {
        
    let first = randomPick(2);
    coinFlip.style.display = "none";
    if(first === 0) {
        whoGoesFirst.innerHTML = "Player 2";
        currentPlayer = "playerTwo";
    } else {
        whoGoesFirst.innerHTML = "PLAYER 1";
        currentPlayer = "playerOne";
    }
    whoGoesFirst.style.height = "100%"
    whoGoesFirst.style.justifySelf = "center";
    whoGoesFirst.style.paddingTop = "1.5%"
    whoGoesFirst.style.fontSize = "1.75rem"
    activateSquares();
}
coinFlip.onclick = whoseTurn;

//flips the symbols from the default or back to default
const symbolFlip = () => {
    if(tilesClicked < 1){
        if(playerOneSymbol === "X"){
            playerOneSymbol = "O";
            playerTwoSymbol = "X";
        } else {
            playerOneSymbol = "X";
            playerTwoSymbol = "O";
        }
        setPlayerSymbols();
    } 
}
flipSymbol.onclick = symbolFlip;

//Play Again button RESETS ALL EVENT LISTENERS
const resetBoard = () => {
    console.log("is clicked")
    boardArray.forEach((element, index) => {
        boardArray[index] = index;
    })
    tiles.forEach((element, index) => {
        tiles[index].innerHTML = "";
        element.style.backgroundColor = "rgb(15, 24, 24)"
        element.style.color = "rgb(58, 99, 99)"
    })
    theWinner.innerHTML = "?";
    whoGoesFirst.innerHTML = "";
    tilesClicked = 0;
    coinFlip = createButton();
    coinFlip.onclick = whoseTurn;
    flipSymbol.onclick = symbolFlip;
}
playAgain.onclick = resetBoard;
//////////////////END BUTTON LOGIC BELOW/////////////////////



//////////////GAME LOGIC BELOW///////////////////////////
//Adding the click event to all squares on the board
const activateSquares = () =>{
    tiles.forEach(tile => {
        tile.addEventListener('click', gamePlay);
    });
}

//Removing the click event from all squares when game is won
const deactivateSquares = () => {
    tiles.forEach(tile => {
        tile.removeEventListener('click', gamePlay);
    });
}

//Main game play - the onclick callback function
const gamePlay = event => {
    if(currentPlayer === "playerOne"){
        if(squareNotMarked(event.target)){
            tilesClicked += 1;
            markSquare(event.target, playerOneSymbol);
            let isThereAWinner = checkForWin();
            if(isThereAWinner){
                deactivateSquares();
                theWinner.innerText = "PLAYER 1!";
                playerOneScore += 1;
                playerOneScoreArea.innerHTML = playerOneScore;
                highlightWinningRow(isThereAWinner);

            }
            currentPlayer = "playerTwo";
        }
    } else { //when player 2 plays 
        if(squareNotMarked(event.target)){
            tilesClicked += 1;
            markSquare(event.target, playerTwoSymbol);
            let isThereAWinner = checkForWin();
            if(isThereAWinner){
                deactivateSquares();
                theWinner.innerText = "PLAYER 2";
                playerTwoScore += 1;
                playerTwoScoreArea.innerHTML = playerTwoScore;
                highlightWinningRow(isThereAWinner);
            }
            currentPlayer = "playerOne";
        }
    }
    checkForTie();
}

//Checking if square is already marked or not
const squareNotMarked = (event) => {
    if(typeof boardArray[event.id - 1] === "number") {
        return true;
    } else {
        return false;
    }
}

//Marking the empty squares
const markSquare = (event, symbol) => {
    boardArray[event.id - 1] = symbol;
    event.innerHTML = symbol;
    event.style.fontSize = "5rem";
}

//Check if there is a winner - returns an array
const checkForWin = () => {
    for(let i = 0; i < winningCombos.length; i++){
        let a = boardArray[winningCombos[i][0]];
        let b = boardArray[winningCombos[i][1]];
        let c = boardArray[winningCombos[i][2]];

        if(typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') {
            if(a === b && b === c) {
                return winningCombos[i];
            }
        }
    }
    return null;
}

//Check for a tied game
const checkForTie = () => {
    if(tilesClicked >= 9){
        theWinner.innerText = "TIE!";
    }
}

const highlightWinningRow = (arr) => {
    for(let i = 0; i < arr.length; i++){
        tiles[arr[i]].style.backgroundColor = "rgb(58, 99, 99)";
        tiles[arr[i]].style.color = "rgb(15, 24, 24)";
    }
}
//////////////END GAME LOGIC///////////////////////////////////


//////////////A.I. LOGIC BELOW - Incomplete - Just a place holder///////////////////////////
//Get an array of all unmarked squares
// const availableSquares = (playerSymbol) => {
//     let tilesLeft = [];
//     let index = boardArray.indexOf(playerSymbol) 
//         while(index != -1) {
//             tilesLeft.push(index);
//             index = boardArray.indexOf(playerSymbol, index + 1) 
//         }
//     return tilesLeft
// }

// const bestMove = (event) => {
//     const remainingTiles = availableSquares();
//     const randomSquare = randomPick(remainingTiles.length - 1);
//     if(remainingTiles.length > 7){
//         boardArray[randomSquare] = playerTwoSymbol;
//         event.innerHTML = playerTwoSymbol;
//         event.style.fontSize = "5rem";
//     } else {
        
//     }
// }



    
    

