// written by Benjamin Larsen
import {Processor} from "./Processor";

export interface Operation {
  opCode: number;
  performOperation: Function;
}

export class Read implements Operation {
  opCode = 10;

  performOperation(operand: number, processor: Processor): string {
    let value = prompt("Enter an integer", "0");
    let number;
    if (value) {
      number = parseInt(value);
      if (!isNaN(number)) {
        processor.setValueAtLocation(number, operand);
        return 'Enter an integer: ' + number;
      }
    }

    alert('That was not a valid integer!');

    return '';
  }
}

export class Write implements Operation {
  opCode = 11;

  performOperation(operand: number, processor: Processor): string {
    return processor.formatNumber(5, processor.getValueAtLocation(operand));
  }
}

export class Load implements Operation {
  opCode = 20;

  performOperation(operand: number, processor: Processor): string {
    processor.setAccumulatorValue(processor.getValueAtLocation(operand));

    return '';
  }
}

export class Store implements Operation {
  opCode = 21;

  performOperation(operand: number, processor: Processor): string {
    processor.setValueAtLocation(processor.getAccumulatorValue(), operand);

    return '';
  }
}

export class Add implements Operation {
  opCode = 30;

  performOperation(operand: number, processor: Processor): string {
    processor.setAccumulatorValue(processor.getAccumulatorValue() + processor.getValueAtLocation(operand));

    return '';
  }
}

export class Subtract implements Operation {
  opCode = 31;

  performOperation(operand: number, processor: Processor): string {
    processor.setAccumulatorValue(processor.getAccumulatorValue() - processor.getValueAtLocation(operand));

    return '';
  }
}

export class Divide implements Operation {
  opCode = 32;

  performOperation(operand: number, processor: Processor): string {
    processor.setAccumulatorValue(processor.getAccumulatorValue() / processor.getValueAtLocation(operand));

    return '';
  }
}

export class Multiply implements Operation {
  opCode = 33;

  performOperation(operand: number, processor: Processor): string {
    processor.setAccumulatorValue(processor.getAccumulatorValue() * processor.getValueAtLocation(operand));

    return '';
  }
}
