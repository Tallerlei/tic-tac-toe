import { Component } from '@angular/core';

class Field {
  marked: 'x' | 'o' | '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'tic-tac-toe';
  fields: Field[] = new Array(9);

  constructor() {

  }
}
