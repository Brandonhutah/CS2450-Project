const UVSim = require('./UVSim.js')
const uvSim = new UVSim()

test('test display user instructions', () => {
	const consoleSpy = jest.spyOn(console, 'log')
	uvSim.displayUserInstructions()
	expect(consoleSpy).toHaveBeenCalledWith('Please enter your program one instruction at a time into the input. Enter -99999 to stop entering your program.')
})

test('+1010 is valid instruction', () => {
	expect(uvSim.validateInstruction('+1010')).toBe(true)
})

test('+10101 is invalid instruction', () => {
	expect(uvSim.validateInstruction('+10101')).toBe(false)
})

test('test 43 quits program', () => {
	uvSim.opCode = 43;

	const spy = jest.spyOn(uvSim, 'loadNextInstruction')
	uvSim.performInstructions()
	expect(spy).not.toBeCalled()
})

test('load first instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 0
	uvSim.memory[0] = +1020

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(0)
	expect(uvSim.instructionRegister).toBe(1020)
	expect(uvSim.opCode).toBe(10)
	expect(uvSim.operand).toBe(20)
})

test('load next normal instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 10
	uvSim.memory[1] = +2030

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(1)
	expect(uvSim.instructionRegister).toBe(2030)
	expect(uvSim.opCode).toBe(20)
	expect(uvSim.operand).toBe(30)
})

test('load next branch instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 40
	uvSim.operand = 30
	uvSim.memory[30] = +3020

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(30)
	expect(uvSim.instructionRegister).toBe(3020)
	expect(uvSim.opCode).toBe(30)
	expect(uvSim.operand).toBe(20)
})

test('load next branchNeg branch instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 41
	uvSim.operand = 25
	uvSim.accumulator = -1234
	uvSim.memory[25] = +2320

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(25)
	expect(uvSim.instructionRegister).toBe(2320)
	expect(uvSim.opCode).toBe(23)
	expect(uvSim.operand).toBe(20)
})

test('load next branchNeg no branch instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 41
	uvSim.operand = 25
	uvSim.accumulator = 1234
	uvSim.memory[1] = +1234

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(1)
	expect(uvSim.instructionRegister).toBe(1234)
	expect(uvSim.opCode).toBe(12)
	expect(uvSim.operand).toBe(34)
})

test('load next branchZero branch instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 42
	uvSim.operand = 25
	uvSim.accumulator = 0
	uvSim.memory[25] = +1234

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(25)
	expect(uvSim.instructionRegister).toBe(1234)
	expect(uvSim.opCode).toBe(12)
	expect(uvSim.operand).toBe(34)
})

test('load next branchZero no branch instruction', () => {
	uvSim.instructionCounter = 0
	uvSim.opCode = 42
	uvSim.operand = 25
	uvSim.accumulator = 1234
	uvSim.memory[1] = +4321

	uvSim.loadNextInstruction()

	expect(uvSim.instructionCounter).toBe(1)
	expect(uvSim.instructionRegister).toBe(4321)
	expect(uvSim.opCode).toBe(43)
	expect(uvSim.operand).toBe(21)
})

test('read puts number into memory', () => {
	uvSim.read(10, 20)
	expect(uvSim.memory[10]).toBe(20)
})

test('write console logs correct value', () => {
	const consoleSpy = jest.spyOn(console, 'log')
	uvSim.write(10)
	expect(consoleSpy).toHaveBeenCalledWith('00020')
})

test('load puts correct number into accumulator', () => {
	uvSim.load(10)
	expect(uvSim.accumulator).toBe(20)
})

test('store puts number in accumulator into correct memory location', () => {
	uvSim.store(11)
	expect(uvSim.memory[11]).toBe(20)
})

test('test add generates correct value', () => {
	uvSim.accumulator = 10
	uvSim.memory[10] = 20

	uvSim.add(10)

	expect(uvSim.accumulator).toBe(30)
})

test('test subtract generates correct value', () => {
	uvSim.accumulator = 40
	uvSim.memory[10] = 15

	uvSim.subtract(10)

	expect(uvSim.accumulator).toBe(25)
})

test('test multiply generates correct value', () => {
	uvSim.accumulator = 5
	uvSim.memory[10] = 10

	uvSim.multiply(10)

	expect(uvSim.accumulator).toBe(50)
})

test('test divide generates correct value', () => {
	uvSim.accumulator = 40
	uvSim.memory[10] = 2

	uvSim.divide(10)

	expect(uvSim.accumulator).toBe(20)
})

afterAll(() => uvSim.prompts.close())
