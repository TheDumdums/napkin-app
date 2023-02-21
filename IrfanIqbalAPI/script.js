function search() {
  $("#result_list").empty();
  // Step 1. get the budget from the input box
  var salary = $('#salary_input').val();
  // Step 2. send the HTTP request
  $.ajax({
    url: "http://127.0.0.1:5000/search/" + salary,
    success: function (res) {
      console.log("The result from the server is: " + res);

      var companyList = JSON.parse(res);
      for(var i = 0; i < res.length; i++) {
        console.log(companyList[i].name + " : " + companyList[i].salary);
        $("#result_list").append('<li class="list-group-item">' + companyList[i].name + " : " + companyList[i].salary + "k</li>")
      }
    },
    error: function(error) {
      console.log("Failed to search." + error);
    }
  });
  // Step 3. render the result

}