let file = null;
let arrayDownloaded = null;

function createPeerConnection(lasticecandidate) {
    configuration = {
        iceServers: [{
            urls: 'stun:stun.stunprotocol.org'
        }]
    };
    try {
        peerConnection = new RTCPeerConnection(configuration);
    } catch (err) {
        chatlog('error: ' + err);
    }
    peerConnection.onicecandidate = handleicecandidate(lasticecandidate);
    peerConnection.onconnectionstatechange = handleconnectionstatechange;
    peerConnection.oniceconnectionstatechange = handleiceconnectionstatechange;
    return peerConnection;
}

function handleicecandidate(lasticecandidate) {
    return function (event) {
        if (event.candidate != null) {
            console.log('new ice candidate');
        } else {
            console.log('all ice candidates');
            lasticecandidate();
        }
    };
}

function handleconnectionstatechange(event) {
    console.log('handleconnectionstatechange');
    console.log(event);
}

function handleiceconnectionstatechange(event) {
    console.log('ice connection state: ' + event.target.iceConnectionState);
}

function dataChannelOpen() {
    // console.log('dataChannelOpen');
    // chatlog('connected');
    // document.getElementById('chat_input').disabled = false;
    // document.getElementById('chat_button').disabled = false;
}

function sendFileAndPartArray(message) {
    console.log('sendFileAndPartArray');
    data = message.data;
    console.log(message);
    let jsonData = JSON.parse(data);
    if (jsonData.type === 'array') {
        console.log('I am array');
        arrayDownloaded = new Int32Array(jsonData.body);
        chatlog(arrayDownloaded);
        console.log(arrayDownloaded);
    } else if (jsonData.type === 'file') {
        //let blob = new Blob([jsonData.body]);
        WebAssembly
            .instantiate(Uint8Array.from(atob(jsonData.body), c => c.charCodeAt(0)), {})
            .then(obj => {
                    console.log('inside');
                    const array = new Int32Array(obj.instance.exports.memory.buffer, 0, arrayDownloaded.length);
                    array.set(arrayDownloaded);
                    const result = obj.instance.exports.fun(array.byteOffset, array.length);
                    alert(result);
                }
            );
        // } else {
        /*let blob = new Blob([jsonData.body]);
        console.log(blob);
        let reader = new FileReader();
        reader.onload = function (event) {
            console.log(event.target.result);
            WebAssembly
                .instantiate(event.target.result, {})
                .then(obj => {
                        console.log('inside');
                        const array = new Int32Array(obj.instance.exports.memory.buffer, 0, arrayDownloaded.length);
                        array.set(arrayDownloaded);
                        const result = obj.instance.exports.fun(array.byteOffset, array.length);
                        alert(result);
                    }
                );
        };
        reader.readAsArrayBuffer(blob);*/
        // const a = document.createElement('a');
        // const url = window.URL.createObjectURL(blob);
        // a.href = url;
        // a.download = dataChannel.label;
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();
    }
}

// function chatbuttonclick() {
//     console.log('chatbuttonclick');
//     textelement = document.getElementById('chat_input');
//     text = textelement.value;
//     dataChannel.send(text);
//     // chatlog(text);
//     textelement.value = '';
// }
