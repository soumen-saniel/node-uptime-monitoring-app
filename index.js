const http = require('http')
const url = require('url')
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
  // send response
  res.end('Hello World!\n')
  console.log('Request recived on path', trimmedPath)
  console.log('with method:', method)
  console.log('and with parameters', queryStringObject)
})

server.listen(3000, () => {
  console.log('Server started on 3000')
})
