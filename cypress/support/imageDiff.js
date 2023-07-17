import compareSnapshotCommand from 'cypress-image-diff-js/dist/command'

compareSnapshotCommand()

const portrait = '-p-'
const landscape = '-l-'

const customSnapshotName = (
  subject,
  screenShotName,
  orientation,
  deviceType
) => {
  orientation == portrait
    ? cy.viewport(deviceType, 'portrait')
    : cy.viewport(deviceType, 'landscape')
  cy.wrap(subject).compareSnapshot(
    screenShotName + orientation + deviceType,
    Cypress.env('snapShot').threshold
  )
}

const orientationSnapshot = (device, isPortrait, screenShotName, subject) => {
  const deviceType = Cypress.env('snapShot')[device]
  if (isPortrait) {
    customSnapshotName(subject, screenShotName, portrait, deviceType)
  } else {
    customSnapshotName(subject, screenShotName, landscape, deviceType)
  }
}

Cypress.Commands.add(
  'compareMobileSnapshot',
  { prevSubject: 'optional' },
  (subject, screenShotName, isPortrait = true) => {
    if (subject && screenShotName && Cypress.env('enableSnapshot')) {
      orientationSnapshot('mobile', isPortrait, screenShotName, subject)
    }
  }
)

Cypress.Commands.add(
  'compareTabletSnapshot',
  { prevSubject: 'optional' },
  (subject, screenShotName, isPortrait = true) => {
    if (subject && screenShotName && Cypress.env('enableSnapshot')) {
      orientationSnapshot('tablet', isPortrait, screenShotName, subject)
    }
  }
)

Cypress.Commands.add(
  'compareDesktopSnapshot',
  { prevSubject: 'optional' },
  (subject, screenShotName, isPortrait = true) => {
    if (subject && screenShotName && Cypress.env('enableSnapshot')) {
      orientationSnapshot('desktop', isPortrait, screenShotName, subject)
    }
  }
)
