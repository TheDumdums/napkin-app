var canvas = document.getElementById('napkin')
let ctx = canvas.getContext('2d');
let textMode = false;
let mousePos;
let redButton = document.getElementById('red');
let blackButton = document.getElementById('black');
let blueButton = document.getElementById('blue');
let textButton = document.getElementById('text');

var signaturePad = new SignaturePad(canvas, {
    minWidth: 3,
    maxWidth: 8
});

colorChangeBlack();

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

function colorChangeBlack() {
    signaturePad.penColor = 'rgb(0,0,0)';
    ctx.fillStyle = 'rgb(0,0,0)';

    redButton.style["border"] = "3px solid #000000";
    blackButton.style["border"] = "6px solid #ffffff";
    blueButton.style["border"] = "3px solid #000000";
}

function colorChangeRed() {
    signaturePad.penColor = 'rgb(203,5,5)';
    ctx.fillStyle = 'rgb(203,5,5)';

    redButton.style["border"] = "6px solid #ffffff";
    blackButton.style["border"] = "3px solid #000000";
    blueButton.style["border"] = "3px solid #000000";
}

function colorChangeBlue() {
    signaturePad.penColor = 'rgb(21,18,193)';
    ctx.fillStyle = 'rgb(21,18,193)';

    redButton.style["border"] = "3px solid #000000";
    blackButton.style["border"] = "3px solid #000000";
    blueButton.style["border"] = "6px solid #ffffff";
}

function switchToTextMode() {
    textMode = !textMode;
    console.log(textMode);
    if (textMode) {
        console.log("turning off signature pad");
        textButton.style["border"] = "6px solid #ffffff";
        signaturePad.off();
    } else {
        console.log("turning on signature pad");
        textButton.style["border"] = "3px solid #000000";
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