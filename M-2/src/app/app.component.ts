import {Component} from '@angular/core';
import {Processor} from "./models/Processor";
import {Add, Divide, Load, Multiply, Read, Store, Subtract, Write} from "./models/Operation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  processor!: Processor;
  operationRegister: any;
  output!: string[];
  tempInst: string = '';

  constructor() {
    this.operationRegister = {};

    [
      new Read(),
      new Write(),
      new Load(),
      new Store(),
      new Add(),
      new Subtract(),
      new Divide(),
      new Multiply()
    ].forEach(op => {
      this.operationRegister[op.opCode] = op;
    });

    this.init();
  }

  init(): void {
    this.processor = new Processor();
    this.output = [];
  }

  runProgram(): void {
    while (this.processor.loadNextInstruction()) {
      if (this.operationRegister[this.processor.getCurrentOpCode()]) {
        let returnVal = this.operationRegister[this.processor.getCurrentOpCode()].performOperation(this.processor.getCurrentOperand(), this.processor);

        if (returnVal) {
          this.output.push(returnVal);
        }
      }
    }

    this.output.push('Program execution finished.');
  }

  addInstruction(instruction: string): void {
    if (this.validateInstruction(instruction)) {
      this.processor.setInstruction(parseInt(instruction));
      this.tempInst = '';
    }
  }

  // validate the input instruction was valid
  // written by Benjamin Larsen
  validateInstruction(instruction: string) {
    if (!instruction.match(/^\+\d{4}$/)) return false;
    const checkOpCode = instruction.substring(1, 3);
    return this.operationRegister[Number(checkOpCode)] || [40, 41, 42, 43].includes(Number(checkOpCode));
  }

  checkForEnterKey(event: any) {
    if (event.key == 'Enter') {
      this.addInstruction(this.tempInst);
    }
  }
}
