function search() {
  query = document.getElementById('name_input').value;
  node = document.getElementById('result');

  console.log(query);
  
  $.ajax({
    url: "https://TestSearchBackEnd.bigphan.repl.co/search/" + query,
    success: function (res) {
      console.log("success");
      node.insertAdjacentHTML('beforeend', '<div>' + res + '</div>');
      result = res;
    },
    error: function(error) {
      console.log(error);
      node.insertAdjacentHTML('beforeend', '<div>Not found!</div>');
    }
  });

  node.textContent = '';
  document.getElementById('name_input').value = '';
}