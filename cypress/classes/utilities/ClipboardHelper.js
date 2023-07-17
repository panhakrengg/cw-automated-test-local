class ClipboardHelper {
  static expectClipboardValueEqual(value, copyCallback) {
    let clipboardValue = ''
    cy.document().then((document) => {
      document.oncopy = (e) => (clipboardValue = e.target['value'])
    })
    cy.wrap(copyCallback()).then(() => expect(clipboardValue).to.include(value))
    cy.document().then((document) => (document.oncopy = null))
  }
}

export default ClipboardHelper
