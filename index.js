// setup to turn JS into a console program
var rl = require("readline");
var prompts = rl.createInterface(process.stdin, process.stdout);

// where users input instructions are stored
let memorySize = 100;
let memory = [];
let instructionCounter = 0;
let accumulator = 0;
let instructionRegister = 0;
let opCode = 0;
let operand = 0;

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
            executeProgram();
        }
    });
}

// validate the input instruction was valid
function validateInstruction(instruction) {
    // todo
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
function performInstructions() {
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
    return value.toLocaleString('en-US', {
        minimumIntegerDigits: digits,
        useGrouping: false
    });
}

// start the program
initializeProgram();
