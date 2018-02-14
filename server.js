require('dotenv').config()
const debug = require('debug')('picast:server')
const morgan = require('morgan')
const path = require('path')
const express = require('express')
const multer = require('multer')
const wpa = require('wpa_supplicant')

// do the first network
var wifi = wpa('wlan0')

wifi.on('ready', function () {
  wifi.scan() // scan once
})

var app = express()
app.set('env', process.env.NODE_ENV)
const morganLogPreset = app.get('env') === 'development' ? 'dev' : 'combined'
app.use(morgan(morganLogPreset))
app.set('views', path.join(__dirname, 'views')) // general config
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

const getFormData = multer().single()
app.get('/', function (req, res, next) {
  res.render('admin')
})

app.post('/', getFormData, function handleFormData (req, res, next) {
  debug('ssid', req.body.ssid)
  debug('psk', req.body.psk)
  const ssid = req.body.ssid
  const psk = req.body.psk

  if (wifi && ssid && psk) {
    if (!wifi.scanning) {
      debug('scan')
      wifi.scan()
    }

    if (wifi.networks[ssid]) {
      wifi.networks[ssid].connect({ psk })
      debug('connect')
      res.status(200)
    } else {
      debug('fail connect')
      res.status(400)
    }
  } else {
    debug('fail wifi ssid psk')
    res.status(400)
  }

  return res.format({
    'text/html': function () {
      // Use error template as the template for the admin page
      // even though it's not an error per se
      res.render('error', {
        status: res.statusCode,
        statusText: res.locals.statusText
      })
    },
    'application/json': function () {
      res.json({ status: res.statusCode, statusText: res.locals.statusText })
    },
    'default': function () {
      res.send(res.locals.statusText)
    }
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.format({
    'text/html': function () {
      debug('rendering text/html')
      res.status(404)
      res.render('error', {
        status: res.statusCode,
        statusText: 'Not found'
      })
    },
    'application/json': function () {
      debug('rendering application/json error')
      res.status(404).json({ Error: { status: 404, statusText: 'Not found' } })
      debug('command', res.body.command)
    },
    'default': function () {
      res.sendStatus(404)
    }
  })
})

// Error handlers
// Development error handler, will print stacktrace
app.use(function (err, req, res, next) {
  debug('dev error handler', err)
  if (!res.statusCode) {
    res.status(500)
  }
  res.render('error', {
    status: res.statusCode,
    statusText: err.message,
    stack: err.stack
  })
})

module.exports = app
