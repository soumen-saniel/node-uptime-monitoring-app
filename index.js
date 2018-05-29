const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
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

    // send response
    res.end('Hello World!\n')
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
