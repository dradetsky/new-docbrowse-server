const fs = require('fs').promises
const path = require('path')

const yaml = require('yaml')

async function loadCfg(cfgfile) {
  const text = await fs.readFile(cfgfile, 'utf8')
  const data = yaml.parse(text)
  return data
}

function popCfg(cfg) {
  const out = Object.assign({}, cfg)
  const files = cfg.docsets.take.map(name => {
    const dir = `${name}.docset`
    return path.join(cfg.docsets.path, dir)
  })
  out.docsets.files = files
  return out
}

async function loadPopCfg(cfgfile) {
  return loadCfg(cfgfile).then(popCfg)
}

module.exports = {
  loadPopCfg
}
