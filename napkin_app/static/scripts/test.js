$(document).ready(function() {
    $("#capture").submit(function(event) {
        var radio_select = document.capture.inlineRadioOptions.value;
        console.log(radio_select)

        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'external',
            data: {
                'img64': photo.src,
                'radio_seleect': radio_select
            }
        }).done(function() {
            console.log('sent');


        });

    });
});
