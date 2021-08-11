import {Processor} from "./Processor";

describe('Processor', () => {
  let processor: Processor;

  beforeEach(async () => {
    processor = new Processor();
  });

  it('should init the processor', () => {
    expect(processor.getAccumulatorValue()).toEqual(0);
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOperand()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(0);
  });

  it('should set instruction', () => {
    expect(processor.getInstructionCounter()).toEqual(0);

    processor.setInstruction(1234);

    expect(processor.getInstructionCounter()).toEqual(1);
    expect(processor.getValueAtLocation(0)).toEqual(1234);
  });

  it('should set value', () => {
    expect(processor.getValueAtLocation(20)).toEqual(0);

    processor.setValueAtLocation(5432, 20);

    expect(processor.getValueAtLocation(20)).toEqual(5432);
  });

  it('should print registers', () => {
    const registers: string[] = processor.printRegisters();

    expect(registers.length).toEqual(5);
    expect(registers[0]).toEqual('Accumulator: 000000');
    expect(registers[1]).toEqual('Instruction Counter: 00');
    expect(registers[2]).toEqual('Instruction Register: 000000');
    expect(registers[3]).toEqual('Operation Code: 00');
    expect(registers[4]).toEqual('Operand: 00');
  });

  it('should print memory', () => {
    const memory: string[][] = processor.printMemory();

    expect(memory.length).toEqual(11);

    for (let i = 0; i < 11; i++) {
      expect(memory[i].length).toEqual(11);

      for (let j = 0; j < 11; j++) {
        if (i == 0) {
          if (j == 0) {
            expect(memory[i][j]).toEqual('');
          } else {
            expect(memory[i][j]).toEqual('0' + (j - 1));
          }
        } else if (j == 0) {
          expect(memory[i][j]).toEqual((i - 1) + '0');
        } else {
          expect(memory[i][j]).toEqual('000000');
        }
      }
    }
  });

  it('should return blob', () => {
    processor.setInstruction(1234);
    processor.setInstruction(4321);

    const blob: Blob = processor.getInstructionBlob();
    blob.text().then(t => {
      const instructions: string[] = t.split('\r\n');
      expect(instructions.length).toEqual(2);
      expect(instructions[0]).toEqual('+1234');
      expect(instructions[1]).toEqual('+4321');
    });

    expect(blob).toBeTruthy();
  });

  it ('should load first instruction', () => {
    processor.setInstruction(1234);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(12);
    expect(processor.getCurrentOperand()).toEqual(34);
  });

  it ('should load next instruction', () => {
    processor.setInstruction(1234);
    processor.setInstruction(2121);
    processor.loadNextInstruction()

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(1);
    expect(processor.getCurrentOpCode()).toEqual(21);
    expect(processor.getCurrentOperand()).toEqual(21);
  });

  it ('should load branch instruction', () => {
    processor.setInstruction(4012);
    processor.setValueAtLocation(8765, 12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(40);
    expect(processor.getCurrentOperand()).toEqual(12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(12);
    expect(processor.getCurrentOpCode()).toEqual(87);
    expect(processor.getCurrentOperand()).toEqual(65);
  });

  it ('should load branch neg instruction', () => {
    processor.setAccumulatorValue(-1234);
    processor.setInstruction(4112);
    processor.setValueAtLocation(7654, 12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(41);
    expect(processor.getCurrentOperand()).toEqual(12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(12);
    expect(processor.getCurrentOpCode()).toEqual(76);
    expect(processor.getCurrentOperand()).toEqual(54);
  });

  it ('should not load branch neg instruction', () => {
    processor.setAccumulatorValue(1234);
    processor.setInstruction(4112);
    processor.setInstruction(1234);
    processor.setValueAtLocation(9876, 12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(41);
    expect(processor.getCurrentOperand()).toEqual(12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(1);
    expect(processor.getCurrentOpCode()).toEqual(12);
    expect(processor.getCurrentOperand()).toEqual(34);
  });

  it ('should load branch zero instruction', () => {
    processor.setAccumulatorValue(0);
    processor.setInstruction(4212);
    processor.setValueAtLocation(7654, 12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(42);
    expect(processor.getCurrentOperand()).toEqual(12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(12);
    expect(processor.getCurrentOpCode()).toEqual(76);
    expect(processor.getCurrentOperand()).toEqual(54);
  });

  it ('should not load branch zero instruction', () => {
    processor.setAccumulatorValue(1234);
    processor.setInstruction(4212);
    processor.setInstruction(1234);
    processor.setValueAtLocation(9876, 12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(42);
    expect(processor.getCurrentOperand()).toEqual(12);

    expect(processor.loadNextInstruction()).toBeTrue();
    expect(processor.getInstructionCounter()).toEqual(1);
    expect(processor.getCurrentOpCode()).toEqual(12);
    expect(processor.getCurrentOperand()).toEqual(34);
  });

  it ('should return false at program end', () => {
    processor.setInstruction(4300);

    expect(processor.loadNextInstruction()).toBeFalse();
    expect(processor.getInstructionCounter()).toEqual(0);
    expect(processor.getCurrentOpCode()).toEqual(43);
    expect(processor.getCurrentOperand()).toEqual(0);
  });

  it ('should format number', () => {
    expect(processor.formatNumber(2, 1)).toEqual('01');
    expect(processor.formatNumber(3, 1)).toEqual('001');
    expect(processor.formatNumber(4, 1)).toEqual('0001');
    expect(processor.formatNumber(5, 1)).toEqual('00001');
    expect(processor.formatNumber(6, 1)).toEqual('000001');
  });
});
