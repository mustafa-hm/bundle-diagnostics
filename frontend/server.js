const fastify = require('fastify')({logger: true})
const path = require('path')

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist')
})

fastify.listen({ port: process.env.PORT || 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
