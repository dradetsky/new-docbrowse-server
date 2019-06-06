const multiDocset = require('multi-docset')

function bindSearchHandler(multi, cfg) {
  function handler(req, res, next) {
    const searchExpr = req.query.expr
    const out = multi.merged(searchExpr, cfg.querying)
    res.send(out)
    return next()
  }

  return handler
}

function bindInfoHandler(multi) {
  function handler(req, res, next) {
    res.send(multi.info())
    return next()
  }

  return handler
}

function makeSearchHandlers(cfg) {
  const multi = multiDocset(cfg.docsets.files)
  multi.sanityCheck()
  const searchHandler = bindSearchHandler(multi, cfg)
  const infoHandler = bindInfoHandler(multi)

  return {searchHandler, infoHandler}
}

module.exports = {
  bindSearchHandler,
  makeSearchHandlers,
}
