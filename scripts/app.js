/* eslint-disable no-undef */
/* eslint-disable no-console */
const account = {
    name: quinn,
    sas: 'se=2019-06-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=TzbhTXyTEQRmkcDN6zoHWgoVYRBDqdEaX2rmV0iTINA%3D',
};

const blobUri = `https://${account.name}.blob.core.windows.net`;
const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

document.getElementById('create-button').addEventListener('click', () => {
    blobService.createContainerInfNotExists('', (err, container) => {
        if (err) {
            console.log('The following error occured: ', err);
        } else {
            console.log(container.name);
        }
    });
});
