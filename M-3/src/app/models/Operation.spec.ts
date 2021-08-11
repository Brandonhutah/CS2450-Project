import {Processor} from "./Processor";
import {Add, Divide, Load, Multiply, Read, Store, Subtract, Write} from "./Operation";

describe('Operation', () => {
  let processor: Processor;

  beforeAll(async () => {
    processor = new Processor();
  });

  it('read should have opcode 10', () => {
    expect(new Read().opCode).toEqual(10);
  });

  it ('should write memory value', () => {
    processor.setValueAtLocation(1234, 32);

    const write = new Write();

    expect(write.opCode).toEqual(11);
    expect(write.performOperation(32, processor)).toEqual('001234');
  });

  it ('should load memory value', () => {
    processor.setValueAtLocation(1234, 32);

    const load = new Load();
    load.performOperation(32, processor);

    expect(load.opCode).toEqual(20);
    expect(processor.getAccumulatorValue()).toEqual(1234);
  });

  it ('should store memory value', () => {
    processor.setAccumulatorValue(4321);

    const store = new Store();
    store.performOperation(32, processor);

    expect(store.opCode).toEqual(21);
    expect(processor.getValueAtLocation(32)).toEqual(4321);
  });

  it ('should add accumulator value', () => {
    processor.setAccumulatorValue(4321);
    processor.setValueAtLocation(1234, 12);

    const add = new Add();
    add.performOperation(12, processor);

    expect(add.opCode).toEqual(30);
    expect(processor.getAccumulatorValue()).toEqual(5555);
  });

  it ('should subtract accumulator value', () => {
    processor.setAccumulatorValue(2000);
    processor.setValueAtLocation(1200, 12);

    const subtract = new Subtract();
    subtract.performOperation(12, processor);

    expect(subtract.opCode).toEqual(31);
    expect(processor.getAccumulatorValue()).toEqual(800);
  });

  it ('should divide accumulator value', () => {
    processor.setAccumulatorValue(2000);
    processor.setValueAtLocation(1000, 12);

    const divide = new Divide();
    divide.performOperation(12, processor);

    expect(divide.opCode).toEqual(32);
    expect(processor.getAccumulatorValue()).toEqual(2);
  });

  it ('should multiply accumulator value', () => {
    processor.setAccumulatorValue(2000);
    processor.setValueAtLocation(3, 12);

    const multiply = new Multiply();
    multiply.performOperation(12, processor);

    expect(multiply.opCode).toEqual(33);
    expect(processor.getAccumulatorValue()).toEqual(6000);
  });
});
