const path = require('path')
const fastify = require('fastify')({ logger: true })

const {
  PORT,
  USERNAME,
  PASSWORD
} = process.env

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist')
})

if (USERNAME && PASSWORD) {
  fastify.register(require('@fastify/basic-auth'), {
    authenticate: {
      realm: 'Application'
    },
    validate: async (username, password) => {
      if (username !== USERNAME || password !== PASSWORD) {
        return new Error('Authentication Failed')
      }
    }
  })
  fastify.after(() => {
    fastify.addHook('onRequest', fastify.basicAuth)
  })
}

fastify.listen({
  host: '0.0.0.0',
  port: PORT || 3000,
}, (err) => {
  if (err) throw err
  // Server is now listening on ${address}
})
