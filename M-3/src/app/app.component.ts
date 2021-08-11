import {Component} from '@angular/core';
import {Processor} from "./models/Processor";
import {Add, Divide, Load, Multiply, Read, Store, Subtract, Write} from "./models/Operation";
import { saveAs } from 'file-saver';

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

  addInstructions(instructions: string): void {
    instructions.replace(/\r/g, '').split('\n').forEach(instruction => {
      if (this.validateInstruction(instruction)) {
        this.processor.setInstruction(parseInt(instruction));
      }
    });
    this.tempInst = '';
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.addInstructions(e.target.result);

        inputNode.value = null;
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  saveToFile() {
    saveAs(this.processor.getInstructionBlob(), "program.txt");
  }

  // validate the input instruction was valid
  // written by Benjamin Larsen
  validateInstruction(instruction: string) {
    if (!instruction.match(/^\+\d{4}$/)) return false;
    const checkOpCode = instruction.substring(1, 3);
    return this.operationRegister[Number(checkOpCode)] || [40, 41, 42, 43].includes(Number(checkOpCode));
  }
}
