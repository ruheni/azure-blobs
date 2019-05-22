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

/**
 * TODO: upload audio to containers
 */

const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".soundClips");
let text = document.getElementById("text-here");

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

function uploadBlob(container, files) {
  blobService.createBlockFromBrowserFile(
    container[i],
    filesForUpload[i].name,
    filesForUpload[i],
    (err, result) => {
      if (err) {
        console.log("The following error occured, ", err);
      } else {
        console.log(`Upload of ${filesForUpload[i].name}`);
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

    // converting to file
    let filesForUpload = [];
    mediaRecorder.onstop = () => {
      let num = Math.random() * Date.now();
      num = Math.trunc(num);

      const clipName = num;

      const file = new File(chunks, clipName, {
        type: "audio/ogg, codecs=opus"
      });

      chunks = [];
      filesForUpload.push(file);
      console.log(filesForUpload);

      plusSlides(1);
    };
  });
} else {
  alert("Sorry, getUserMedia not supported on your browser...");
}