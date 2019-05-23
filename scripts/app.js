const account = {
  name: "blobstorageaudio",
  sas:
    "se=2020-01-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=DKfXT/OTDnFTQdb6EZJ6uNJWUR8OF0ReBh77ymWx/pY%3D"
};

const blobUri = `https://${account.name}.blob.core.windows.net`;
const blobService = AzureStorage.Blob.createBlobServiceWithSas(
  blobUri,
  account.sas
);

const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
// const soundClips = document.querySelector(".soundClips");
let text = document.getElementById("text-here");

// list of container names in Blob storage account
const containers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten"
];

// empty array to store recorded files
let files = [];

let upload = () => {
  const options = {};
  blobContainers.forEach(blobContainer => {
    files.forEach(file => {
      if (blobContainers.indexOf(blobContainer) === files.indexOf(file)) {
        options = { blobContainer, file };
        uploadBlob(options);
        options = {};
        console.log({ blobContainer, file });
      }
    });
  });
};

function uploadBlob(options) {
  blobService.createBlockBlobFromBrowserFile(
    options.blobContainer,
    options.file.name,
    options.file,
    (err, result) => {
      if (err) {
        console.log(`The following error occured ${err}`);
      } else {
        console.log(
          `Upload of ${options.file.name} to container ${
            options.blobContainer
          } successful.`
        );
      }
    }
  );
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    // create new instance of MediaRecorder()
    const mediaRecorder = new MediaRecorder(stream);

    record.onclick = () => {
      mediaRecorder.start();
      console.log(`${mediaRecorder.state}, recorder started`);
      record.style.color = "red";
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
      record.style.color = "";
    };

    /**
     * ? naming file => Math.trunc(Date.now() * Math.random())
     * ?converting to file
     *
     */

    mediaRecorder.onstop = () => {
      let num = Math.trunc(Math.random() * Date.now());

      const clipName = num;

      const file = new File(chunks, clipName, {
        type: "audio/ogg, codecs=opus"
      });

      chunks = [];
      files.push(file);
      console.log(filesForUpload);

      plusSlides(1);
      if (files.length === 10) {
        upload();
      }
    };
  });
} else {
  alert("Sorry, getUserMedia not supported on your browser...");
}
