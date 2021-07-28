const UVSim = require('./UVSim.js')
const uvsim = new UVSim()

test('read exported successfully', () => {
	expect(typeof uvsim.read).toBe('function')
})

afterAll(() => uvsim.prompts.close())
