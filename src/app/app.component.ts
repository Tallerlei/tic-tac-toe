import { Component } from '@angular/core';

class Field {
  marked: 'x' | 'o' | '';
  highlight = false;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'tic-tac-toe';
  fields: Field[] = [];
  player: 'x' | 'o' = 'x';

  winner: 'x' | 'o' = null;
  winnerCombo: string = null;

  gameOver = false;

  constructor() {
    this.initFields();
  }

  initFields(): void {
    this.fields = Array.from({ length: 9 }, () => new Field());
  }

  fieldClicked(event, field: Field): void {
    if (this.winner === null && field.marked !== 'x' && field.marked !== 'o') {
      field.marked = this.player;
      this.togglePlayer();
      this.checkForWinner();
    }
  }

  togglePlayer(): void {
    this.player = this.player === 'x' ? 'o' : 'x';
  }

  checkForWinner(): void {
    const xMarkedFields = [];
    const oMarkedFields = [];

    // add indizes to array
    this.fields.forEach((field, index) => {
      if (field.marked) {
        if (field.marked === 'x') {
          xMarkedFields.push(index);
        } else {
          oMarkedFields.push(index);
        }
      }
    });
    this.checkCombinations(xMarkedFields, 'x');
    this.checkCombinations(oMarkedFields, 'o');
    // check if one has at least three indizes
    if (xMarkedFields.length + oMarkedFields.length === 9) {
      this.gameOver = true;
    }
  }
  checkCombinations(fields, winner): void {
    const winnerCombination = ['012', '345', '678', '036', '147', '258', '048', '246'];
    if (fields.length >= 3) {
      winnerCombination.forEach(combo => {
        if (combo.split('').every(i => {
          console.log(i, 'included in? ', fields.includes(i));
          return fields.includes(parseInt(i, 10));
        })) {
          this.winnerCombo = combo;
          this.fields.forEach((field, index) => {
            if (this.winnerCombo.split('').includes(index.toString())) {
              field.highlight = true;
            }
          });
          this.winner = winner;
          this.gameOver = true;
        }
      });
    }
  }
  resetGame(event): void {
    this.initFields();
    this.winner = null;
    this.winnerCombo = null;
    this.gameOver = false;

  }
}
