const workerUrl = 'https://webrtc.ms-elena-dolgova.workers.dev';

function clickCreateMasterId() {
    console.log('clickCreateOffer');
    document.getElementById('button_create_masterId').disabled = true;
    document.getElementById('spanoffer').classList.toggle('invisible');
    peerConnection = createPeerConnection(lasticecandidate);
    dataChannel = peerConnection.createDataChannel('dataChannel');
    // dataChannel.onopen = dataChannelOpen; // тут
    dataChannel.onmessage = sendFileAndPartArray; //тут
    createOfferPromise = peerConnection.createOffer();
    createOfferPromise.then(createOfferDone, createOfferFailed);
}

function createOfferDone(offer) {
    console.log('createOfferDone');
    setLocalPromise = peerConnection.setLocalDescription(offer);
    setLocalPromise.then(setLocalDone, setLocalFailed);
}

function createOfferFailed(reason) {
    console.log('createOfferFailed');
    console.log(reason);
}

function setLocalDone() {
    console.log('setLocalDone');
}

function setLocalFailed(reason) {
    console.log('setLocalFailed');
    console.log(reason);
}

function lasticecandidate() {
    console.log('lasticecandidate');
    textMasterId = document.getElementById('text_masterId');
    masterId = peerConnection.localDescription;
    fetch(workerUrl + '/makeOffer', {
        method: 'post',
        body: JSON.stringify(masterId)
    })
        .then(data => data.json())
        .then(data => {
            textMasterId.value = data.id;
        });
    document.getElementById('masterId_sent_to_peer').disabled = false;
}

function masterIdSentToPeer() {
    console.log('masterIdSentToPeer');
    document.getElementById('span_master').classList.toggle('invisible');
    document.getElementById('masterId_sent_to_peer').disabled = true;
}

function clickPeerPasted() {
    console.log('clickPeerPasted');
    document.getElementById('sendingFiles').classList.toggle('invisible');
    document.getElementById('clickPeerPastedButton').disabled = true;
    peerIdValue = document.getElementById('text_peerId');
    peerIdValue.readOnly = true;
    fetch(workerUrl + '/getAnswer', {
        method: 'post',
        body: JSON.stringify({
            id: peerIdValue.value
        })
    })
        .then((data) => data.json())
        .then((data) => {
            setRemotePromise = peerConnection.setRemoteDescription(data);
            setRemotePromise.then(function () {
                console.log('clickPeerPasted done');
            }, function (reason) {
                console.log('clickPeerPasted failed');
                console.log(reason);
            });
        });
    // todo добавить отображение peerId
}
