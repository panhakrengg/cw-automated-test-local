const fs = require('fs')
const failedSpecsFile = './.failedspecs/failed_specs.txt'

class FailedSpecs {
  static writeFailedSpecs = (results) => {
    const failedSpecs = results.runs
      .filter((r) => r.stats.failures)
      .map((r) => r.spec.relative.concat(','))
      .toString()
    fs.writeFileSync(failedSpecsFile, failedSpecs, { flag: 'a+' })
    console.log(`***${results.totalFailed} Failed Specs Has Been Written To The File***`)
  }
}

module.exports = FailedSpecs
