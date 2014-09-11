(function() {
  var arraysEqual, checkOffline, checkOnline, earlyStudents, lateStudents, renderInfo, sequence, timeout;

  earlyStudents = [];

  lateStudents = [];

  earlyStudents = [["Paul Mandel", "fjdskl@fjkdls.com"], ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"], ["jfdksl", "fdjskl@fjklds.com"], ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"], ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"], ["fjdkslf", "fjskfld@fjkdlsfj.com"], ["fdjskfls", "fjkldsjfkdl@fjkdlsj.com"], ["fdjsklf", "fjdklsfjdkls@jklfd.com"], ["fdjsklf", "fjdklsfjdksl@fjkdlsfjkdls.com"], ["fjdkslf", "fjkdlsfjdksl@jfkdlsjfkl.com"], ["fjdkslfjsdkl", "fjdkslfjkdl@jfkdlsjfklsd.com"], ["fjdkslfk", "fjdklsfjkdl@fjdklsfjdkls.com"], ["fdjskflsdjkl", "fjdkslfjdksl@fjdklsfjkl.com"]];

  lateStudents = [["Paul Mandel", "fjdskl@fjkdls.com"], ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"], ["jfdksl", "fdjskl@fjklds.com"], ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"], ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"], ["ruewio", "fjskfld@fjkdlsfj.com"], ["wruieow", "fjkldsjfkdl@fjkdlsj.com"], ["wuriewo", "fjdklsfjdkls@jklfd.com"], ["ruieowruiewo", "fjdklsfjdksl@fjkdlsfjkdls.com"], ["reuwio", "fjkdlsfjdksl@jfkdlsjfkl.com"], ["eruwio", "fjdkslfjkdl@jfkdlsjfklsd.com"], ["werueiow", "fjdklsfjkdl@fjdklsfjdkls.com"], ["rueiwo", "fjdkslfjdksl@fjdklsfjkl.com"]];

  checkOnline = function() {
    if (window.navigator.onLine) {
      $('#sync').removeClass('disabled');
      return checkOffline();
    } else {
      $('#sync').addClass('disabled');
      return setTimeout(checkOnline, 150);
    }
  };

  checkOffline = function() {
    if (window.navigator.onLine) {
      $('#sync').removeClass('disabled');
      return setTimeout(checkOffline, 150);
    } else {
      $('#sync').addClass('disabled');
      return checkOnline();
    }
  };

  arraysEqual = function(a, b) {
    var i;
    if (a === b) {
      return true;
    }
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    i = 0;
    while (i < a.length) {
      if (a[i] !== b[i]) {
        return false;
      }
      ++i;
    }
    return true;
  };

  renderInfo = function(info) {
    var html, tuple, _i, _len;
    html = '<table class="table table-striped">';
    html += "<tr><th>Email</th><th>Name</th></tr>";
    for (_i = 0, _len = info.length; _i < _len; _i++) {
      tuple = info[_i];
      html += '<tr><td>' + tuple[1] + '</td><td>' + tuple[0] + '</td></tr>';
    }
    html += '</table>';
    return html;
  };

  sequence = [];

  timeout = void 0;

  $(function() {
    var cancel, resetForm;
    $('#admin').modal({
      show: false
    });
    checkOffline();
    $('#name').focus();
    FastClick.attach(document.body);
    $(window).on('beforeunload', function() {
      return "You have unsynced check-ins. These check-ins will be lost.";
    });
    $('body').on('click', '.b', function() {
      clearTimeout(timeout);
      if ($(this).hasClass('r')) {
        sequence.push('r');
      }
      if ($(this).hasClass('l')) {
        sequence.push('l');
      }
      if (arraysEqual(sequence, ['r', 'l', 'r', 'l']) || arraysEqual(sequence, ['l', 'r', 'l', 'r'])) {
        console.log('success!');
        $('#admin .modal-body').html('<h3>Series Class</h3>' + renderInfo(earlyStudents) + '<h3>Drop-In Class</h3>' + renderInfo(lateStudents));
        $('#admin').modal('show');
        sequence.length = 0;
        return;
      }
      return timeout = setTimeout(function() {
        console.log('too slow');
        return sequence.length = 0;
      }, 5000);
    });
    $('#submit').on('tap click', function(e) {
      var early, email, late, name;
      $("#submit").blur();
      name = $('#name').val();
      email = $('#email').val();
      if (name.trim() === '' || email.trim() === '') {
        return cancel(e);
      }
      early = $('#early').hasClass('active') ? true : false;
      late = $('#late').hasClass('active') ? true : false;
      resetForm();
      if (early) {
        earlyStudents.push([email, name]);
        console.log(earlyStudents.length, 'series students');
      }
      if (late) {
        lateStudents.push([email, name]);
        console.log(lateStudents.length, 'drop in students');
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
    return cancel = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  });

}).call(this);
