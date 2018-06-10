const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')

// Request handlers
const handlers = {}

// Ping handler
handlers.ping = (data, callback) => {
  const statusCode = 200
  callback(statusCode)
}

// Not found handler
handlers.notFound = (data, callback) => {
  const statusCode = 400
  callback(statusCode)
}

// Router
const router = {
  ping: handlers.ping
}

// Server code
const server = (req, res) => {
  // Get url and parse it
  const parsedUrl = url.parse(req.url, true)
  // Get path
  const path = parsedUrl.pathname
  // Cleaned path
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  // Get query string as an object
  const queryObject = parsedUrl.query
  // Get the http method
  const method = req.method.toLowerCase()
  // Get headers
  const headers = req.headers
  // Get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()
    // Check for correct handler
    const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound
    // Construct the data object to be sent to handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryObject,
      method: method,
      headers: headers,
      buffer: buffer
    }

    chosenHandler(data, (statusCode, payload) => {
      // Setting default status code
      statusCode = typeof statusCode === 'number' ? statusCode : 200
      // Setting default payload
      payload = typeof payload === 'object' ? payload : {}
      const payloadString = JSON.stringify(payload)
      // Return response
      console.log('Returning response', statusCode, payloadString)
      res.setHeader('content-type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })

    // console.log('parsedUrl', parsedUrl)
    // console.log('method', method)
  })
}

// Initialize http server
const httpServer = http.createServer((req, res) => {
  server(req, res)
})

// Initialize http server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  server(req, res)
})

// Start http server
httpServer.listen(config.httpPort, () => {
  console.log('RUNNING HTTP SERVER ON PORT', config.httpPort)
})

// Start https server
httpsServer.listen(config.httpsPort, () => {
  console.log('RUNNING HTTPS SERVER ON PORT', config.httpsPort)
})
