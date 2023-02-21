function search() {
    console.log("Searching for classes...");
  
    //1. grab
    var unit = $('#unit_input').val();
    console.log("Unit:" + unit);
  
    //2. Call
    $.ajax({
      url: "https://a3server.jubemhaecucal.repl.co/search/" + unit, success: function(res) {
        console.log(res);
        $("#result_table").empty();
        $("#result_table").append("<tr><th>Classes:</th><th>Unit:</th></tr>")
        var classList = JSON.parse(res);
        for(var i = 0; i < classList.length; i++) {
          console.log(classList[i].schoolClass);
          console.log(classList[i].unit);
  
          //3. render
          $('#result_table').append("<tr><td>" + classList[i].schoolClass + '</td><td>' + classList[i].unit + "</td></tr>")
          $
        }
      }
    })
  }