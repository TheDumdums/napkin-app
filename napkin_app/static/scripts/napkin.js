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
        console.log("Undo key");
        var data = signaturePad.toData();
        if (data) {
            data.pop();
        }
        signaturePad.fromData(data);
    }
});

//CLEAR BUTTON
document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
    fillBackground();
});

//UNDO BUTTON
document.getElementById('undo').addEventListener('click', function () {
    var data = signaturePad.toData();
    if (data) {
        data.pop();
        signaturePad.fromData(data);
    }
});

//CHANGE COLOR
function colorChanged() {
    document.getElementById("mode").innerHTML = "Drawing Mode";
    const inputVal = document.getElementById("color-picker").value;
    signaturePad.penColor = inputVal;
    signaturePad.on();
}

//CHANEG MODE
function mode(num) {
    if (num == 1) {
        modeHTML.innerHTML = "Drawing Mode";
    }
    else if (num == 2) {
        timesClicked++;
        if (timesClicked % 2 == 0) {
            textButton.click();
        }
        modeHTML.innerHTML = "Writing Mode";
    }
}


function switchToTextMode() {
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

function sendUploadRequest() {
    var name = document.getElementById('napkin-name').value;

    var id = signaturePad.toDataURL();
    id = id.replace(/\//g, '#');
    console.log(id);
    
    window.location.pathname = '/upload/'+name+"/"+id;
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
let recordedChunks = [];

var uploadVideoButton
var downloadVideoButton

function blobToDataURL(blob, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {callback(e.target.result);}
    fileReader.readAsDataURL(blob);
}

function startRecording() {
    const canvasStream = canvas.captureStream();
    mediaRecorder = new MediaRecorder(canvasStream);
    mediaRecorder.addEventListener('dataavailable', (event) => {
        recordedChunks.push(event.data);
    });

    var stopButton = document.createElement("button");
    stopButton.innerText = "Stop";
    document.getElementById("tools").appendChild(stopButton);

    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        document.getElementById("tools").removeChild(stopButton);
        delete stopButton;

        if (downloadVideoButton == null) {
            downloadVideoButton = document.createElement("button");
        }
        downloadVideoButton.id = 'download-video'
        downloadVideoButton.innerText = "Download Video";
        document.getElementById("download-buttons").appendChild(downloadVideoButton);
        downloadVideoButton.addEventListener('click', () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
            blobToDataURL(recordedBlob, function(dataurl) {
                var name = document.getElementById('napkin-name').value;
                downloadURI(dataurl, name);            
            })
        });

        if (uploadVideoButton == null) {
            uploadVideoButton = document.createElement('button');
        }
        uploadVideoButton.id = 'upload-video'
        uploadVideoButton.innerText = "Upload Video";
        document.getElementById('download-buttons').appendChild(uploadVideoButton);
        uploadVideoButton.addEventListener('click', () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });

            blobToDataURL(recordedBlob, function(dataurl){
                document.getElementById('videoURL').value = dataurl
                document.getElementById('videoname').value = document.getElementById('napkin-name').value;
                document.getElementById('video_submission').submit();
            });
        });
    });

    mediaRecorder.start();
    recordedChunks = [];
}

function fillBackground() {
    ctx.fillStyle='white';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

fillBackground()