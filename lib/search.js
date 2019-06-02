const multiDocset = require('multi-docset')

function bindSearchHandler(multi) {
  function handler(req, res, next) {
    const searchExpr = req.query.expr
    const out = multi.merged(searchExpr)
    res.send(out)
    return next()
  }

  return handler
}

function makeSearchHandler(cfg) {
  const multi = multiDocset(cfg)
  const handler = bindSearchHandler(multi)
  return handler
}

module.exports = {
  bindSearchHandler,
  makeSearchHandler,
}
