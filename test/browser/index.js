'use strict'

let webdriver = require('selenium-webdriver')
let webserver = require('./webserver')
let username = process.env.SAUCE_USERNAME
let accessKey = process.env.SAUCE_ACCESS_KEY
let driver

if (!username) throw new Error('Saucelabs username required')
if (!accessKey) throw new Error('Saucelabs access key required')

driver = new webdriver.Builder()
  .withCapabilities({
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'version': 'latest',
    'username': username,
    'accessKey': accessKey
  })
  .usingServer(`http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`)
  .build()

webserver.start().listen(parseInt(webserver.port), () => {
  console.info(`web server listening on ${webserver.port}`)
  driver.get(`http://localhost:${webserver.port}/index.html`)

  driver.getTitle().then(function (title) {
    console.log('title is: ' + title)
  })

  driver.quit()
})
