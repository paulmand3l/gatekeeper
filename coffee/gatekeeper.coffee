earlyStudents = []
lateStudents = []



$ ->
  $('#name').focus()
  FastClick.attach(document.body);

$ '#submit'
  .on 'tap click', (e) ->
    $("#submit").blur()
    name = $('#name').val()
    email = $('#email').val()

    if name.trim() is '' or email.trim() is ''
      return cancel e

    early = if $('#early').parent().hasClass('active') then true else false
    late = if $('#late').parent().hasClass('active') then true else false

    do resetForm

    if early
      earlyStudents.push [email, name]

    if late
      lateStudents.push [email, name]

    console.log name, email, early, late

    cancel e

$ 'body'
  .on 'click', '#early',  ->
    $(this).toggleClass 'active'

    setTimeout =>
      parent = $(this).parent()
      $(this).remove()
      $(this).prependTo(parent)
    , 150

$ 'body'
  .on 'click', '#late', ->
    $(this).toggleClass 'active'

    setTimeout =>
      parent = $(this).parent()
      $(this).remove()
      $(this).appendTo(parent)
    , 150

resetForm = ->
  $('#name').val ''
  $('#email').val ''
  $('#early').parent().removeClass('active')
  $('#late').parent().removeClass('active')

  buttonText = $('#submit').removeClass('active').html()
  $('#submit').html("Submitted!").addClass("disabled")
  setTimeout ->
    $('#submit').html(buttonText).removeClass("disabled")
    $('#name').focus()
  , 1000

cancel = (e) ->
  e.preventDefault()
  e.stopPropagation()
  false
