const fs = require('fs').promises
const path = require('path')

const yaml = require('yaml')

async function loadCfg(cfgfile) {
  const text = await fs.readFile(cfgfile, 'utf8')
  const data = yaml.parse(text)
  return data
}

async function expandDocsetSpec(spec) {
  const contents = await fs.readdir(spec.path)
  if (spec.take && spec.skip) {
    throw new Error('both take & skip')
  } else if (spec.take) {
    return expandTake(contents, spec)
  } else if (spec.skip) {
    return expandSkip(contents, spec)
  } else {
    throw new Error('neither take nor skip')
  }
}

function expandTake(contents, spec) {
  const takeDirs = spec.take.map(name => `${name}.docset`)
  const realDirs = takeDirs.filter(dir => contents.includes(dir))
  const files = realDirs.map(dir => path.join(spec.path, dir))
  return files
}

function expandSkip(contents, spec) {
  const skipDirs = spec.skip.map(name => `${name}.docset`)
  const takeDirs = contents.filter(dir => !(skipDirs.includes(dir)))
  const files = takeDirs.map(dir => path.join(spec.path, dir))
  return files
}

async function loadExpandCfg(cfgfile) {
  const cfgData = await loadCfg(cfgfile)
  const files = await expandDocsetSpec(cfgData.docsets)
  const cfg = Object.assign({}, cfgData)
  cfg.docsets.files = files
  return cfg
}

module.exports = {
  loadExpandCfg,
}
