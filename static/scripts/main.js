$(document).ready(function(){
  var socket = io()
  socketListeners()
  socket.emit('getUsers')

  var nick = ''
  var users = {}

  $('#nick').focus()
  $('form').submit(function(){
    nick = $('#nick').val();
    if(nick != ""){
      socket.emit('login', nick);
    }

    return false;
  });

  function socketListeners(){
    socket.on('loginResponse', function(data){
      switch(data){
        case 'approved':
          $('#loginCover').slideUp(700);
          init();
          break;

        case 'nickTaken':
          alert('That nick is already chosen');
          break;

        case 'maxUsersReached':
          alert('Maximum number of users already connected');
          break;

        default:
          alert('Something went wrong');
          break;
      }
    });

    socket.on('updateUsers', function(data){
      //Update counter on loginDiv
      $('#onlineCounter').html('' + data.length)
      if(data.length == 6){
        $('#onlineCounter').css('color', 'red')
      }
      else{
        $('#onlineCounter').css('color', 'black')
      }

      //Update users list
      $('#onlineUsers').html('');
      data.forEach(function(element, index){
        $('#onlineUsers').append( $('<li>').html(element) );
        users[element] = { x: 0, y: 0};
      });
    });

  }

  function init(){
    $(window).on('beforeunload', function(){
      socket.emit('logout', nick);
    });
  }
})
