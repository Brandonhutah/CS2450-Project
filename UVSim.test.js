const UVSim = require('./UVSim.js')
const uvsim = new UVSim()

test('read exported successfully', () => {
	expect(typeof uvsim.read).toBe('function')
})

test('read puts number into memory', () => {
	uvsim.read(10, 20)
	expect(uvsim.memory[10]).toBe(20)
})

test('write console logs correct value', () => {
	const consoleSpy = jest.spyOn(console, 'log')
	uvsim.write(10)
	expect(consoleSpy).toHaveBeenCalledWith('00020')
})

test('load puts correct number into accumulator', () => {
	uvsim.load(10)
	expect(uvsim.accumulator).toBe(20)
})

test('store puts number in accumulator into correct memory location', () => {
	uvsim.store(11)
	expect(uvsim.memory[11]).toBe(20)
})

afterAll(() => uvsim.prompts.close())
