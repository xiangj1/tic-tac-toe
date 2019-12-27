import { question, keyInSelect, keyIn } from "readline-sync";

class TicTacToe {
    private players: [Player, Player]
    private gameController: GameController

    static marks = ['X', 'O']

    constructor() {
        console.log('Game Initializing...')

        let name1 = question('First Player name: ');
        let p1 = new Player(name1);
        let name2 = question('Second Player name: ');
        let p2 = new Player(name2);

        this.players = [p1, p2];
        this.gameController = new GameController();
        console.log('Initialization Done!');
    }

    run() {
        let choices = ['Start Game', 'Display Score', 'Switch Player', 'Exit'];
        while(1) {
        console.log('--------------------------------------')
            let choice = keyInSelect(choices, 'Pick your choice');
            console.log(choices[choice], '\n');
            switch(choice) {
                case 0:
                    this.startGame();
                    break;

                case 1:
                    this.displayScore();
                    break;
                
                case 2:
                    [this.players[0], this.players[1]] = [this.players[1], this.players[0]];
                    console.log('Player has been Switched!');
                    break;

                case 3:
                    return;
                
                default:
                    console.log('Invalid Choice');
            }
        }
    }

    private startGame() {
        console.log('Game Started!');

        let turn = 0;
        
        while(1) {
            let currentPlayer = this.players[turn];
            let currentMark = TicTacToe.marks[turn];
            
            this.gameController.displayBoard();
            
            console.log(`${currentPlayer.getName()}'s turn: ${currentMark}`);

            let row = question('Row: ');
            let col = question('Col: ');
            let point = new Point(parseInt(row), parseInt(col));

            let result = this.gameController.makeMove(point, currentPlayer);
            
            if(result > 0) {
                return currentPlayer.updateScore();
            } else if(result < 0) {
                console.log('Invalid input!');
            } else {
                turn = (turn+1)%2;
            }
        }
    }

    private displayScore() {
        console.log(`${this.players[0].getName()}: ${this.players[0].getScore()}`);
        console.log(`${this.players[1].getName()}: ${this.players[1].getScore()}`);
    }
    
}

class Board {
    private grid: number[][]
    
    constructor() {
        this.grid = new Array(3).fill(-1).map(() => new Array(3).fill(-1));
    }

    canMove(point: Point): Boolean {
        return point.r >= 0 && point.r < this.grid.length &&
            point.c >= 0 && point.c < this.grid[point.r].length &&
            this.grid[point.r][point.c] == -1;
    }

    move(point: Point, id: number): void {
        this.grid[point.r][point.c] = id;
    }

    getBoard() {
        return this.grid;
    }

    display() {
        console.log('\nBoard:')
        for(let row of this.grid) {
            console.log(row.map(col => col == -1 ? ' ' : `${col}`))
        }
        console.log('\n')
    }
}

class GameController {
    private board: Board
    private winner: null | Player

    constructor() {
        this.board = new Board();
        this.winner = null;
    }
    
    makeMove(point: Point, player: Player): Number {
        if(this.board.canMove(point) && this.winner == null) {
            this.board.move(point, player.getId());
            return this.win(point.r, point.c, player.getId());
        }
        return -1;
    }

    displayBoard() {
        this.board.display();
    }

    private win(row: number, col: number, player: number) {
        let grid = this.board.getBoard();
        for(let i = 0; i <= grid.length; ++i) {
            if(i == grid.length)
                return 1;
            if(grid[i][col] != player)
                break;
        }
        
        for(let i = 0; i <= grid[row].length; ++i) {
            if(i == grid[row].length)
                return 1;
            if(grid[row][i] != player)
                break;
        }
        
        if(row == col || row+col == grid.length-1) {
            for(let i = 0; i <= grid.length; ++i) {
                if(i == grid.length)
                    return 1;
                if(grid[i][i] != player)
                    break;
            }

            for(let i = 0, j = grid.length-1; i <= grid.length; ++i, --j) {
                if(i == grid.length)
                    return 1;
                if(grid[i][j] != player)
                    break;
            }

        }
        
        return 0;
    }
}

class Player {
    private id: number
    private name: string
    private score: number

    static nextId = 1;

    constructor(name: string, score = 0) {
        this.id = Player.nextId++;
        this.name = name;
        this.score = score;
    }
    
    getId() {
        return this.id;
    }
    
    getName() {
        return this.name;
    }

    getScore() {
        return this.score;
    }

    updateScore() {
        this.score++;
    }
}

class Point {
    r: number
    c: number
    constructor(r: number, c: number) {
        this.r = r;
        this.c = c;
    }
}

const ticTacToe = new TicTacToe();
ticTacToe.run();