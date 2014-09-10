(function() {
  var cancel, earlyStudents, lateStudents, resetForm;

  earlyStudents = [];

  lateStudents = [];

  $('#name').focus();

  $('form').submit(function(e) {
    var early, email, late, name;
    $("#submit").blur();
    name = $('#name').val();
    email = $('#email').val();
    if (name.trim() === '' || email.trim() === '') {
      return cancel(e);
    }
    early = $('#early').parent().hasClass('active') ? true : false;
    late = $('#late').parent().hasClass('active') ? true : false;
    resetForm();
    if (early) {
      earlyStudents.push([email, name]);
    }
    if (late) {
      lateStudents.push([email, name]);
    }
    console.log(name, email, early, late);
    return cancel(e);
  });

  resetForm = function() {
    var buttonText;
    $('#name').val('');
    $('#email').val('');
    $('#early').parent().removeClass('active');
    $('#late').parent().removeClass('active');
    buttonText = $('#submit').removeClass('active').html();
    $('#submit').html("Submitted!").addClass("disabled");
    return setTimeout(function() {
      $('#submit').html(buttonText).removeClass("disabled");
      return $('#name').focus();
    }, 3000);
  };

  cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

}).call(this);
