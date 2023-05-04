var canvas = document.getElementById('napkin')
let ctx = canvas.getContext('2d');

let textMode = false;
let mousePos;
var previouslyToggled;
var timesClicked = 0;
let textButton = document.getElementById('text');
var drawMode = document.getElementById("type1");
var writeMode = document.getElementById("type2");
const modeHTML = document.getElementById("mode");

var signaturePad = new SignaturePad(canvas, {
    minWidth: 3,
    maxWidth: 8
});

//UNDO HOTKEY
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === 'z') {
        var data = signaturePad.toData();
        if (data) {
            data.pop();
            if (data.isEmpty()) {
                fillBackground();
            }
            signaturePad.fromData(data);
        }
    }
});

//CLEAR BUTTON
document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
    fillBackground();
});


function erase() {
    signaturePad.on();
    ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
}

//CHANGE COLOR
function colorChanged() {
    ctx.globalCompositeOperation = 'source-over';
    const inputVal = document.getElementById("color-picker").value;
    signaturePad.penColor = inputVal;
    signaturePad.on();
}

//CHANGE MODE
function mode(num) {
    if (num == 1) {
        modeHTML.innerHTML = "Draw Mode";
    }
    else if (num == 2) {
        timesClicked++;
        if (timesClicked % 2 == 0) {
            textButton.click();
        }
        modeHTML.innerHTML = "Write Mode";
    }
    else if (num == 3) {
        modeHTML.innerHTML = "Erase Mode";
    }
}

function switchToTextMode() {
    ctx = canvas.getContext('2d');
    const inputVal = document.getElementById("color-picker").value;
    signaturePad.penColor = inputVal;
    ctx.fillStyle = signaturePad.penColor;
    ctx.globalCompositeOperation = 'source-over';
    textMode = !textMode;
    console.log(textMode);
    if (textMode) {
        console.log("turning off signature pad");
        signaturePad.off();
    } else {
        console.log("turning on signature pad");
        signaturePad.on();
    }
}

function downloadNapkin() {
    var name = document.getElementById('napkin-name').value;
    var id = signaturePad.toDataURL();

    downloadURI(id, name);
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

//solution courtesy of: https://ourcodeworld.com/articles/read/682/what-does-the-not-allowed-to-navigate-top-frame-to-data-url-javascript-exception-means-in-google-chrome
function openNapkinTab(url) {
    var win = window.open();
    win.document.write('<iframe src="' + url  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function detect(e) {
    mousePos = getMousePos(canvas, e);
}

function click(e) {
    if ((mousePos['x'] < 0 || mousePos['x'] > 500) || (mousePos['y'] < 0 || mousePos['y'] > 500)) {
        return;
    }

    console.log("Clicked at " + mousePos['x'] + ", " + mousePos['y']);
    var fontsize = document.getElementById('text-size').value;
    ctx.font = 'bold '+fontsize+'px Arial';
    let text = prompt("Enter in your text", "Hello!");
    if (text === "null") {
        text = "";
    }
    ctx.fillText(text, mousePos['x'], mousePos['y']);
}

window.addEventListener('mousemove', detect, false);
window.addEventListener('mousedown', click, false);

const record = document.getElementById('record');
const stop = document.getElementById('stop');

let mediaRecorder;
let audioRecorder;
let recordedChunks = [];

var uploadVideoButton
var downloadVideoButton
var video

function blobToDataURL(blob, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {callback(e.target.result);}
    fileReader.readAsDataURL(blob);
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(audioStream) {
        
        const canvasStream = canvas.captureStream();
        canvasStream.addTrack(audioStream.getAudioTracks()[0]);
        mediaRecorder = new MediaRecorder(canvasStream);

        document.getElementById('record').hidden = true;
        document.getElementById('video').hidden = true;
        
        mediaRecorder.addEventListener('dataavailable', (event) => {
            recordedChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
            var video = document.getElementById('video');
            const recordedBlob = new Blob(recordedChunks, { 
                type: 'video/webm' 
            });
            const recordedUrl = URL.createObjectURL(recordedBlob);
            video.src = recordedUrl;
        });

        var stopButton = document.createElement("button");
        stopButton.innerHTML = '<i class = "fa fa-stop"></i>';
        stopButton.style.backgroundColor = "transparent";
        stopButton.style.width = "50px";
        stopButton.style.height = "50px";
        stopButton.style.fontSize = "26px";
        stopButton.style.borderRadius = "50px";
        stopButton.style.border = "transparent";
        stopButton.style.cursor = "pointer";
        document.getElementById("tools").appendChild(stopButton);

        stopButton.addEventListener('click', () => {
            document.getElementById('record').hidden = false;
            document.getElementById('video').hidden = false;

            mediaRecorder.stop();
            document.getElementById("tools").removeChild(stopButton);
            delete stopButton;

            if (downloadVideoButton == null) {
                downloadVideoButton = document.createElement("button");
            }
            downloadVideoButton.id = 'download-video'
            downloadVideoButton.innerHTML = '<i class = "fa fa-download"></i><br>Download<br>Video';
            document.getElementById("download-buttons").appendChild(downloadVideoButton);
            downloadVideoButton.addEventListener('click', () => {
                const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
                blobToDataURL(recordedBlob, function(dataurl) {
                    var name = document.getElementById('napkin-name').value;
                    downloadURI(dataurl, name);            
                })
            });

            console.log(document.getElementById("authenticated"));
            if (uploadVideoButton == null && document.getElementById("authenticated") != null) {
                uploadVideoButton = document.createElement('button');
                uploadVideoButton.id = 'upload-video'
                uploadVideoButton.innerHTML = '<i class = "fa fa-upload"></i><br>Upload<br>Video';
                document.getElementById('download-buttons').appendChild(uploadVideoButton);
                uploadVideoButton.addEventListener('click', () => {
                    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

                    blobToDataURL(recordedBlob, function(dataurl){
                        document.getElementById('videoURL').value = dataurl
                        document.getElementById('videoname').value = document.getElementById('napkin-name').value;
                        submitForm("/upload/video/", 'video_submission', onVideoUploadSuccessful);
                    });
                });
            }
        });

        mediaRecorder.start();
        recordedChunks = [];
    });
}

function uploadImage() {
    document.getElementById('imagename').value = document.getElementById('napkin-name').value;
    document.getElementById('imageURL').value = signaturePad.toDataURL();
    submitForm('/upload/image/', 'image_submission', onImageUploadSuccessful);
}

function submitForm(url, formID, callback) {
    $.ajax({
           type: "POST",
           url: url,
           data: $("#"+formID).serialize(),
           success: callback
         });

    return false;
}

function onVideoUploadSuccessful(data) {
    swal("Video upload successful!", "You can view in in the \"View Napkins\" tab.", "success");
}

function onImageUploadSuccessful(data) {
    swal("Image upload successful!", "You can view in in the \"View Napkins\" tab.", "success");
}

function fillBackground() {
    ctx.fillStyle='white';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

fillBackground()