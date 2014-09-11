earlyStudents = []
lateStudents = []

############################
# TEST DATA
# earlyStudents = [
#   ["Paul Mandel", "fjdskl@fjkdls.com"],
#   ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"],
#   ["jfdksl", "fdjskl@fjklds.com"],
#   ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"],
#   ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"],
#   ["fjdkslf", "fjskfld@fjkdlsfj.com"],
#   ["fdjskfls", "fjkldsjfkdl@fjkdlsj.com"],
#   ["fdjsklf", "fjdklsfjdkls@jklfd.com"],
#   ["fdjsklf", "fjdklsfjdksl@fjkdlsfjkdls.com"],
#   ["fjdkslf", "fjkdlsfjdksl@jfkdlsjfkl.com"],
#   ["fjdkslfjsdkl", "fjdkslfjkdl@jfkdlsjfklsd.com"],
#   ["fjdkslfk", "fjdklsfjkdl@fjdklsfjdkls.com"],
#   ["fdjskflsdjkl", "fjdkslfjdksl@fjdklsfjkl.com"],
# ]

# lateStudents = [
#   ["Paul Mandel", "fjdskl@fjkdls.com"],
#   ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"],
#   ["jfdksl", "fdjskl@fjklds.com"],
#   ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"],
#   ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"],
#   ["ruewio", "fjskfld@fjkdlsfj.com"],
#   ["wruieow", "fjkldsjfkdl@fjkdlsj.com"],
#   ["wuriewo", "fjdklsfjdkls@jklfd.com"],
#   ["ruieowruiewo", "fjdklsfjdksl@fjkdlsfjkdls.com"],
#   ["reuwio", "fjkdlsfjdksl@jfkdlsjfkl.com"],
#   ["eruwio", "fjdkslfjkdl@jfkdlsjfklsd.com"],
#   ["werueiow", "fjdklsfjkdl@fjdklsfjdkls.com"],
#   ["rueiwo", "fjdkslfjdksl@fjdklsfjkl.com"],
# ]
###############################

messageUrl = "https://mandrillapp.com/api/1.0/messages/send.json"
messageJSON =
  "key": "UrIM_1K4VHo5Vmo6RLEaSA"
  "message":
      "text": "Example text content"
      "subject": "Attendance for " + ((new Date()).getMonth()+1) + '/' + ((new Date()).getDate())
      "from_email": "gatekeeper@1dance.com"
      "from_name": "Gatekeeper"
      "to": [
          {
              "email": "paul.mand3l@gmail.com"
              "type": "to"
          }
      ]

checkOnline = ->
  if window.navigator.onLine
    $('#sync').removeClass('disabled')
    do checkOffline
  else
    $('#sync').addClass('disabled')
    setTimeout checkOnline, 150

checkOffline = ->
  if window.navigator.onLine
    $('#sync').removeClass('disabled')
    setTimeout checkOffline, 150
  else
    $('#sync').addClass('disabled')
    do checkOnline

arraysEqual = (a, b) ->
  return true  if a is b
  return false  if not a? or not b?
  return false  unless a.length is b.length

  # If you don't care about the order of the elements inside
  # the array, you should sort both arrays here.
  i = 0

  while i < a.length
    return false  if a[i] isnt b[i]
    ++i
  true

renderInfo = (info) ->
  if info?.length == 0
    return "<p>No students.</p>"

  html = '<table class="table table-striped">'
  html += "<tr><th>Email</th><th>Name</th></tr>"
  for tuple in info
    html += '<tr><td>' + tuple[1] + '</td><td>' + tuple[0] + '</td></tr>'
  html += '</table>'
  return html

renderText = (early, late) ->
  retval = ''
  retval += "Series Students\n"
  for std in early
    retval += std[1] + '\t' + std[0] + '\n'
  retval += '\n'

  retval += "Drop-in Students\n"
  for std in late
    retval += std[1] + '\t' + std[0] + '\n'

  retval

sequence = []
timeout = undefined
$ ->
  $('#admin').modal
      show: false

  do checkOffline

  $('#name').focus()
  FastClick.attach(document.body);
  $(window).on 'beforeunload', ->
    return "You have unsynced check-ins. These check-ins will be lost."

  $('body').on 'click', '.b', ->
    clearTimeout timeout
    if $(this).hasClass 'r'
      sequence.push 'r'
    if $(this).hasClass 'l'
      sequence.push 'l'

    if arraysEqual(sequence, ['r', 'l', 'r', 'l']) or arraysEqual(sequence, ['l', 'r', 'l', 'r'])
      console.log 'success!'
      $('#admin .modal-body').html('<h3>Series Class</h3>' + renderInfo(earlyStudents) + '<h3>Drop-In Class</h3>' + renderInfo(lateStudents))
      $('#admin').modal('show')
      console.log JSON.stringify earlyStudents, null, 2
      sequence.length = 0
      return

    timeout = setTimeout ->
      console.log 'too slow'
      sequence.length = 0
    , 5000

  $('#sync').click ->
    $(this).addClass('disabled').text "Syncing..."
    messageJSON.message.text = renderText earlyStudents, lateStudents
    $.post messageUrl, messageJSON
      .done (data, status, xhr) ->
        alert "Sync successful."
        earlyStudents.length = 0
        lateStudents.length = 0
      .fail (xhr, status, error) ->
        alert "Sync failed. Please try again.\n\n" + error
      .always ->
        $(this).removeClass('disabled').text 'Sync'


  $('#submit').on 'click', (e) ->
      $("#submit").blur()
      name = $('#name').val()
      email = $('#email').val()

      if name.trim() is '' or email.trim() is ''
        return cancel e

      early = if $('#early').hasClass('active') then true else false
      late = if $('#late').hasClass('active') then true else false

      do resetForm

      if early
        earlyStudents.push [email, name]
        console.log earlyStudents.length, 'series students'

      if late
        lateStudents.push [email, name]
        console.log lateStudents.length, 'drop in students'

      console.log name, email, early, late

      cancel e

  $('body').on 'click', '#early',  ->
      $(this).toggleClass 'active'
      $(this).find('i').toggleClass('fa-square-o').toggleClass('fa-check-square-o')
      $(this).blur()

      setTimeout =>
        parent = $(this).parent()
        $(this).remove()
        $(this).prependTo(parent)
      , 200

  $('body').on 'click', '#late', ->
      $(this).toggleClass 'active'
      $(this).find('i').toggleClass('fa-square-o').toggleClass('fa-check-square-o')
      $(this).blur()

      setTimeout =>
        parent = $(this).parent()
        $(this).remove()
        $(this).appendTo(parent)
      , 200

  resetForm = ->
    $('#name').val ''
    $('#email').val ''
    $('#early').removeClass('active')
      .find('i').removeClass('fa-check-square-o').addClass('fa-square-o')
    $('#late').removeClass('active')
      .find('i').removeClass('fa-check-square-o').addClass('fa-square-o')

    buttonText = $('#submit').removeClass('active').html()
    $('#submit').html("Submitted!").addClass("disabled")
    $(window).resize()
    setTimeout ->
      $('#submit').html(buttonText).removeClass("disabled")
      $('#name').focus()
    , 1000

  cancel = (e) ->
    e.preventDefault()
    e.stopPropagation()
    false
