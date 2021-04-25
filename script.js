function runWasmFile() {
    let file = document.getElementById('inputFile').files[0];
    let reader = new FileReader();
    let numbersStr = document
        .getElementById('numbers').value
        .split(' ');

    let numbers = [];
    numbersStr.forEach(number =>
        numbers.push(parseInt(number))
    );
    reader.onload = function () {
        WebAssembly
            .instantiate(this.result, {})
            .then(obj => {
                    const array = new Int32Array(obj.instance.exports.memory.buffer, 0, numbers.length);
                    array.set(numbers);
                    const result = obj.instance.exports.fun(array.byteOffset, array.length);
                    alert(result);
                }
            );
    };
    reader.readAsArrayBuffer(file);
}

function enableButtonSendFilesToRemotes() {
    let file = document.getElementById('inputFile').files[0];
    let numbersStr = document
        .getElementById('numbers').value
        .split(' ');
    if (file && numbersStr.length > 0) {
        document.getElementById('sendFilesToRemoteButton').disabled = false;
    } else {
        document.getElementById('sendFilesToRemoteButton').disabled = true;
    }
}

function sendData() {
    document.getElementById('runWasmButton').disabled = false;
    let file = document.getElementById('inputFile').files[0];
    sendWasmFile(file);
    sendArray();
}

function sendWasmFile(file) {
    if (file) {
        let reader = new FileReader();
        reader.onload = function () {
            let obj = {
                'body': btoa(this.result),
                'type': 'file'
            };
            dataChannel.send(JSON.stringify(obj));
        };
        reader.readAsBinaryString(file);
    }
}

function sendArray() {
    let numbersStr = document
        .getElementById('numbers').value
        .split(' ');
    // how to find out how many connections?
    let n = 1;
    let partLength = findOutLengthOfPart(numbersStr.length, n);
    for (let from = 0; from < numbersStr.length;) {
        let to = from + partLength;
        sendPartOfData(numbersStr, from, to);
        from = to;
    }
}

function findOutLengthOfPart(numbersStrLength, n) {
    return numbersStrLength / n;
}

// to не включительно
function sendPartOfData(numbersStr, from, to) {
    console.log('try to array');
    let numbers = [];
    for (let i = from; i < to; i = i + 1) {
        numbers.push(parseInt(numbersStr[i]));
    }

    let obj = {
        'body': numbers,
        'type': 'array'
    };
    dataChannel.send(JSON.stringify(obj));
}
