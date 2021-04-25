const workerUrl = 'https://webrtc.ms-elena-dolgova.workers.dev';

function clickcreateoffer() {
    console.log('clickcreateoffer');
    document.getElementById('buttoncreateoffer').disabled = true;
    document.getElementById('spanoffer').classList.toggle('invisible');
    peerConnection = createPeerConnection(lasticecandidate);
    dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = datachannelopen;
    dataChannel.onmessage = datachannelmessage;
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
    textelement = document.getElementById('textoffer');
    offer = peerConnection.localDescription;
    fetch(workerUrl + '/makeOffer', {
        method: 'post',
        body: JSON.stringify(offer)
    })
        .then(data => data.json())
        .then(data => {
            textelement.value = data.id;
        });
    document.getElementById('buttonoffersent').disabled = false;
}

// function lasticecandidate() {
//   console.log('lasticecandidate');
//   textelement = document.getElementById('textoffer');
//   offer = peerConnection.localDescription;
//   textelement.value = JSON.stringify(offer);
//   document.getElementById('buttonoffersent').disabled = false;
// }

function clickoffersent() {
    console.log('clickoffersent');
    document.getElementById('spananswer').classList.toggle('invisible');
    document.getElementById('buttonoffersent').disabled = true;
}

function clickanswerpasted() {
    console.log('clickanswerpasted');
    document.getElementById('buttonanswerpasted').disabled = true;
    textelement = document.getElementById('textanswer');
    textelement.readOnly = true;
    fetch(workerUrl + '/getAnswer', {
        method: 'post',
        body: JSON.stringify({
            id: textelement.value
        })
    })
        .then((data) => data.json())
        .then((data) => {
            setRemotePromise = peerConnection.setRemoteDescription(data);
            setRemotePromise.then(setRemoteDone, setRemoteFailed);
        });
}

// function clickanswerpasted() {
//   console.log('clickanswerpasted');
//   document.getElementById('sendingFiles').classList.toggle('invisible');
//   // document.getElementById('buttonanswerpasted').disabled = true;
//   textelement = document.getElementById('textanswer');
//   textelement.readOnly = true;
//   answer = JSON.parse(textelement.value);
//   setRemotePromise = peerConnection.setRemoteDescription(answer);
//   setRemotePromise.then(setRemoteDone, setRemoteFailed);
// }

function setRemoteDone() {
    console.log('setRemoteDone');
}

function setRemoteFailed(reason) {
    console.log('setRemoteFailed');
    console.log(reason);
}

