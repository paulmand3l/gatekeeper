earlyStudents = []
lateStudents = []

$('#name').focus()

$ 'form'
  .submit (e) ->
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
  , 3000

cancel = (e) ->
  e.preventDefault()
  e.stopPropagation()
  false