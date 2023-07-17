const cwAliasTable = 'cwTable'
const cwAliasTh = 'cwTableTh'
const cwElementTable = 'table.cw-table'
const cecElementTable = 'table.cec-table'
let tmpHeader = ''
let tmpTable = ''
let tmpIndex = 0

/* Example: Multiple tables in the same page
cy.cwTable('tableAdmin', 'tableHeaderArticle')
cy.cwTable('tableMember', 'tableMemberHeader', 1)

cy.get('@tableAdmin').within(($table) => {
  cy.wrap($table).getTableHeader('Member name')
  cy.wrap($table).getTableHeader('Managed by')
})
*/
const waitRowRender = () => {
  cy.get(`@${tmpTable}`)
    .find('tr:first-child')
    .then(() => {
      cy.wait(100)
    })
}

Cypress.Commands.add(
  'cwTable',
  (aliasTable = cwAliasTable, aliasTh = cwAliasTh, index = 0) => {
    tmpHeader = aliasTh
    tmpTable = aliasTable
    cy.setCwTableHeader(aliasTh)
    cy.get(cwElementTable).eq(index).as(aliasTable)
    waitRowRender()

    return cy.get(`@${tmpTable}`)
  }
)

Cypress.Commands.add(
    'cecTable',
    (aliasTable = cwAliasTable, aliasTh = cwAliasTh, index = 0) => {
        tmpHeader = aliasTh
        tmpTable = aliasTable
        cy.get('thead > tr > th').as(aliasTh)
        cy.get(cecElementTable).eq(index).as(aliasTable)
        waitRowRender()

        return cy.get(`@${tmpTable}`)
    }
)

Cypress.Commands.add('setCwTableHeader', (aliasTh) => {
  cy.get('thead > th').as(aliasTh)
})

Cypress.Commands.add(
  'getTableHeader',
  { prevSubject: 'optional' },
  (subject, columnName) => {
    if (subject) {
      return cy
        .wrap(subject)
        .get('thead > th')
        .filter(`:contains(${columnName})`)
    } else {
      cy.get(`@${tmpHeader}`).filter(`:contains(${columnName})`)
    }
  }
)

Cypress.Commands.add('getAllTableRows', () => {
  cy.get('tbody > tr')
} )

Cypress.Commands.add( 'getTableRow', ( rowNumber ) => {
  cy.get('tbody > tr').eq(rowNumber)
})

Cypress.Commands.add('getTableColumn',
  (rowNumber, columnNumber, extraSelector) => {
  cy.wrap(null).as('column')
  cy.getTableRow(rowNumber).within(($row) => {
    if (extraSelector) {
      cy.wrap($row)
        .get(`td > div > ${extraSelector}`)
        .eq(columnNumber)
        .as('column')
    } else {
      cy.wrap($row)
        .get('td > div')
        .eq(columnNumber)
        .as('column')
    }
  })
  return cy.get('@column')
})

// Chainable command after cwTable

// Example: cy.cwTable().theadByName()
Cypress.Commands.add(
  'theadByName',
  { prevSubject: 'optional' },
  (subject, columnName) => {
    if (subject) {
      return cy
        .wrap(subject)
        .get('thead th span')
        .filter(`span:contains("${columnName}")`)
        .parent('a')
    }
  }
)

// Example:
// cy.get('@cwTable').within(($table) => {
//   cy.wrap($table).rowName()
// })
Cypress.Commands.add(
  'rowName',
  { prevSubject: 'optional' },
  (subject, text) => {
    const ele = subject ? cy.wrap(subject) : cy
      return ele
        .get(`tbody tr td:contains("${text}")`)
        .parents('tr')
  }
)

// Example: cy.cwRowName()
Cypress.Commands.add('cwRowName', (text, column = 1) => {
  return cy
    .get(`@${tmpTable}`)
    .get(`tbody tr td:nth-child(${column})`)
    .contains(text)
    .parents('tr')
})

// Example: cy.cwTable().clickRowName()
Cypress.Commands.add(
  'clickRowName',
  { prevSubject: 'optional' },
  (subject, text) => {
    if (subject) {
      return cy.wrap(subject).get(`tbody tr td a:contains("${text}")`).click()
    }
  }
)

// Example: cy.cwTable().row()
Cypress.Commands.add('row', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('tbody tr')
  } else {
    cy.get('tbody tr')
  }
})
Cypress.Commands.add(
  'rowCheckbox',
  { prevSubject: 'optional' },
  (subject, text) => {
    if (subject) {
      return cy.wrap(subject).rowName(text).find('[type="checkbox"]')
    } else {
      return cy.cwTable().rowName(text).find('[type="checkbox"]')
    }
  }
)
Cypress.Commands.add(
  'getValueFromCellByRowName',
  { prevSubject: 'optional' },
  (subject, rowName, columnIndex) => {
    if (subject) {
      return cy.wrap(subject).rowName(rowName).find('td').eq(columnIndex)
    }
    return cy.cwTable().rowName(rowName).find('td').eq(columnIndex)
  }
)
Cypress.Commands.add(
  'clickTableHeader',
  { prevSubject: 'optional' },
  (subject, columnName) => {
    if (subject) {
      cy.wrap(subject).getTableHeader(columnName).find('a').click()
    } else {
      cy.getTableHeader(columnName).find('a').click()
    }
  }
)
Cypress.Commands.add(
  'selectRowCheckboxByIndex',
  { prevSubject: 'optional' },
  (subject, index) => {
    const ele = subject ? cy.wrap(subject) : cy
    ele.row().eq(index).find('[type="checkbox"]').check()
  }
)
Cypress.Commands.add(
  'getTableDataByIndex',
  { prevSubject: 'optional' },
  (subject, index) => {
    return cy.wrap(subject).get(`td:nth-child(${index})`)
  }
)

Cypress.Commands.add(
  'getCellData',
  (columnName, itcAlias, isNotJsonObject = false) => {
    const getResultData = (result, parseJson) =>
      (parseJson ? JSON.parse(result) : result)['data']
    const initCellData = (result) => {
      cy.wrap(
        result
          .filter((data) => !!data[columnName])
          .map((data) => data[columnName])
      ).as('cellData')
    }
    cy.get(`@itc${itcAlias}`).then((resolve) => {
      let body = resolve.response['body']
      if (body['success']) {
        initCellData(getResultData(body['result'], isNotJsonObject))
      }
    })

    return cy.get('@cellData')
  }
)

Cypress.Commands.add(
  'expectItemNameWithIndex',
  { prevSubject: 'optional' },
  (subject, index, itemName) => {
    if (subject) {
      cy.wrap(subject).eq(index).should('contain.text', itemName)
    } else {
      cy.get(`@${tmpHeader}`).eq(index).should('contain.text', itemName)
    }
  }
)

Cypress.Commands.add(
  'getCellByRowColumnIndex',
  { prevSubject: 'optional' },
  (subject, rowIndex, columnIndex) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.row().eq(rowIndex).find('td').eq(columnIndex)
  }
)

Cypress.Commands.add(
  'expectValueByRowColumnIndex',
  { prevSubject: 'optional' },
  (subject, rowIndex, columnIndex, value) => {
    const ele = subject ? cy.wrap(subject) : cy
    ele
      .getCellByRowColumnIndex(rowIndex, columnIndex)
      .should('contain.text', value)
  }
)

Cypress.Commands.add('getTableWrapper', { prevSubject: 'optional' }, (subject, index = 0) => {
  const ele = subject ? cy.wrap(subject) : cy
  return ele.get('.table-wrapper').eq(index)
})
