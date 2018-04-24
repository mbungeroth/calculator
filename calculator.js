function changeScreen(specialInstruction = 'none') {
  if (specialInstruction === 'clear') {
    screen.textContent = 0;
  } else if (specialInstruction === 'answer') {
    let numText = String(numsAndOperations);
    if (numText.length <= 8) {
      screen.textContent = numsAndOperations;
    } else {
      if (numText.indexOf('.') !== -1 &&
          numText.indexOf('.') < 6) {
        if (numText.slice(2, 8) === '000000') {
          screen.textContent = 0;
        } else {
          let fixedAmount = 6;
          fixedAmount -= (numText.indexOf('.') - 1);
          screen.textContent = Number(numText).toFixed(fixedAmount);
        }
      } else {
        let ones = numText.slice(0,1);
        let decimals = numText.slice(1,4);
        let extra = numText.length - 1;
        let scientificNotation = ones + '.' + decimals + 'e' + extra;
        screen.textContent = scientificNotation;
      }
    }
  } else if (specialInstruction !== 'none') {
    screen.textContent = specialInstruction;
  } else {
    screen.textContent = temporaryNums;
  }
}

function pressClear() {
  temporaryNums = '';
  changeScreen('clear');
  numsAndOperations = [];
}

function pressDelete() {
  if (temporaryNums.length === 1) {
    temporaryNums = '';
    changeScreen('clear');
  } else if (temporaryNums.length > 1) {
    temporaryNums = temporaryNums.slice(0, temporaryNums.length - 1);
    changeScreen();
  }
}

function pressDecimal() {
  if (temporaryNums.length === 0) {
    temporaryNums += '0.';
    changeScreen();
  } else {
    temporaryNums += '.';
    changeScreen();
  }
}

function pressEquals() {
  numsAndOperations.push(Number(temporaryNums));
  if (numsAndOperations.length === 0) {
    return;
  } else {
    while (numsAndOperations.length > 1) {
      for (let i = 1; i < numsAndOperations.length; i += 2) {
        let operator = numsAndOperations[i];
        let num1 = numsAndOperations[i - 1];
        let num2 = numsAndOperations[i + 1];
        if (operator === 'x') {
          numsAndOperations[i - 1] = operations.multiply(num1, num2);
          numsAndOperations.splice(i, 2);
          i -= 2;
        } else if (operator === '÷') {
          numsAndOperations[i - 1] = operations.divide(num1, num2);
          numsAndOperations.splice(i, 2);
          i -= 2;
        } else if (operator === '+') {
          let safeToAdd = (numsAndOperations.indexOf('x') < 0 &&
                           numsAndOperations.indexOf('÷') < 0)
          if (safeToAdd) {
            numsAndOperations[i - 1] = operations.add(num1, num2);
            numsAndOperations.splice(i, 2);
            i -= 2;
          }
        } else {
          let safeToSubtract = (numsAndOperations.indexOf('x') < 0 &&
                                numsAndOperations.indexOf('÷') < 0)
          if (safeToSubtract) {
            numsAndOperations[i - 1] = operations.subtract(num1, num2);
            numsAndOperations.splice(i, 2);
            i -= 2;
          }
        }
      }
    }
    if (screen.textContent !== 'Nah, yo!') {
      changeScreen('answer');
      temporaryNums = '';
      numsAndOperations = [];
    }
  }
}

const numButtons = document.querySelectorAll('.number');
numButtons.forEach(function(currentBut) {
  currentBut.addEventListener('click', function() {
    let text = currentBut.textContent;
    if (temporaryNums.length < 8) {
      temporaryNums += text;
      changeScreen();
    }
  });
});

const clear = document.getElementById('clear');
clear.addEventListener('click', pressClear);

const deleteKey = document.getElementById('delete');
deleteKey.addEventListener('click', pressDelete);

const negative = document.getElementById('negative');
negative.addEventListener('click', function() {
  if (temporaryNums.length === 0) {
    return;
  } else if (temporaryNums[0] !== '-') {
    temporaryNums = '-' + temporaryNums;
    changeScreen()
  } else {
    temporaryNums = temporaryNums.slice(1);
    changeScreen();
  }
});

const operationButtons = document.querySelectorAll('.operation');
operationButtons.forEach(function(currentBut) {
  currentBut.addEventListener('click', function() {
    numsAndOperations.push(Number(temporaryNums));
    let text = currentBut.textContent;
    numsAndOperations.push(text);
    temporaryNums = '';
    changeScreen(text);
  });
});

const decimal = document.getElementById('decimal');
decimal.addEventListener('click', pressDecimal);

const screen = document.getElementById('screentext');

let numsAndOperations = [];
let temporaryNums = '';

const operations = {
  add: (num1, num2) => num1 + num2,
  subtract: (num1, num2) => num1 - num2,
  multiply: (num1, num2) => num1 * num2,
  divide: function(num1, num2) {
    if (num2 === 0) {
      screen.textContent = 'Nah, yo!';
      numsAndOperations = [];
      temporaryNums = '';
    } else {
      return num1 / num2;
    }
  }
};

const equals = document.getElementById('eqbutton');
equals.addEventListener('click', pressEquals);

document.addEventListener('keydown', function(event) {
  let keyName = event.key;
  console.log('key name is', keyName, 'event.key is', event.key);
  if ((Number(keyName) >= 0 || Number(keyName) <= 9)
       && temporaryNums.length < 8) {
    temporaryNums += Number(keyName);
    changeScreen();
  } else if (keyName === '=') {
      pressEquals();
  } else if (keyName === '+' || keyName === '-') {
      numsAndOperations.push(Number(temporaryNums));
      let text = keyName;
      numsAndOperations.push(text);
      temporaryNums = '';
      changeScreen(text);
  } else if (keyName === '*') {
      numsAndOperations.push(Number(temporaryNums));
      let text = 'x';
      numsAndOperations.push(text);
      temporaryNums = '';
      changeScreen(text);
  } else if (keyName === '/') {
      numsAndOperations.push(Number(temporaryNums));
      let text = '÷';
      numsAndOperations.push(text);
      temporaryNums = '';
      changeScreen(text);
  } else if (keyName === 'Clear') {
      pressClear();
  } else if (keyName === 'Backspace' || keyName === 'Delete') {
      pressDelete();
  } else if (keyName === '.') {
      pressDecimal();
  }
});

//This event listener exists because putting event.key === 'Enter' in
//the previous anonymous function did not actually trigger anything
//happening. Why? I do not know. The code is the exact same. Explain
//this to me, please.
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    pressEquals();
  }
});
