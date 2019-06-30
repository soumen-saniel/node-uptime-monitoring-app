/**
 * Requiest handlers
 */

// Dependencies

// Define the handlers
const handlers = {}

// Users handler
handlers.users = function (data, callback) {
  const acceptableMethods = ['get', 'post', 'put', 'delete']
  if (acceptableMethods.includes(data.method)) {
    handlers._users[data.method](data, callback)
  } else {
    callback(405)
  }
}

// Container for user submethods
handlers._users = {}

// Users - get
handlers._users.get = function (data, callback) {

}

// Users - post
handlers._users.post = function (data, callback) {
  
}

// Users - put
handlers._users.put = function (data, callback) {
  
}

// Users - delete
handlers._users.delete = function (data, callback) {
  
}

// Sample handler
handlers.ping = function (data, callback) {
  callback(200)
}

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404)
}

// Export handlers from the module
module.exports = handlers   
