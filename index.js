const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
// request handlers
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
// defining router
const router = {
  sample: handlers.sample
}
// initialize the server
const server = http.createServer((req, res) => {
  // get url and parse it
  const parsedUrl = url.parse(req.url, true)
  // get path
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  // get query string as an object
  const queryStringObject = parsedUrl.query
  // get the http method
  const method = req.method.toLowerCase()
  // get the headers as an object
  const headers = req.headers
  // get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()
    // check for correct handler
    const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound
    // construct the data object to send to handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      buffer: buffer
    }

    chosenHandler(data, (statusCode, payload) => {
      // setting default status code
      statusCode = typeof statusCode === 'number' ? statusCode : 200
      // setting default payload
      payload = typeof payload === 'object' ? payload : {}
      const payloadString = JSON.stringify(payload)
      // return response
      res.writeHead(statusCode)
      res.end(payloadString)
    })
    console.log('Request recived on path:', trimmedPath)
    console.log('with method:', method)
    console.log('and with parameters:', queryStringObject)
    console.log('and with headers:', headers)
    console.log('and with payload:', buffer)
  })
})

server.listen(3000, () => {
  console.log('Server started on 3000')
})
