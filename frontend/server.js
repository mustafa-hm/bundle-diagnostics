const path = require('path')
const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist')
})

fastify.listen({
  host: '0.0.0.0',
  port: process.env.PORT || 3000,
}, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
