const Player = (symbol) => {
    this.symbol = symbol;

    const getSymbol = () => {
        return symbol;
    }

    return { getSymbol };
};

const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const setField = (index, symbol) => {
        if (index > board.length) {
            return;
        }
        board[index] = symbol;
    };

    const getField = (index) => {
        if (index > board.length) {
            return;
        }
        return board[index];
    }

    const resetField = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { setField, getField, resetField };
})();

const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const message = document.getElementById("player-info");
    const restartBtn = document.getElementById("restart-btn");

    fieldElements.forEach((field) => 
        field.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") {
                return;
            }
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    restartBtn.addEventListener("click", () => {
        Gameboard.resetField();
        gameController.reset();
        updateGameboard();
        setPlayerInfo("Player X's turn");
    });

    const updateGameboard = () => {
        for(let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = Gameboard.getField(i);
        }
    };

    const setResultInfo = (winner) => {
        if (winner === "Draw") {
            setPlayerInfo(`It's a draw.`);
            Gameboard.resetField();
        }
        else {
            setPlayerInfo(`Player ${winner} has won!`)
        }
    };

    const setPlayerInfo = (info) => {
        message.textContent = info;
    };
    
    return {setResultInfo, setPlayerInfo};
})();

const gameController = (() => {
    const player1 = Player("X");
    const player2 = Player("O");
    let round = 1;
    let gameIsOver = false;

    const playRound = (index) => {
        Gameboard.setField(index, getCurrentSymbol());
        if(checkWinner(index)) {
            displayController.setResultInfo(getCurrentSymbol());
            gameIsOver = true;
            return;
        }
        if(round === 9) {
            displayController.setResultInfo("Draw");
            gameIsOver = true;
            return;
        }
        round++;
        displayController.setPlayerInfo(`Player ${getCurrentSymbol()}'s turn`);
    };

    const getCurrentSymbol = () => {
        return round % 2 === 1 ? player1.getSymbol() : player2.getSymbol();
    };

    const checkWinner = (index) => {
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        return winConditions
            .filter((combination) => combination.includes(index))
            .some((possibleComb) => possibleComb.every((index) => Gameboard.getField(index) === getCurrentSymbol()
            )
        );
    };

    const getIsOver = () => {
        return gameIsOver;
    };

    const reset = () => {
        round = 1;
        gameIsOver = false;
    };

    return {playRound, getIsOver, reset};
})();