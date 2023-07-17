const { defineConfig } = require('cypress')
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')
const AllureWriter = require('@shelex/cypress-allure-plugin/writer')
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin')
const xlsx = require('node-xlsx').default
const csv = require('node-csv').createParser()
const fs = require('fs')
const { isFileExist } = require('cy-verify-downloads')
const path = require('path')
const pdf = require('pdf-parse/lib/pdf-parse')
const etherealAccount = require('./cypress/classes/utilities/email/ethereal_account')
const FailedSpecs = require('./cypress/classes/utilities/FailedSpecs')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents: async (on, config) => {
      let eUser = null
      getCompareSnapshotsPlugin(on, config)
      AllureWriter(on, config)
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chrome') {
          launchOptions.args.push('--start-fullscreen')
          return launchOptions
        }
      })
      on('after:run', (results) => {
        if (results.totalFailed) {
          FailedSpecs.writeFailedSpecs(results)
        }
      })
      on('task', {
        downloadFile,
        isFileExist,
        readPdf(pathToPdf) {
          return new Promise((resolve) => {
            const pdfPath = path.resolve(pathToPdf)
            let dataBuffer = fs.readFileSync(pdfPath)
            pdf(dataBuffer).then(function (text) {
              resolve(text)
            })
          })
        },
        parseXlsx({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = xlsx.parse(fs.readFileSync(filePath))
              resolve(jsonData)
            } catch (e) {
              reject(e)
            }
          })
        },
        parseCsv({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = csv.parse(fs.readFileSync(filePath))
              resolve(jsonData)
            } catch (e) {
              reject(e)
            }
          })
        },
        async loginEthereal(fileUser) {
          eUser = await etherealAccount(fileUser)
          return eUser
        },
        getE() {
          return eUser.getLastEmail()
        },
        deleteSeenEmails() {
          return eUser.deleteSeenEmails()
        },
        searchEmail(subject) {
          return eUser.searchEmail(subject)
        },
      })
      require('@cypress/grep/src/plugin')(config)
      return config
    },
    baseUrl: 'https://uat-connect.crosswired.com',
    watchForFileChanges: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    // specPattern: 'cypress/e2e/functional/lms-admin/course-instance',
    defaultCommandTimeout: 100000,
    numTestsKeptInMemory: 100,
    requestTimeout: 15000,
    pageLoadTimeout: 100000,
    responseTimeout: 120000,
    chromeWebSecurity: false,
    scrollBehavior: 'top',
    redirectionLimit: 350,
    slowTestThreshold: 1000,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
})
