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

document.getElementById('clear').addEventListener('click', function () {
    signaturePad.clear();
});

function erase() {
    ctx.globalCompositeOperation = 'destination-out';
}

function colorChanged() {
    ctx.globalCompositeOperation = 'source-over';
    document.getElementById("mode").innerHTML = "Drawing Mode";
    const inputVal = document.getElementById("color-picker").value;
    signaturePad.penColor = inputVal;
    signaturePad.on();
}

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
    else if (num == 3) {
        modeHTML.innerHTML = "Erase Mode";
    }
}

function switchToTextMode() {
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