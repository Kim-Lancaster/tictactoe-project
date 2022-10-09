// //Grabbing the scoreboard and all the individual divs inside
const scoreBoardInnerDiv = document.querySelectorAll('#ranked-scores div')

// //Grabbing 'Add Score' button
const createRecord = document.getElementById("create-record");
////////////////////////GET REQUEST/////////////////////////////////////
const currentScores = fetch(`http://localhost:3000/getScores`)
.then(response => {return response.json()})
.then(data => {
    populateScores(data);
    return data
})

//Puts the scores from the DB up in the score section
const populateScores = (data) => {
    
    scoreBoardInnerDiv.forEach((spot, i) => {
        spot.innerHTML = `${data[i].rank} ${data[i].name} ${data[i].score}`;
    })
}

//Adding a click event handler
createRecord.addEventListener('click', () => {
    checkIfScoreIsHigh();
});

//Getting which player has the highest score and
//seeing if it is high enough to place on the scoreboard
//then calling the function to update the database
const checkIfScoreIsHigh = async() => {
    let scores = await currentScores;
    let highScore;
    let playerOneScore = document.getElementById('player1-score').innerHTML;
    let playerTwoScore = document.getElementById('player2-score').innerHTML;
    playerOneScore > playerTwoScore ? highScore = playerOneScore : highScore = playerTwoScore;
    for(let i = 0; i < 10; i++){
        if(highScore >= scores[i].score || highScore >= scores[i].score){
            const { value: text } = await Swal.fire({
                text: 'Enter Your Initials (max 3)',
                input: 'text',
                showCancelButton: true,
                inputValidator: (text) => {
                    if(!text){
                        return 'Please enter your initials!';
                    }
                }
            })
            await updateScoreBoard(text, highScore, scores[i].rank)
            return;
        }
    }
    Swal.fire({
        icon: 'error',
        text: 'Your score isn\'t high enough! Keep trying!'
      })
}
///////////////////////END GET REQUEST/////////////////////////////////////

////////////////////////PUT REQUEST/////////////////////////////////////
const updateScoreBoard = async(initial, score, rank) =>{
    if(initial.length > 3){
        initial = initial.slice(0, 3)
        initial = initial.toUpperCase();
    }
    location.reload();
    fetch('http://localhost:3000/recordNew', {
    method: 'PUT',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        rank: rank,
        name: initial,
        score: score
    })
}).then(response.json())
.then(data => console.log(data))
}
////////////////////END PUT REQUEST/////////////////////////////////////

