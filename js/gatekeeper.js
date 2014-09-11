(function() {
  var cancel, earlyStudents, lateStudents, resetForm;

  earlyStudents = [];

  lateStudents = [];

  $(function() {
    $('#name').focus();
    return FastClick.attach(document.body);
  });

  $('#submit').on('tap click', function(e) {
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

  $('#early').on('click', function() {
    $(this).toggleClass('active');
    return setTimeout((function(_this) {
      return function() {
        alert('boop');
        return $(_this).blur();
      };
    })(this), 150);
  });

  $('#late').on('click', function() {
    $(this).toggleClass('active');
    return setTimeout((function(_this) {
      return function() {
        alert('beep');
        return $(_this).blur();
      };
    })(this), 150);
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
    }, 1000);
  };

  cancel = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

}).call(this);
