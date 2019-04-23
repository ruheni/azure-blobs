/* eslint-disable no-undef */
/* eslint-disable no-console */

const account = {
    name: 'quinn',
    sas: 'se=2019-06-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=TzbhTXyTEQRmkcDN6zoHWgoVYRBDqdEaX2rmV0iTINA%3D',
};

const blobUri = `https://${account.name}.blob.core.windows.net`;
const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

// Create a container on azure
const createContainer = () => {
    document.getElementById('create-button').addEventListener('click', () => {
        blobService.createContainerIfNotExists('container', (err, container) => {
            if (err) {
                console.log('The following error occured when creating container: ', err);
            } else {
                console.log(container.name);
                alert(`${container.name} exists already.`);
            }
        });
    });
};
createContainer();

// Upload a blob file
const uploadBlob = () => {
    document.getElementById('upload-button').addEventListener('click', () => {
        const file = document.getElementById('fileinput').files[0];

        blobService.createBlockBlobFromBrowserFile('container', file.name, file, (err, result) => {
            if (err) {
                console.log('The following error occured while uploading blob: ', err);
            } else {
                console.log('Upload is successful');
                alert('Upload successful.');
            }
        });
    });
};

// List Blobs
// eslint-disable-next-line no-unused-vars
const listBlobs = () => {
    document.getElementById('list-button').addEventListener('click', () => {
        // const blobs = document.getElementById('blobs');
        blobService.listBlobsSegmented('container', null, (err, results) => {
            if (err) {
                console.log('The following error occured while fetching blob: ', err);
            } else {
                results.entries.forEach(blob => {
                    console.log(blob.name);
                });
            }
        });
    });
};

// Delebe Blobs
// eslint-disable-next-line no-unused-vars
const deleteBlob = () => {
    document.getElementById('delete-button').addEventListener('click', () => {
        let blobName;
        blobService.deleteBlobIfExists('container', blobName, (err, result) => {
            if (err) {
                console.log('The following error occured while deleting blob: ', err);
            } else {
                console.log('Blob deleted successfully');
            }
        });
    });
};

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');

// eslint-disable-next-line no-unused-vars
const createEl = () => {
    createContainer();
    const clipName = prompt('Enter name for your audio clip');

    const clipContainer = document.createElement('article');
    const clipLabel = document.createElement('p');
    const audio = document.createElement('audio');
    const deleteButton = document.createElement('button');
    const uploadButton = document.createElement('button');

    clipContainer.classList.add('clip');
    audio.setAttribute('controls', '');
    uploadButton.textContent = 'Upload';
    deleteButton.innerHTML = 'Delete';
    clipLabel.innerHTML = clipName;

    // clipContainer.setAttribute('class', 'row');
    uploadButton.setAttribute('id', 'upload-button');
    uploadButton.setAttribute('class', 'btn blue darken-1 right-align button');
    deleteButton.setAttribute('class', 'btn blue darken-1 right-align button');

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(uploadButton);
    clipContainer.appendChild(deleteButton);
    soundClips.appendChild(clipContainer);
};

/**
 * Basic getUserMedia setup
 */
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported');
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(
            stream => {
                // create new instance of MediaRecorder() and pass stream to be captured
                const mediaRecorder = new MediaRecorder(stream);

                // start recording the stream once record button is pressed
                record.onclick = () => {
                    mediaRecorder.start();
                    console.log(mediaRecorder.state);
                    console.log('recorder started');
                    // record.style.background = 'red';
                    record.style.color = 'red';
                };

                /**
                 * collect audio data as recording progresses with
                 * on mediaRecorder.ondataavailable event
                 */
                let chunks = [];
                mediaRecorder.ondataavailable = e => chunks.push(e.data);

                // finalize Blob ready for use in app
                stop.onclick = () => {
                    mediaRecorder.stop();
                    console.log(mediaRecorder.state);
                    console.log('recorder stopped');
                    record.style.background = '';
                    record.style.color = '';
                };

                // grabbing and using the blob
                mediaRecorder.onstop = e => {
                    console.log('recorder stopped');

                    const clipName = prompt('Enter name for your audio clip');

                    const clipContainer = document.createElement('article');
                    const clipLabel = document.createElement('p');
                    const audio = document.createElement('audio');
                    const deleteButton = document.createElement('button');
                    const uploadButton = document.createElement('button');

                    clipContainer.classList.add('clip');
                    audio.setAttribute('controls', '');
                    uploadButton.textContent = 'Upload';
                    deleteButton.innerHTML = 'Delete';
                    clipLabel.innerHTML = clipName;

                    // clipContainer.setAttribute('class', 'row');
                    uploadButton.setAttribute('id', 'upload-button');
                    uploadButton.setAttribute('class', 'btn blue darken-1 right-align button');
                    deleteButton.setAttribute('class', 'btn blue darken-1 right-align button');

                    clipContainer.appendChild(audio);
                    clipContainer.appendChild(clipLabel);
                    clipContainer.appendChild(uploadButton);
                    clipContainer.appendChild(deleteButton);
                    soundClips.appendChild(clipContainer);

                    const blob = new Blob(chunks, {
                        type: 'audio/ogg; codecs=opus',
                    });
                    chunks = [];
                    const audioURl = URL.createObjectURL(blob);
                    audio.src = audioURl;

                    // eslint-disable-next-line no-shadow
                    deleteButton.onclick = e => {
                        const eventTarget = e.target;
                        eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
                    };

                    // listen for file selection
                    uploadButton.onclick = () => {
                        uploadBlob();
                    };
                };
            },
            // Error callback
            err => console.log(`The following getUserMedia error occured: ${err}`)
        )
        .catch(err => console.log(`The following getUserMedia error occured: ${err}`));
} else {
    console.log('Sorry, getUserMedia not supported on your browser!');
    alert('Sorry, getUserMedia not supported on your browser!');
}
