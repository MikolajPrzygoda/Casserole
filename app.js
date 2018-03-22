#!/usr/bin/env node
const port = 20000

var path = require('path')
var express = require('express')
var app = express()
var server = app.listen(port)
var io = require('socket.io').listen(server)

// --------------------------- Routing -----------------------------------
//static route
app.use(express.static(path.join(__dirname, 'static')))

//jquery serving
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))

//error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//404 handling
app.use(function (req, res, next) {
  console.error('Couldn\'t find: ', req.path)
  res.status(404).send('Sorry can\'t find that!')
})
// -----------------------------------------------------------------------

const maxUsers = 4
users = []


io.on('connection', function(socket){

  socket.on('login', function(nick){
    console.log(users.length)
    if(users.indexOf(nick) != -1){
      socket.emit('loginResponse', 'nickTaken')
    }
    else if(users.length >= maxUsers){
      socket.emit('loginResponse', 'maxUsersReached');
    }
    else{
      socket.emit('loginResponse', 'approved');
      users.push(nick);
      io.emit('updateUsers', users);
    }

  })

  socket.on('logout', function(nick){
    if(users.indexOf(nick) != -1){
      users.splice(users.indexOf(nick), 1);
      io.emit('updateUsers', users);
    }
  })

})

console.log(`Listening on port: ${port}`)
