#!/usr/bin/env node

const http = require('http')
const path = require('path')
var express = require('express')
var app = express()

const port = 20000

// exemplary express endpoint
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

//static route
app.use('/static', express.static(path.join(__dirname, 'static')))

//error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//404 handling
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(port);
