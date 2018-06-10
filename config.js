const environments = {}

// Staging config
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging'
}

// Production config
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
}

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// Check for the current environment or default to staging
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentToExport
