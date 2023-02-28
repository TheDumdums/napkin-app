var napkinCanvas = document.getElementById('napkin')

var signaturePad = new SignaturePad(napkinCanvas, {
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

function colorChangeBlack() {
    signaturePad.penColor = 'rgb(0,0,0)';
}

function colorChangeRed() {
    signaturePad.penColor = 'rgb(203,5,5)';
}

function colorChangeBlue() {
    signaturePad.penColor = 'rgb(21,18,193)';
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