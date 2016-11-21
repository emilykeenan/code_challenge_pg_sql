$(document).ready(function () {

  // get treats on load
  getTreats();

  /**---------- Event Handling ----------**/
  $('#searchButton').on('click', function (event) {
    event.preventDefault();

    var queryString = $('#search').val();

    searchTreats(queryString);
  });

  $('#saveNewButton').on('click', function(event) {
    event.preventDefault();

    var treateName = $('#treatNameInput').val();
    var treatDescription = $('#treatDescriptionInput').val();
    var treateURL = $('#treatUrlInput').val();

    var newTreat = {
      name: treateName,
      description: treatDescription,
      url: treateURL
    };

    postTreat(newTreat);

    $('#treatDescriptionInput').val('');
    $('#treatNameInput').val('');
    $('#treatUrlInput').val('');

  });

  $('#treat-display').on('click', '.delete', deleteTreat);

  $('#treat-display').on('click', '.edit', updateTreat);

  /**---------- AJAX Functions ----------**/

  // GET /treats
  function getTreats() {
    $.ajax({
      method: 'GET',
      url: '/treats',
    })
    .done(function (treatArray) {
      console.log('GET /treats returned ', treatArray);
      clearDom();
      $.each(treatArray, function (index, treat) {
        appendTreat(treat);
      });
    });
  }

  // Search GET /treats/thing
  function searchTreats(query) {
    $.ajax({
      method: 'GET',
      url: '/treats/' + query,
    })
    .done(function (treatArray) {
      console.log('GET /treats/', query, 'returned ', treatArray);

      clearDom();

      $.each(treatArray, function (index, treat) {
        // add this treat to the DOM
        appendTreat(treat);
      });
    });
  }

  // POST /treats
  function postTreat(treat) {
    $.ajax({
      method: 'POST',
      url: '/treats',
      data: treat,
    })
    .done(function () {
      console.log('POST /treats sent ', treat);
      clearDom();
      getTreats();
    });
  }

  // delete treats
function deleteTreat() {
  var id = $(this).closest('.individual-treat').data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: '/treats/' + id,
    success: function(result) {
      getTreats();
    },
    error: function(result) {
      console.log('could not delete treat.');
    }
  });
} // end deleteTask function

function updateTreat() {
  var id = $(this).closest('.individual-treat').data('id');
  console.log(id);

  // make book object
  var treat = {};
  var fields = $(this).parent().children().serializeArray();
  fields.forEach(function(field) {
    treat[field.name] = field.value;
  });
  console.log(treat);

  $.ajax({
    type: 'PUT',
    url: '/treats/' + id,
    data: treat,
    success: function(result) {
      alert('Edit successful!');
      getTreats();
    },
    error: function(result) {
      alert('could not update treat!');
    }
  });

}

  /** ---------- DOM Functions ----------**/

  function clearDom() {
    var $treats = $('#treat-display');
    $treats.empty();
  }

  function appendTreat(treat) {
    // append a treat to the DOM and add data attributes
    // treat-display -> treat row -> treat

    var $treats = $('#treat-display');

    var treatCount = $treats.children().children().length;

    if (treatCount % 2 === 0) {
      // add a treat row every 2 treats
      $treats.append('<div class="treat row"></div>');
    }

    var $treat = $('<div class="six columns individual-treat">' +
                  '<div class="image-wrap">' +
                  '<img src="' + treat.pic + '" class="u-max-full-width" />' +
                  '<div class="toggle row">' +
                  '<div class="six columns">' +
                  '</div>' +
                  '<div class="six columns">' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '<input type="text" name="name" value="' + treat.name + '" />' +
                  '<input type="text" name="description" value="' + treat.description + '" />' +
                  '<button class="delete">Eat Treat</button>' +
                  '<button class="edit">Edit Treat</button>' +
                  '</div>');

    $treat.data('id', treat.id);

    $('.treat:last-of-type').append($treat);
  }
});
