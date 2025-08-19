import { Component } from '@angular/core';

interface Player {
  symbol: 'X' | 'O';
  name: string;
  score: number;
}

class Field {
  marked: 'X' | 'O' | '' = '';
  highlight: boolean = false;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Enhanced Tic-Tac-Toe';
  fields: Field[] = [];
  currentPlayerSymbol: 'X' | 'O' = 'X';
  
  // Player management
  players: Player[] = [
    { symbol: 'X', name: 'Player 1', score: 0 },
    { symbol: 'O', name: 'Player 2', score: 0 }
  ];

  winner: 'X' | 'O' | null = null;
  winnerCombo: string | null = null;
  gameOver: boolean = false;
  isDraw: boolean = false;
  totalGames: number = 0;

  constructor() {
    this.initializeGame();
  }

  initializeGame(): void {
    this.initFields();
    this.winner = null;
    this.winnerCombo = null;
    this.gameOver = false;
    this.isDraw = false;
    this.currentPlayerSymbol = 'X';
  }

  initFields(): void {
    this.fields = Array.from({ length: 9 }, () => new Field());
  }

  get currentPlayer(): Player {
    return this.players.find(p => p.symbol === this.currentPlayerSymbol) || this.players[0];
  }

  fieldClicked(event: Event, field: Field): void {
    if (this.gameOver || field.marked) {
      return;
    }

    field.marked = this.currentPlayerSymbol;
    this.checkForWinner();
    
    if (!this.gameOver) {
      this.togglePlayer();
    }
  }

  togglePlayer(): void {
    this.currentPlayerSymbol = this.currentPlayerSymbol === 'X' ? 'O' : 'X';
  }

  checkForWinner(): void {
    const markedFields = this.getMarkedFieldsBySymbol();
    
    // Check for winner
    this.checkCombinations(markedFields.X, 'X');
    this.checkCombinations(markedFields.O, 'O');
    
    // Check for draw
    if (!this.winner && markedFields.X.length + markedFields.O.length === 9) {
      this.gameOver = true;
      this.isDraw = true;
    }
  }

  private getMarkedFieldsBySymbol(): { X: number[], O: number[] } {
    const result = { X: [], O: [] };
    
    this.fields.forEach((field, index) => {
      if (field.marked === 'X') {
        result.X.push(index);
      } else if (field.marked === 'O') {
        result.O.push(index);
      }
    });
    
    return result;
  }

  checkCombinations(markedFields: number[], playerSymbol: 'X' | 'O'): void {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    if (markedFields.length < 3) return;

    for (const combination of winningCombinations) {
      if (combination.every(index => markedFields.includes(index))) {
        this.handleWinner(playerSymbol, combination);
        break;
      }
    }
  }

  private handleWinner(playerSymbol: 'X' | 'O', winningCombination: number[]): void {
    this.winner = playerSymbol;
    this.winnerCombo = winningCombination.join('');
    this.gameOver = true;
    
    // Highlight winning fields
    winningCombination.forEach(index => {
      this.fields[index].highlight = true;
    });
    
    // Update score
    const winningPlayer = this.players.find(p => p.symbol === playerSymbol);
    if (winningPlayer) {
      winningPlayer.score++;
    }
    
    this.totalGames++;
  }

  resetGame(event?: Event): void {
    this.initializeGame();
  }

  resetScores(): void {
    this.players.forEach(player => player.score = 0);
    this.totalGames = 0;
  }

  updatePlayerName(playerIndex: number, newName: string): void {
    if (playerIndex >= 0 && playerIndex < this.players.length && newName.trim()) {
      this.players[playerIndex].name = newName.trim();
    }
  }
}
