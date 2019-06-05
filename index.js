const restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')
 
const { loadExpandCfg } = require('./lib/cfg')
const { makeSearchHandlers } = require('./lib/search')

const cors = corsMiddleware({
  allowHeaders: [
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Origin'
  ]
})

const cfgfile = process.env.DOCBROWSE_SERVER_CFGFILE || 'cfg.yml'

async function start() {
  const cfg = await loadExpandCfg(cfgfile)

  const {searchHandler, infoHandler} = makeSearchHandlers(cfg)

  const server = restify.createServer()

  server.pre(cors.preflight)
  server.use(cors.actual)

  server.use(restify.plugins.queryParser())

  server.get('/search', searchHandler)
  server.get('/info', infoHandler)
  server.get('/*', restify.plugins.serveStaticFiles(cfg.docsets.path))

  await server.listen(cfg.server.port)
  console.log(`running at: ${server.url}`)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

start()
