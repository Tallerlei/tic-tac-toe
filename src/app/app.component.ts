import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [`
    .main {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .game-header {
      text-align: center;
      margin-bottom: 30px;
      color: white;
    }

    .game-header h1 {
      font-size: 2.5rem;
      margin: 0 0 20px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-weight: bold;
    }

    .players-section {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .player-info {
      background: rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .player-info.active {
      border-color: #ffeb3b;
      background: rgba(255,235,59,0.2);
      box-shadow: 0 0 20px rgba(255,235,59,0.3);
    }

    .player-name-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
    }

    .player-name-input {
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.5);
      color: white;
      font-size: 16px;
      padding: 2px 5px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .player-name-input:focus {
      border-bottom-color: #ffeb3b;
    }

    .player-symbol {
      font-weight: bold;
      color: #ffeb3b;
    }

    .player-score {
      font-size: 14px;
      opacity: 0.9;
    }

    .game-status {
      font-size: 1.2rem;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }

    .board-wrapper {
      display: inline-block;
      position: relative;
      margin-bottom: 30px;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
      width: 90%;
      max-width: 400px;
    }

    .board {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 3px;
      background: #333;
      border-radius: 10px;
      overflow: hidden;
    }

    .field {
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: default;
      transition: all 0.2s ease;
    }

    .field.clickable {
      cursor: pointer;
    }

    .field.clickable:hover {
      background: #f0f0f0;
      transform: scale(0.95);
    }

    .field.highlight {
      background: #ffeb3b !important;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { 
        box-shadow: 0 0 10px rgba(255,235,59,0.5);
      }
      50% { 
        box-shadow: 0 0 20px rgba(255,235,59,0.8);
      }
    }

    .field-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mark {
      font-size: 3rem;
      font-weight: bold;
      animation: markAppear 0.3s ease-out;
    }

    @keyframes markAppear {
      from {
        transform: scale(0) rotate(180deg);
        opacity: 0;
      }
      to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    .x-marked .mark {
      color: #e74c3c;
    }

    .o-marked .mark {
      color: #3498db;
    }

    .dummy {
      margin-top: 100%;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-primary {
      background: linear-gradient(45deg, #28a745, #20c997);
      color: white;
      box-shadow: 0 4px 15px rgba(40,167,69,0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40,167,69,0.4);
    }

    .btn-secondary {
      background: linear-gradient(45deg, #6c757d, #868e96);
      color: white;
      box-shadow: 0 4px 15px rgba(108,117,125,0.3);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(108,117,125,0.4);
    }

    .btn-large {
      padding: 15px 30px;
      font-size: 18px;
      background: linear-gradient(45deg, #007bff, #0056b3);
      color: white;
      box-shadow: 0 4px 15px rgba(0,123,255,0.3);
    }

    .btn-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,123,255,0.4);
    }

    .game-result-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    .game-result {
      background: white;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 90%;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .result-content {
      margin-bottom: 30px;
    }

    .result-content h2 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 2rem;
    }

    .result-content p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }

    .game-stats {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      color: white;
      text-align: center;
    }

    .game-stats h3 {
      margin: 0 0 10px 0;
      font-size: 1.2rem;
    }

    .game-stats p {
      margin: 5px 0;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .main {
        padding: 15px;
      }
      
      .game-header h1 {
        font-size: 2rem;
      }
      
      .players-section {
        gap: 20px;
      }
      
      .player-info {
        padding: 10px;
        min-width: 140px;
      }
      
      .controls {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 200px;
      }
      
      .mark {
        font-size: 2.5rem;
      }
    }
  `]
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
    const result: { X: number[], O: number[] } = { X: [], O: [] };
    
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
}
