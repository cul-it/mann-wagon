import Config, { environment } from 'webpack-config'

// Default to dev environment
environment.setAll({
  env: () => process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
})

export default new Config().extend('webpack.[env].config.js')
