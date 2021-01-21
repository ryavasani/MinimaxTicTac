//REWRITING PROGRAM SO NO OBSERVER IS NEEDED
let TicTacGame = {
    "markers-to-player": {"X": "player1", "O": "player2"},
    "players-to-marker": {"player1": "X", "player2": "O"},
    "board": Array.from(document.querySelectorAll('.the-col')),
    "turn": 0,
    "ScoreBoard" : [],
    "playGame": false,
    "AI-play": true,
    "gamesPlayed": 0,
    "markerOrder": {"first": "X", "second": "O"},
    "players-to-text": {"player1": "Player 1", "player2": "Player 2"}
}

function start(){

    if (TicTacGame["playGame"] == false){
        TicTacGame["playGame"] = true
        if (TicTacGame["gamesPlayed"] > 0){
            document.querySelector("#Game-result").textContent = "Game in Progress"
            TicTacGame["board"].forEach(el => el.innerText = "")
            TicTacGame["turn"] = 0
            TicTacGame["ScoreBoard"] = []
        }

        //Determining corresponding markers
        markerButton = document.querySelectorAll('input[type="checkbox"]')

        if(markerButton[1].checked == false){
            TicTacGame["markers-to-player"] = {"O": "player1", "X": "player2"}
            TicTacGame["players-to-marker"] = {"player1": "O", "player2": "X"}
        } else { 
            TicTacGame["markers-to-player"] = {"X": "player1", "O": "player2"}
            TicTacGame["players-to-marker"] = {"player1": "X", "player2": "O"}
        }

        //Determining first move

        if(markerButton[2].checked == false){
            TicTacGame["markerOrder"] = {"first": "O", "second": "X"}
        } else{
            TicTacGame["markerOrder"] = {"first": "X", "second": "O"}
        }

        //Determining whether AI will play
        if(markerButton[0].checked == false){
            TicTacGame["AI-play"] = false
        } else {
            TicTacGame["AI-play"] = true
        }

        AllowTurn()
    }
}

function findWinner(ScoreBoard){
    pairings = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
    for(let i = 0; i < pairings.length; i++){        
        if ((ScoreBoard[pairings[i][0]] == ScoreBoard[pairings[i][1]]) && (ScoreBoard[pairings[i][1]] == ScoreBoard[pairings[i][2]])){
            if (TicTacGame["markers-to-player"][ScoreBoard[pairings[i][0]]] != undefined){
                return TicTacGame["markers-to-player"][ScoreBoard[pairings[i][0]]]
            }
        }
    }

    if (ScoreBoard.indexOf("") == -1){
        return "Tie"
    }

    return null
}

function updateWinner(){

    TicTacGame["ScoreBoard"] = ["&"]
    for(let i = 0; i < TicTacGame['board'].length; i++){
        TicTacGame["ScoreBoard"].push(TicTacGame['board'][i].innerText)
    }

    let winner = findWinner(TicTacGame["ScoreBoard"])
    if ((winner != null) && (winner != "Tie")){
        document.querySelector("#Game-result").textContent = TicTacGame["players-to-text"][winner] + " has won"
        TicTacGame["playGame"] = false
        TicTacGame["gamesPlayed"]++
    } else if(winner == "Tie"){
        document.querySelector("#Game-result").textContent = "The game is tied"
        TicTacGame["playGame"] = false
        TicTacGame["gamesPlayed"]++
    }
}

function TakeTurn(event){
    //finding whose turn it is; The marker is only placed if it is a valid spot
    if(event.target.innerText === ""){
        if(TicTacGame["turn"] % 2 === 0){
            event.target.innerText = TicTacGame["markerOrder"]["first"]
        } else {
            event.target.innerText = TicTacGame["markerOrder"]["second"]
        }

        updateWinner()

        TicTacGame["board"].forEach(el => el.removeEventListener("click", TakeTurn))
        TicTacGame["turn"]++
        AllowTurn()
    }
}

function CPUTurn(){

    function mainAlgorithm(){
        let bestMove
        let bestScore = -Infinity
        for (let i = 0; i < TicTacGame["ScoreBoard"].length; i++){
            if (TicTacGame["ScoreBoard"][i] === ""){
                TicTacGame["ScoreBoard"][i] = TicTacGame["players-to-marker"]["player2"]
                let score = Minimax(TicTacGame["ScoreBoard"], 0, false)
                TicTacGame["ScoreBoard"][i] = ""
                if (score > bestScore){
                    bestScore = score
                    bestMove = i
                }
            }
        }
        return bestMove
    }

    function Minimax(board, depth, isMaximizing){

        let scores = {
            "player1": -1,
            "player2": 1,
            "Tie": 0,
        }

        let result = findWinner(TicTacGame["ScoreBoard"])
        if (result != null){
            return scores[result]
        }

        if (isMaximizing){
            let bestScore = -Infinity
            for (let i = 0; i < TicTacGame["ScoreBoard"].length; i++){
                if (TicTacGame["ScoreBoard"][i] === ""){
                    TicTacGame["ScoreBoard"][i] = TicTacGame["players-to-marker"]["player2"]
                    let score = Minimax(TicTacGame["ScoreBoard"], depth + 1, false)
                    TicTacGame["ScoreBoard"][i] = ""
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore

        } else {
            let bestScore = Infinity
            for (let i = 0; i < TicTacGame["ScoreBoard"].length; i++){
                if (TicTacGame["ScoreBoard"][i] === ""){
                    TicTacGame["ScoreBoard"][i] = TicTacGame["players-to-marker"]["player1"]
                    let score = Minimax(TicTacGame["ScoreBoard"], depth + 1, true)
                    TicTacGame["ScoreBoard"][i] = ""
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    }
    TicTacGame["board"][mainAlgorithm() - 1].innerText = TicTacGame["players-to-marker"]["player2"]
    updateWinner()

    TicTacGame["turn"]++
    AllowTurn()
}

function AllowTurn(){
    if (TicTacGame["playGame"]) {

        let playerFunctions = {
            player1 : function () {
                TicTacGame["board"].forEach(el => el.addEventListener("click", TakeTurn))
                document.querySelector("#Game-result").textContent = "It's " + TicTacGame["players-to-text"]["player1"] + "'s move"
            },
            player2 : function () {
                document.querySelector("#Game-result").textContent = "It's " + TicTacGame["players-to-text"]["player2"] + "'s move"
                if (TicTacGame["AI-play"]){
                    CPUTurn()
                } else {
                    TicTacGame["board"].forEach(el => el.addEventListener("click", TakeTurn))
                }
            }
        }

        let firstPlayer = TicTacGame["markers-to-player"][TicTacGame["markerOrder"]["first"]]
        let secondPlayer = TicTacGame["markers-to-player"][TicTacGame["markerOrder"]["second"]]

        if (TicTacGame["turn"] == 0){
            updateWinner()
        }

        if(TicTacGame['turn'] % 2 == 0){
            playerFunctions[firstPlayer]()
        } else {
            playerFunctions[secondPlayer]()
        }
    } else {
        return
    }
}

document.querySelector('.start-btn').addEventListener('click', start)