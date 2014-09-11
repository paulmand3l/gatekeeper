earlyStudents = []
lateStudents = []

earlyStudents = [
  ["Paul Mandel", "fjdskl@fjkdls.com"],
  ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"],
  ["jfdksl", "fdjskl@fjklds.com"],
  ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"],
  ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"],
  ["fjdkslf", "fjskfld@fjkdlsfj.com"],
  ["fdjskfls", "fjkldsjfkdl@fjkdlsj.com"],
  ["fdjsklf", "fjdklsfjdkls@jklfd.com"],
  ["fdjsklf", "fjdklsfjdksl@fjkdlsfjkdls.com"],
  ["fjdkslf", "fjkdlsfjdksl@jfkdlsjfkl.com"],
  ["fjdkslfjsdkl", "fjdkslfjkdl@jfkdlsjfklsd.com"],
  ["fjdkslfk", "fjdklsfjkdl@fjdklsfjdkls.com"],
  ["fdjskflsdjkl", "fjdkslfjdksl@fjdklsfjkl.com"],
]

lateStudents = [
  ["Paul Mandel", "fjdskl@fjkdls.com"],
  ["fdsjkl", "fdjkslfjdkls@fkdlsfjdksl.com"],
  ["jfdksl", "fdjskl@fjklds.com"],
  ["fdjskfls", "fjdklsfjdkls@jfkldsjfkld.com"],
  ["fjdkslfjdskl", "fjdklsf@fjklsjfkls.com"],
  ["ruewio", "fjskfld@fjkdlsfj.com"],
  ["wruieow", "fjkldsjfkdl@fjkdlsj.com"],
  ["wuriewo", "fjdklsfjdkls@jklfd.com"],
  ["ruieowruiewo", "fjdklsfjdksl@fjkdlsfjkdls.com"],
  ["reuwio", "fjkdlsfjdksl@jfkdlsjfkl.com"],
  ["eruwio", "fjdkslfjkdl@jfkdlsjfklsd.com"],
  ["werueiow", "fjdklsfjkdl@fjdklsfjdkls.com"],
  ["rueiwo", "fjdkslfjdksl@fjdklsfjkl.com"],
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
  html = '<table class="table table-striped">'
  html += "<tr><th>Email</th><th>Name</th></tr>"
  for tuple in info
    html += '<tr><td>' + tuple[1] + '</td><td>' + tuple[0] + '</td></tr>'
  html += '</table>'
  return html

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
      sequence.length = 0
      return

    timeout = setTimeout ->
      console.log 'too slow'
      sequence.length = 0
    , 5000


  $('#submit').on 'tap click', (e) ->
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
      $(this).blur()

      setTimeout =>
        parent = $(this).parent()
        $(this).remove()
        $(this).prependTo(parent)
      , 200

  $('body').on 'click', '#late', ->
      $(this).toggleClass 'active'
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
    $('#late').removeClass('active')

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
