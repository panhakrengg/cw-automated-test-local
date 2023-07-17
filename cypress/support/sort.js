import Converter from '../classes/utilities/Converter'
import Size from '../classes/utilities/Size'

Cypress.Commands.add('expectSortAscending', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).then((data) => {
    const actualData = data.slice()
    expect(actualData).to.deep.eq(data.sort())
  })
})

Cypress.Commands.add('expectSortDescending', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).then((data) => {
    const actualData = data.slice()
    expect(actualData).to.deep.eq(data.sort().reverse())
  })
})

const formatBytes = (byteItem) => {
  const type = Converter.getStringFrom(byteItem)
  const value = Converter.getNumberFrom(byteItem)
  if (type == 'B') return value
  else if (type == 'KB') return value * Size.kiloBytes()
  else if (type == 'MB') return value * Size.megaBytes()
  else if (type == 'GB') return value * Size.gigaBytes()
}

Cypress.Commands.add('expectByteSortDescending', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).then((data) => {
    const actualData = data.slice()
    expect(actualData).to.deep.eq(
      data.sort((a, b) => {
        return formatBytes(b) - formatBytes(a)
      })
    )
  })
})

Cypress.Commands.add('expectByteSortAscending', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).then((data) => {
    const actualData = data.slice()
    expect(actualData).to.deep.eq(
      data.sort((a, b) => {
        return formatBytes(a) - formatBytes(b)
      })
    )
  })
})

Cypress.Commands.add('expectLocaleCompareSortAscending', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).then((data) => {
    const actualData = data.slice()
    expect(actualData).to.deep.eq(Cypress._.orderBy(data, '', 'asc'))
  })
})

Cypress.Commands.add(
  'expectLocaleCompareSortDescending',
  { prevSubject: 'optional' },
  (subject) => {
    cy.wrap(subject).then((data) => {
      const actualData = data.slice()
      expect(actualData).to.deep.eq(Cypress._.orderBy(data, '', 'desc'))
    })
  }
)
