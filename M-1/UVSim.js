// setup to turn JS into a console program
class UVSim {
    constructor() {
        this.rl = require("readline");
        this.prompts = this.rl.createInterface(process.stdin, process.stdout);
        this.readlineSync = require('readline-sync');

        // where users input instructions are stored
        this.memorySize = 100;
        this.memory = [];
        for (let i = 0; i < this.memorySize; i++) {
            this.memory.push(0);
        }
        this.instructionCounter = 0;
        this.accumulator = 0;
        this.instructionRegister = 0;
        this.opCode = 0;
        this.operand = 0;
        this.validOpCodes = [10, 11, 20, 21, 30, 31, 32, 33, 40, 41, 42, 43];
    }

    initializeProgram() {
        this.displayUserInstructions();
        this.getUserInstructions();
    }

    displayUserInstructions() {
        const userInstructions = 'Please enter your program one instruction at a time into the input. Enter -99999 to stop entering your program.';
        console.log(userInstructions);
    }

    // recursively loads user instruction into memory
    // written by Brandon Horlacher
    getUserInstructions() {
        this.prompts.question(this.formatNumber(2, this.instructionCounter) + ' ? ', (response) => {
            // recursively call to get another instruction until the user inputs the instruction indicating they are done
            if (response != '-99999' && this.instructionCounter < this.memorySize) {
                if (this.validateInstruction(response)) {
                    this.memory[this.instructionCounter] = Number.parseInt(response);
                    this.instructionCounter++;
                } else {
                    console.log('That was not a valid instruction.');
                }

                this.getUserInstructions();
            } else {
                this.prompts.close();
                this.executeProgram();
            }
        });
    }

    // validate the input instruction was valid
    // written by Benjamin Larsen
    validateInstruction(instruction) {
        if (!instruction.match(/^\+\d{4}$/)) return false
        const checkOpCode = instruction.substring(1, 3)
        if (!this.validOpCodes.includes(parseInt(checkOpCode))) return false
        return true;
    }

    // execute the program input by the user and print the state of registers and memory after
    executeProgram() {
        this.performInstructions();
        this.printRegisters();
        this.printMemory();

        process.exit();
    }

    // perform the operations that were input by the user
    // written by Brandon Horlacher
    performInstructions() {
        while (this.opCode !== 43) {
            this.loadNextInstruction();

            switch (this.opCode) {
                case 10: // read
                    this.read(this.operand);
                    break;
                case 11: // write
                    this.write(this.operand);
                    break;
                case 20: // load
                    this.load(this.operand);
                    break;
                case 21: // store
                    this.store(this.operand);
                    break;
                case 30: // add
                    this.add(this.operand);
                    break;
                case 31: // subtract
                    this.subtract(this.operand);
                    break;
                case 32: // divide
                    this.divide(this.operand);
                    break;
                case 33: // multiply
                    this.multiply(this.operand);
                    break;
                default:
                    break;
            }
        }
    }

    // load the next instruction, opcode, and operand into the registers
    // written by Brandon Horlacher
    loadNextInstruction() {
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
    }


    // written by Benjamin Larsen
    // input allows override of reading from console for testing
    read(operand, input = null) {
        const response = input || this.readlineSync.question("Enter an integer: ")
        this.memory[operand] = response
    }

    // written by Benjamin Larsen
    write(operand) {
        console.log(this.formatNumber(5, parseInt(this.memory[operand])))
    }

    // written by Benjamin Larsen
    load(operand) {
        this.accumulator = this.memory[operand]
    }

    // written by Benjamin Larsen
    store(operand) {
        this.memory[operand] = this.accumulator
    }

    // written by Brandon Horlacher
    add(operand) {
        this.accumulator += this.memory[operand]
    }

    // written by Brandon Horlacher
    subtract(operand) {
        this.accumulator -= this.memory[operand]
    }

    // written by Brandon Horlacher
    divide(operand) {
        this.accumulator /= this.memory[operand]
    }

    // written by Brandon Horlacher
    multiply(operand) {
        this.accumulator *= this.memory[operand]
    }

    // print out the current state of the registers
    // written by Brandon Horlacher
    printRegisters() {
        console.log();
        console.log('REGISTERS:');
        console.log('Accumulator:           ' + this.formatNumber(5, this.accumulator));
        console.log('InstructionCounter:       ' + this.formatNumber(2, this.instructionCounter));
        console.log('InstructionRegister:   ' + this.formatNumber(5, this.instructionRegister));
        console.log('OperationCode:            ' + this.formatNumber(2, this.opCode));
        console.log('Operand:                  ' + this.formatNumber(2, this.operand));
        console.log();
    }

    // print out the current contents of the memory
    // written by Brandon Horlacher
    printMemory() {
        console.log('MEMORY:')
        console.log('       00     01     02     03     04     05     06     07     08     09');
        for (let i = 0; i < 10; i++) {
            let memoryString = '';
            memoryString += this.formatNumber(2, (i * 10));

            for (let j = 0; j < 10; j++) {
                memoryString += '  ' + this.formatNumber(5, this.memory[(i * 10) + j]);
            }

            console.log(memoryString);
        }
    }

    // format a number value with the given number of minimum digits
    formatNumber(digits, value) {
        return parseInt(value).toLocaleString('en-US', {
            minimumIntegerDigits: digits,
            useGrouping: false
        });
    }
}

module.exports = UVSim;
