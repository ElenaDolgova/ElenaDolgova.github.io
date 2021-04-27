const workerUrl = 'https://webrtc.ms-elena-dolgova.workers.dev';

function clickMasterIdPasted() {
    console.log('clickMasterIdPasted');
    document.getElementById('clickMasterIdPastedButton').disabled = true;
    peerConnection = createPeerConnection(createPeerId);
    peerConnection.ondatachannel = sendAnswerFromFunction;
    offerPastedBlock = document.getElementById('masterId_pasted');
    offerPastedBlock.readOnly = true;
    offerId = offerPastedBlock.value;
    fetch(workerUrl + '/getOffer', {
        method: 'post',
        body: JSON.stringify({
            id: offerId
        })
    })
        .then((data) => data.json())
        .then((data) => {
            setRemotePromise = peerConnection.setRemoteDescription(data);
            setRemotePromise.then(
                setMasterConnection,
                function (reason) {
                    console.log('clickOfferPasted failed');
                    console.log(reason);
                });
        });
}

function createPeerId() {
    console.log('createPeerId');
    textelement = document.getElementById('peerIdText');
    answer = peerConnection.localDescription;
    fetch(workerUrl + '/makeAnswer', {
        method: 'post',
        body: JSON.stringify(answer)
    })
        .then(data => data.json())
        .then(data => {
            textelement.value = data.id;
        });
}

function sendAnswerFromFunction(event) {
    console.log('sendAnswerFromFunction');
    dataChannel = event.channel;
    // dataChannel.onopen = dataChannelOpen;
    dataChannel.onmessage = sendFileAndPartArray; // тут ответ от работы функции о сумме
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
    document.getElementById('span_peer').classList.toggle('invisible');
}