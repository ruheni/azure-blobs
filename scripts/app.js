/* eslint-disable no-undef */
/* eslint-disable no-console */
const account = {
    name: 'quinn',
    sas: 'se=2019-06-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=TzbhTXyTEQRmkcDN6zoHWgoVYRBDqdEaX2rmV0iTINA%3D',
};

const blobUri = `https://${account.name}.blob.core.windows.net`;
const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

// Create container on Azure.
// eslint-disable-next-line no-unused-vars
const createContainer = () => {
    document.getElementById('create-button').addEventListener('click', () => {
        blobService.createContainerIfNotExists('container', (err, container) => {
            if (err) {
                console.log('The following error occured when creating container: ', err);
            } else {
                console.log(`${container.name} already exists`);
                alert(`${container.name} already exists`);
            }
        });
    });
};

// List blob files in container on Azure
// eslint-disable-next-line no-unused-vars
const listBlob = () => {
    document.getElementById('list-button').addEventListener('click', () => {
        // eslint-disable-next-line no-unused-vars
        const blobs = document.getElementById('blobs');
        blobService.listBlobSegmented('container', null, (err, results) => {
            if (err) {
                console.log('The following error occured while fetching blob: ', err);
            } else {
                results.entries.forEach(blob => {
                    /**
                     * TODO: add blobs to web page, .blob section
                     */
                    console.log(blob.name);
                });
            }
        });
    });
};

// Delete Blob file on Azure
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

// Record audio from browser
const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
        stream => {
            // create new instance of MediaRecorder() and pass stream as param to be captured
            const mediaRecorder = new MediaRecorder(stream);

            record.onclick = () => {
                mediaRecorder.start();
                console.log(`${mediaRecorder.state}, recorder started`);
                record.style.color = 'red';
            };

            /**
             * collect audio as recording progresses with
             * on mediaRecorder.ondataavailable event
             */
            let chunks = [];
            mediaRecorder.ondataavailable = e => chunks.push(e.data);

            // finalize blob for use
            stop.onclick = () => {
                mediaRecorder.stop();
                console.log(`${mediaRecorder.state}, recorder stopped`);
                record.style.color = '';
            };

            // grabbing and using blob
            mediaRecorder.onstop = () => {
                const clipName = prompt('Enter the name of your audio clip: ');

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
                    type: 'audio/ogg, codecs=opus',
                });
                // eslint-disable-next-line no-const-assign
                chunks = [];
                const audioURL = URL.createObjectURL(blob);
                audio.src = audioURL;

                // delete audio element from web page
                deleteButton.onclick = e => {
                    const eventTarget = e.target;
                    eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
                };

                // upload blob to Azure
                uploadButton.onclick = () => {
                    // Accessing metadata for use in the createBlockFromStream()
                    console.log(audio);
                    console.log(blob);
                    console.log(audio.src);

                /**
                 * createBlockBlobFromStream(container, blob, (Stream), streamLength [, options], callback)
                 * Uploads a block blob from a stream. If the blob already exists on the service, it will be overwritten.
                 * To avoid overwriting and instead throw an error if the blob exists,
                 * please pass in an accessConditions parameter in the options object
                 */
                    blobService.createBlockBlobFromStream(
                        'container',
                        clipName,
                        audio.src,
                        audio.duration,
                        (err, result) => {
                            if (err) {
                                console.log('The following error occured when uploading file: ', err);
                            } else {
                                console.log(`Upload of ${clipName} successful.`);
                            }
                        }
                    );
                };
            };
        },
        // error callback when recording audio
        err => console.log(`The following getUserMedia error occured: ${err}`)
    );
} else {
    console.log('Sorry, getUserMedia not supported on your browser!');
    alert('Sorry, getUserMedia not supported on your browser...');
}

/**
 * blockId - string -> the block identifier
 * container - string -> the container name
 * blob - string -> the blob name
 * sourceURL - string - the URL of the source data
 *      It can point to any Azure Blob of file, that is either public or has SAS attached
 * sourceRangeStart - int -> the start of the range bytes(inclusive) that has to be taken from the copy source.
 * sourceRangeEnd - int -> The end of the range of bytes(inclusive) that has to be taken from the copy source.
 * callback - errorOrResponse -> error will contain information if an error occurs
 *                             -> response will contain information related to this operation 
 * ! Work in Progress -- uploadFromURL
 */
const uploadFromURL = () => {
    createBlockFromURL(blockId, container, sourceURL, sourceRangeStart, sourceRangeEnd, callback);
}