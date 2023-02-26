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