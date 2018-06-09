const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

// Initialize server
const server = http.createServer((req, res) => {
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
})

// Request handlers
const handlers = {}
handlers.sample = (data, callback) => {
  const statusCode = 200
  callback(statusCode, { name: 'sample handler' })
}
// Not found handler
handlers.notFound = (data, callback) => {
  const statusCode = 400
  callback(statusCode)
}

// Router
const router = {
  sample: handlers.sample
}

// Start server
server.listen(8000, () => {
  console.log('RUNNING SERVER ON PORT 8000')
})
