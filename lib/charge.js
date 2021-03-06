var parseArgs = require('minimist')
var fs = require('fs')
var path = require('path')

var pkg = require('../package.json')
var Exporter = require('./index')
var argOptions = require('./options')

// Logging
const debug = require('debug')
const logger = debug('electronpdf:')

var argv = parseArgs(process.argv.slice(2), argOptions)
var input = argv._[0] || argv.input
var output = argv._[1] || argv.output

if (argv.version) {
  console.log('v' + pkg.version)
  process.exit(0)
}

if (argv.help || !input || !output) {
  usage(1)
} else {
  var exporter = new Exporter()
  exporter.on('charged', () => {
    exporter.createJob(input, output, argv).then(job => {
      job.on('job-complete', () => {
        logger('Export Complete')
        exporter.stop()
      })
      job.render()
    })
  })
  exporter.start()
}

function usage (code) {
  var rs = fs.createReadStream(path.join(__dirname, '../usage.txt'))
  rs.pipe(process.stdout)
  rs.on('close', function () {
    if (code) process.exit(code)
  })
}
