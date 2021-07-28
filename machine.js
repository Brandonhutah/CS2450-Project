// setup to turn JS into a console program
var rl = require("readline");
var prompts = rl.createInterface(process.stdin, process.stdout);
var readlineSync = require('readline-sync');

// where users input instructions are stored
let memorySize = 100;
let memory = [];
let instructionCounter = 0;
let accumulator = 0;
let instructionRegister = 0;
let opCode = 0;
let operand = 0;
const allOpCodes = [10,11,20,21,30,31,32,33,40,41,42,43];

function initializeProgram() {
    for (let i = 0; i < memorySize; i++) {
        memory.push(0);
    }

    displayUserInstructions();
    getUserInstructions();
}

function displayUserInstructions() {
    const userInstructions = 'Please enter your program one instruction at a time into the input. Enter -99999 to stop entering your program.';
    console.log(userInstructions);
}

// recursively loads user instruction into memory
// written by Brandon Horlacher
function getUserInstructions() {
    prompts.question(formatNumber(2, instructionCounter) + ' ? ', (response) => {
        // recursively call to get another instruction until the user inputs the instruction indicating they are done
        if (response != '-99999' && instructionCounter < memorySize) {
            if (validateInstruction(response)) {
                memory[instructionCounter] = Number.parseInt(response);
                instructionCounter++;
            } else {
                console.log('That was not a valid instruction.');
            }

            getUserInstructions();
        } else {
						prompts.close();
            executeProgram();
        }
    });
}

// validate the input instruction was valid
function validateInstruction(instruction) {
	if (!instruction.match(/^\+\d{4}$/)) return false
	const checkOpCode = instruction.substring(1,3)
	if (!allOpCodes.includes(parseInt(checkOpCode))) return false
	return true;
}

// execute the program input by the user and print the state of registers and memory after
function executeProgram() {
    performInstructions();
    printRegisters();
    printMemory();

    process.exit();
}

// perform the operations that were input by the user
// written by Brandon Horlacher
function performInstructions() {
    while (opCode !== 43) {
        loadNextInstruction();

        switch (opCode) {
            case 10: // read
                read(operand);
                break;
            case 11: // write
                write(operand);
                break;
            case 20: // load
                load(operand);
                break;
            case 21: // store
                store(operand);
                break;
            case 30: // add
                add(operand);
                break;
            case 31: // subtract
                subtract(operand);
                break;
            case 32: // divide
                divide(operand);
                break;
            case 33: // multiply
                multiply(operand);
                break;
            default:
                break;
        }
    }
}

// load the next instruction, opcode, and operand into the registers
// written by Brandon Horlacher
function loadNextInstruction() {
    switch (opCode) {
        case 0:
            instructionCounter = 0;
            break;
        case 40:
            instructionCounter = operand;
            break;
        case 41:
            if (accumulator < 0) {
                instructionCounter = operand;
            } else {
                instructionCounter++;
            }
            break;
        case 42:
            if (accumulator === 0) {
                instructionCounter = operand;
            } else {
                instructionCounter++;
            }
            break;
        default:
            instructionCounter++;
            break;
    }

    instructionRegister = memory[instructionCounter];
    opCode = Number.parseInt(('' + instructionRegister).substring(0, 2));
    operand = Number.parseInt(('' + instructionRegister).substring(2, 4));
}


function read(operand) {
	const response = readlineSync.question("Enter an integer: ")
	memory[operand] = response
}

function write(operand) {
	console.log(memory[operand])
}

function load(operand) {
	accumulator = memory[operand]
}

function store(operand) {
	memory[operand] = accumulator
}

function add(operand) {
    // todo
}

function subtract(operand) {
    // todo
}

function divide(operand) {
    // todo
}

function multiply(operand) {
    // todo
}

// print out the current state of the registers
// written by Brandon Horlacher
function printRegisters() {
    console.log();
    console.log('REGISTERS:');
    console.log('Accumulator:           ' + formatNumber(5, accumulator));
    console.log('InstructionCounter:       ' + formatNumber(2, instructionCounter));
    console.log('InstructionRegister:   ' + formatNumber(5, instructionRegister));
    console.log('OperationCode:            ' + formatNumber(2, opCode));
    console.log('Operand:                  ' + formatNumber(2, operand));
    console.log();
}

// print out the current contents of the memory
// written by Brandon Horlacher
function printMemory() {
    console.log('MEMORY:')
    console.log('       00     01     02     03     04     05     06     07     08     09');
    for (let i = 0; i < 10; i++) {
        let memoryString = '';
        memoryString += formatNumber(2, (i * 10));

        for (let j = 0; j < 10; j++) {
            memoryString += '  ' + formatNumber(5, memory[(i * 10) + j]);
        }

        console.log(memoryString);
    }
}

// format a number value with the given number of minimum digits
function formatNumber(digits, value) {
    return parseInt(value).toLocaleString('en-US', {
        minimumIntegerDigits: digits,
        useGrouping: false
    });
}

exports.initializeProgram = initializeProgram;
