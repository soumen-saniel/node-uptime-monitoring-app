/**
 * Primary file for the API
 */

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')
const handlers = require('./lib/handlers')
const _data = require('./lib/data')

// Create data
// _data.create('test', 'test1', { 'hello': 'hi' }, function (err) {
//   console.log('The error is ', err)
// })

// Read data
// _data.read('test', 'test1', function (err, data) {
//   console.log('The error is ', err)
//   console.log('Data is ', data)
// })

// Update data
_data.update('test', 'test1', { 'foo': 'bar' }, function (err) {
  console.log('The error is ', err)
})

// Instantiating the http server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
})

// Start the server at PORT 3000
httpServer.listen(config.httpPort, function () {
  console.log('The server is listning on PORT ' + config.httpPort)
})

// Instantiate the https server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res)
})

// Start the https server
httpsServer.listen(config.httpsPort, function () {
  console.log('The server is listning on PORT ' + config.httpsPort)
})

// All the server logic for http and https server
const unifiedServer = function (req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true) // true in the 2nd param is to parse the query string and set it to query prop

  // Get the path from url
  const path = parsedUrl.pathname
  const trimedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedUrl.query

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  // Get payload if any
  const decoder = new StringDecoder('utf8')
  let buffer = ''
  req.on('data', function (data) {
    buffer += decoder.write(data)
  })
  req.on('end', function () {
    buffer += decoder.end()

    // Choose the handler this request should go to
    const choosenHandler = typeof router[trimedPath] !== 'undefined' ? router[trimedPath] : handlers.notFound

    // Construct the data object to send to handler
    const data = {
      trimedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }

    // Route the request to the choosen handler
    choosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200

      payload = typeof payload === 'object' ? payload : {}

      // Conver the payload to a string
      const payloadString = JSON.stringify(payload)

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      // Log the request path
      console.log(statusCode, payloadString)
    })
  })
}

// Define a request router
const router = {
  'ping': handlers.ping,
  'users': handlers.users
}
