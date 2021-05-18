let file = null;

function createPeerConnection(candidateFunction) {
    let configuration = {
        iceServers: [{
            urls: 'stun:stun.stunprotocol.org'
        }]
    };
    let peerConnection;
    try {
        peerConnection = new RTCPeerConnection(configuration);
    } catch (err) {
        console.log('createPeerConnection failed');
    }
    peerConnection.onicecandidate = function (event) {
        if (event.candidate != null) {
            console.log('new ICE candidate');
        } else {
            console.log('all ICE candidates');
            candidateFunction(peerConnection);
        }
    };
    peerConnection.onconnectionstatechange = function (event) {
        console.log('peerConnection.onconnectionstatechange');
        console.log(event);
    };
    peerConnection.oniceconnectionstatechange = function (event) {
        console.log('ice connection state: ' + event.target.iceConnectionState);
    };
    return peerConnection;
}

async function createId(request) {
    return fetch(workerUrl + '/createId', {
        method: 'post',
        body: JSON.stringify(request)
    })
        .then(data => data.json())
        .then(data => {
            return data.id;
        });
}

function getById(id, connectionFunction, peerConnection) {
    fetch(workerUrl + '/getById', {
        method: 'post',
        body: JSON.stringify({
            id: id
        })
    })
        .then(data => data.json())
        .then(data => {
            let setRemotePromise = peerConnection.setRemoteDescription(data);
            setRemotePromise.then(
                connectionFunction,
                function (reason) {
                    console.log('peerConnection.setRemoteDescription failed');
                    console.log(reason);
                });
        });
}
