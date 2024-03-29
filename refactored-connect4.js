

class Game {
    constructor(p1, p2, width = 7, height = 6) {
        this.width = width;
        this.height = height;
        this.currPlayer = p1;
        this.players = [p1, p2];
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
    }

    makeBoard() {
        this.board = [];
        for (let i = 0; i < this.height; i++) {
            this.board.push([]);
            for (let j = 0; j < this.width; j++) {
                this.board[i].push(null)
            }
        }
        return this.board;
    }

    makeHtmlBoard() {
        const board = document.querySelector("#board");
        board.innerHTML = '';

        // Creates top row for gamepiece selection
        const top = document.createElement("tr");
        top.setAttribute("id", "column-top");


        this.handleGameClick = this.handleClick.bind(this);

        top.addEventListener("click", this.handleGameClick);

        for (let x = 0; x < this.width; x++) {
            const headCell = document.createElement("td");
            headCell.setAttribute("id", x);
            top.append(headCell);
        }
        board.append(top);

        // Creates the table rows
        for (let y = 0; y < this.height; y++) {
            const row = document.createElement("tr");
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement("td");
                cell.setAttribute("id", `${y}-${x}`);
                row.append(cell);
            }
            board.append(row);
        }
    }

    findSpotForCol(x) {
        // I needed to look at solution to get this function to work
        for (let y = this.height - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        // piece.classList.add(this.currPlayer);
        piece.style.backgroundColor = this.currPlayer.color;
        const table = document.querySelector('#board');
        const t = document.getElementById(`${y}-${x}`)
        t.append(piece)
    }

    endGame(msg) {
        alert(msg)
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleGameClick);
    }

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
        // console.log(x)

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.placeInTable(y, x);
        this.board[y][x] = this.currPlayer;

        // check for win
        // if (this.checkForWin()) {
        //     return endGame(`Player ${this.currPlayer.color} won!`);
        // }

        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }

        if (this.checkForWin()) {
            this.gameOver = true;
            return this.endGame(`The ${this.currPlayer.color} player won!`);
        }

        // check for tie
        // const filled = this.board.every((val, i) => val[i] !== null);
        // if (filled) return this.endGame();



        // switch players
        this.currPlayer =
            this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        const _win = (cells) =>
            cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.height &&
                    x >= 0 &&
                    x < this.width &&
                    this.board[y][x] === this.currPlayer
            );



        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer



        // Checks to see if possible win path is obtained
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
    }
}

document.getElementById('start-game').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2);
});



