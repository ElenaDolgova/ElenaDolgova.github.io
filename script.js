function runWasmFile(numbers) {
    let file = document.getElementById('inputFile').files[0];
    let reader = new FileReader();
    reader.onload = function () {
        WebAssembly
            .instantiate(this.result, {})
            .then(obj => {
                    const array = new Int32Array(obj.instance.exports.memory.buffer, 0, numbers.length);
                    array.set(numbers);
                    document.getElementById('answerMaster').innerText =
                        obj.instance.exports.fun(array.byteOffset, array.length);
                }
            );
    };
    reader.readAsArrayBuffer(file);
}

function sendData() {
    let file = document.getElementById('inputFile').files[0];
    let numbersStr = document
        .getElementById('numbers').value
        .split(' ');

    let partLength = findOutLengthOfPart(numbersStr.length, datachannelArray.length);
    let from = 0;
    let to = 0;
    datachannelArray.forEach((dataChannel, index, array) => {
        sendWasmFile(file, dataChannel);
        from = to;
        if (to >= array.length) {
            to = array.length + 1;
        }
        to = from + partLength;
        sendPartOfData(numbersStr, from, to, dataChannel);
    });
}

function findOutLengthOfPart(numbersStrLength, n) {
    return Math.ceil(numbersStrLength / n);
}

function sendWasmFile(file, dataChannel) {
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

// to не включительно
function sendPartOfData(numbersStr, from, to, dataChannel) {
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
