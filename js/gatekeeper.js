(function() {
  var arraysEqual, checkOffline, checkOnline, earlyStudents, lateStudents, messageJSON, messageUrl, renderInfo, renderText, resetForm, sequence, timeout;

  earlyStudents = [];

  lateStudents = [];

  messageUrl = "https://mandrillapp.com/api/1.0/messages/send.json";

  messageJSON = {
    "key": "UrIM_1K4VHo5Vmo6RLEaSA",
    "message": {
      "text": "Example text content",
      "subject": "Attendance for " + ((new Date()).getMonth() + 1) + '/' + ((new Date()).getDate()),
      "from_email": "gatekeeper@sundownblues.com",
      "from_name": "Gatekeeper",
      "to": [
        {
          "email": "paul.mand3l@gmail.com",
          "type": "to"
        }
      ]
    }
  };

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
    if ((info != null ? info.length : void 0) === 0) {
      return "<p>No students.</p>";
    }
    html = '<table class="table table-striped">';
    html += "<tr><th>Email</th><th>Name</th></tr>";
    for (_i = 0, _len = info.length; _i < _len; _i++) {
      tuple = info[_i];
      html += '<tr><td>' + tuple[1] + '</td><td>' + tuple[0] + '</td></tr>';
    }
    html += '</table>';
    return html;
  };

  renderText = function(early, late) {
    var retval, std, _i, _j, _len, _len1, _results;
    retval = '';
    retval += "Series Students\n";
    for (_i = 0, _len = early.length; _i < _len; _i++) {
      std = early[_i];
      retval += std[1] + '\t' + std[0] + '\n';
    }
    retval += '\n';
    retval += "Drop-in Students\n";
    _results = [];
    for (_j = 0, _len1 = late.length; _j < _len1; _j++) {
      std = late[_j];
      _results.push(retval += std[1] + '\t' + std[0] + '\n');
    }
    return _results;
  };

  resetForm = function() {
    var buttonText;
    $('#name').val('');
    $('#email').val('');
    $('#early').removeClass('active').find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
    $('#late').removeClass('active').find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
    buttonText = $('#submit').removeClass('active').html();
    $('#submit').html("Submitted!").addClass("disabled");
    $(window).resize();
    $('#submit').html(buttonText).removeClass("disabled");
    $('#name').focus();
    return retval;
  };

  sequence = [];

  timeout = void 0;

  $(function() {
    var cancel;
    $('#admin').modal({
      show: false
    });
    checkOffline();
    $('#name').focus();
    FastClick.attach(document.body);
    $(window).on('beforeunload', function() {
      return "You have unsynced check-ins. These check-ins will be lost. Please sync the check-ins before navigating.";
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
        console.log(JSON.stringify(earlyStudents, null, 2));
        sequence.length = 0;
        return;
      }
      return timeout = setTimeout(function() {
        console.log('too slow');
        return sequence.length = 0;
      }, 5000);
    });
    $('#sync').click(function() {
      $(this).addClass('disabled').text("Syncing...");
      messageJSON.message.text = renderText(earlyStudents, lateStudents);
      return $.post(messageUrl, messageJSON).done(function(data, status, xhr) {
        alert("Sync successful.");
        earlyStudents.length = 0;
        return lateStudents.length = 0;
      }).fail(function(xhr, status, error) {
        return alert("Sync failed. Please try again.\n\n" + error);
      }).always(function() {
        return $(this).removeClass('disabled').text('Sync');
      });
    });
    $('#submit').on('click', function(e) {
      var early, email, late, name;
      $("#submit").blur();
      name = $('#name').val();
      email = $('#email').val();
      if (name.trim() === '' || email.trim() === '') {
        return cancel(e);
      }
      early = $('#early').hasClass('active') ? true : false;
      late = $('#late').hasClass('active') ? true : false;
      if (early === false && late === false) {
        alert("Please select a class.");
        return;
      }
      if (early) {
        earlyStudents.push([email, name]);
        console.log(earlyStudents.length, 'series students');
      }
      if (late) {
        lateStudents.push([email, name]);
        console.log(lateStudents.length, 'drop in students');
      }
      alert("Thanks for checking in!");
      resetForm();
      console.log(name, email, early, late);
      return cancel(e);
    });
    $('body').on('click', '#early', function() {
      $(this).toggleClass('active');
      $(this).find('i').toggleClass('fa-square-o').toggleClass('fa-check-square-o');
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
      $(this).find('i').toggleClass('fa-square-o').toggleClass('fa-check-square-o');
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
    return cancel = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  });

}).call(this);
