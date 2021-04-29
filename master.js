const workerUrl = 'https://webrtc.ms-elena-dolgova.workers.dev';

// тут хранить информацию о всех
let datachannelArray = [];
let peerConnection;
let sumFromPeers = [];

function clickCreateMasterId() {
    console.log('clickCreateMasterId');
    document.getElementById('text_masterId').value = '';
    peerConnection = createPeerConnection(createMasterId);
    let dataChannel = peerConnection.createDataChannel(document.getElementById('text_masterId').value);
    dataChannel.onmessage = processMessageFromPeer;
    let createOfferPromise = peerConnection.createOffer();
    createOfferPromise.then(function (offer) {
        peerConnection.setLocalDescription(offer).then(function () {
            console.log('createOffer done');
        }, function (reason) {
            console.log('createOffer Failed');
            console.log(reason);
        });
    }, function (reason) {
        console.log('createOfferFailed');
        console.log(reason);
    });
    datachannelArray.push(dataChannel);
}

async function createMasterId(peerConnection) {
    console.log('createMasterId');
    let masterIdRequest = peerConnection.localDescription;
    let masterId = await createId(masterIdRequest);
    document.getElementById('text_masterId').value = masterId;
    return masterId;
}

function clickPeerPasted() {
    console.log('clickPeerPasted');
    getById(document.getElementById('text_peerId').value,
        function () {
            console.log('clickPeerPasted done');
        },
        peerConnection
    );
}

function processMessageFromPeer(message) {
    console.log('processMessageFromPeer');
    console.log(message);
    sumFromPeers.push(parseInt(message.data));
    if (sumFromPeers.length === datachannelArray.length) {
        runWasmFile(sumFromPeers);
    }
}

function inputNumbers() {
    sumFromPeers = [];
}


