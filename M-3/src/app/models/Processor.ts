// written by Brandon Horlacher
export class Processor {
  memorySize: number = 100;
  validOpCodes = [10, 11, 20, 21, 30, 31, 32, 33, 40, 41, 42, 43];
  memory: any[];
  instructionCounter: number;
  accumulator: number;
  instructionRegister: number;
  opCode: number;
  operand: number;

  constructor() {
    this.memory = [];
    this.instructionCounter = 0;
    this.accumulator = 0;
    this.instructionRegister = 0;
    this.opCode = 0;
    this.operand = 0;

    for (let i = 0; i < this.memorySize; i++) {
      this.memory.push(0);
    }
  }

  loadNextInstruction(): boolean {
    switch (this.opCode) {
      case 0:
        this.instructionCounter = 0;
        break;
      case 40:
        this.instructionCounter = this.operand;
        break;
      case 41:
        if (this.accumulator < 0) {
          this.instructionCounter = this.operand;
        } else {
          this.instructionCounter++;
        }
        break;
      case 42:
        if (this.accumulator === 0) {
          this.instructionCounter = this.operand;
        } else {
          this.instructionCounter++;
        }
        break;
      default:
        this.instructionCounter++;
        break;
    }

    this.instructionRegister = this.memory[this.instructionCounter];
    this.opCode = Number.parseInt(('' + this.instructionRegister).substring(0, 2));
    this.operand = Number.parseInt(('' + this.instructionRegister).substring(2, 4));

    return this.opCode != 43;
  }

  getInstructionCounter(): string {
    return this.formatNumber(2, this.instructionCounter);
  }

  setInstruction(instruction: number): void {
    this.memory[this.instructionCounter] = instruction;
    this.instructionCounter++;
  }

  getCurrentOpCode(): number {
    return this.opCode;
  }

  getCurrentOperand(): number {
    return this.operand;
  }

  getValueAtLocation(location: number): number {
    return this.memory[location];
  }

  setValueAtLocation(value: number, location: number): void {
    this.memory[location] = value;
  }

  getAccumulatorValue(): number {
    return this.accumulator;
  }

  setAccumulatorValue(value: number): void {
    this.accumulator = value;
  }

  // print out the current state of the registers
  // written by Brandon Horlacher
  printRegisters(): string[] {
    let registerString: string[] = [];

    registerString.push('Accumulator:           ' + this.formatNumber(6, this.accumulator));
    registerString.push('Instruction Counter:       ' + this.formatNumber(2, this.instructionCounter));
    registerString.push('Instruction Register:   ' + this.formatNumber(6, this.instructionRegister));
    registerString.push('Operation Code:            ' + this.formatNumber(2, this.opCode));
    registerString.push('Operand:                  ' + this.formatNumber(2, this.operand));

    return registerString;
  }

  // print out the current contents of the memory
  // written by Brandon Horlacher
  printMemory(): string[][] {
    let memoryString: string[][] = [];

    memoryString.push([]);
    memoryString[0].push('');
    for (let i = 0; i < 10; i++) {
      memoryString[0].push(this.formatNumber(2, i));
    }

    for (let i = 0; i < 10; i++) {
      memoryString.push([]);
      memoryString[i + 1].push(this.formatNumber(2, (i * 10)));

      for (let j = 0; j < 10; j++) {
        memoryString[i + 1].push(this.formatNumber(6, this.memory[(i * 10) + j]));
      }
    }

    return memoryString;
  }

  // format a number value with the given number of minimum digits
  formatNumber(digits: number, value: any) {
    return parseInt(value).toLocaleString('en-US', {
      minimumIntegerDigits: digits,
      useGrouping: false
    });
  }

  getInstructionBlob(): Blob {
    let instructions = '';
    this.memory.forEach(memoryItem => {
      if (memoryItem != 0) {
        if (memoryItem > 0) {
          instructions += '+';
        }

        instructions += memoryItem + '\r\n';
      }
    });

    return new Blob([instructions],
      { type: "text/plain;charset=utf-8" });
  }
}
