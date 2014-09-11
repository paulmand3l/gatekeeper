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

  $('body').on('click', '#early', function() {
    $(this).toggleClass('active');
    $(this).blur();
    return setTimeout((function(_this) {
      return function() {
        var parent;
        parent = $(_this).parent();
        $(_this).remove();
        return $(_this).prependTo(parent);
      };
    })(this), 200);
  });

  $('body').on('click', '#late', function() {
    $(this).toggleClass('active');
    $(this).blur();
    return setTimeout((function(_this) {
      return function() {
        var parent;
        parent = $(_this).parent();
        $(_this).remove();
        return $(_this).appendTo(parent);
      };
    })(this), 200);
  });

  resetForm = function() {
    var buttonText;
    $('#name').val('');
    $('#email').val('');
    $('#early').removeClass('active');
    $('#late').removeClass('active');
    buttonText = $('#submit').removeClass('active').html();
    $('#submit').html("Submitted!").addClass("disabled");
    $(window).resize();
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
