const index = require('./UVSim.js')

test('test', () => {
	expect(true).toBe(true)
})

test('index read', () => {
	console.log(typeof index.read)
	expect(typeof index.read).toBe('function')
})
