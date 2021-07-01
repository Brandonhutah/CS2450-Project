// setup to turn JS into a console program
var rl = require("readline");
var prompts = rl.createInterface(process.stdin, process.stdout);

// where users input instructions are stored
let instructions = [];

function initializeProgram() {
    displayUserIntructions();
    getUserInstructions();
}

function displayUserIntructions() {
    const userInstructions = 'Put instructions for using the program here.';
    console.log(userInstructions);
}

function getUserInstructions() {
    prompts.question(instructions.length.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + ' ? ', (response) => {
        // recursively call to get another instruction until the user inputs the instruction indicating they are done
        if (response != '-99999') {
            if (validateInstruction(response)) {
                instructions.push(response);
            } else {
                console.log('That was not a valid instruction.');
            }

            getUserInstructions();
        } else {
            performInstructions();
        }
    });
}

// validate the input instruction is valid
function validateInstruction(instruction) {
    return true;
}

// perform the instructions the user input
function performInstructions() {
    instructions.forEach(i => console.log(i));
    process.exit();
}

// start the program
initializeProgram();
