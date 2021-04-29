const workerUrl = 'https://webrtc.ms-elena-dolgova.workers.dev';
let arrayDownloaded = null;
let dataChannel;
let peerConnection;

function clickMasterIdPasted() {
    console.log('clickMasterIdPasted');
    peerConnection = createPeerConnection(createPeerId);
    peerConnection.ondatachannel = calculateAndSendAnswerFromFunction;
    getById(document.getElementById('masterId_pasted').value, setMasterConnection, peerConnection);
}

async function createPeerId() {
    console.log('createPeerId');
    let request = peerConnection.localDescription;
    document.getElementById('text_peerId').value = await createId(request);
}

function calculateAndSendAnswerFromFunction(event) {
    console.log('calculateAndSendAnswerFromFunction');
    dataChannel = event.channel;
    dataChannel.onmessage = processMessage; // тут ответ от работы функции о сумме
}

function setMasterConnection() {
    console.log('setMasterConnection');
    peerConnection.createAnswer()
        .then(
            createMasterConnection,
            function (reason) {
                console.log('setMasterConnection failed');
                console.log(reason);
            });
}

function createMasterConnection(answer) {
    console.log('createMasterConnection');
    peerConnection.setLocalDescription(answer)
        .then(function () {
            console.log('createMasterConnection done');
        }, function (reason) {
            console.log('createMasterConnection failed');
            console.log(reason);
        });
}

function processMessage(message) {
    console.log('processMessage');
    let data = message.data;
    console.log(message);
    let jsonData = JSON.parse(data);
    if (jsonData.type === 'array') {
        console.log('I am array');
        arrayDownloaded = new Int32Array(jsonData.body);
        console.log(arrayDownloaded);
    } else if (jsonData.type === 'file') {
        WebAssembly
            .instantiate(Uint8Array.from(atob(jsonData.body), c => c.charCodeAt(0)), {})
            .then(obj => {
                    console.log('inside');
                    const array = new Int32Array(obj.instance.exports.memory.buffer, 0, arrayDownloaded.length);
                    array.set(arrayDownloaded);
                    let result = obj.instance.exports.fun(array.byteOffset, array.length);
                    console.log(result);
                    // alert(result);
                    dataChannel.send(result);
                }
            );
    }
}