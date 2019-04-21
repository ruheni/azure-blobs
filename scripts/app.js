/* eslint-disable no-undef */
/* eslint-disable no-console */
const account = {
    name: 'quinn',
    sas: 'se=2019-06-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=TzbhTXyTEQRmkcDN6zoHWgoVYRBDqdEaX2rmV0iTINA%3D',
};

const blobUri = `https://${account.name}.blob.core.windows.net`;
const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

// Create a container on azure
document.getElementById('create-button').addEventListener('click', () => {
    blobService.createContainerIfNotExists('container', (err, container) => {
        if (err) {
            console.log('The following error occured when creating container: ', err);
        } else {
            console.log(container.name);
        }
    });
});

// Upload a blob file
document.getElementById('upload-button').addEventListener('click', () => {
    const file = document.getElementById('fileinput').files[0];

    blobService.createBlockBlobFromBrowserFile('container', file.name, file, (err, result) => {
        if (err) {
            console.log('The following error occured while uploading blob: ', err);
        } else {
            console.log('Upload is successful');
        }
    });
});

// List Blobs
document.getElementById('list-button').addEventListener('click', () => {
    // const blobs = document.getElementById('blobs');
    blobService.listBlobsSegmented('container', null, (err, results) => {
        if (err) {
            console.log('The following error occured while fetching blob: ', err);
        } else {
            results.entries.forEach(blob => {
                console.log(blob.name);
                // let blobEl = document.createElement('li');
                // blobEl = blob.name;
                // blobs.append(blobEl);
            });
        }
    });
});

// Delebe Blobs
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
