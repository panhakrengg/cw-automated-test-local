import Environment from '../base/Environment'
import InterceptReq from '../base/InterceptReq'
import DateFormat from '../format-collections/DateFormat'
import DateUtil from '../utilities/DateUtil'
import YamlHelper from '../utilities/YamlHelper'
import Field from '../constants/Field'

class Notes {
  #notes

  #itcModifyNote = new InterceptReq('/course_instance_note/modify', 'modifyNote')

  #itcRemoveNote = new InterceptReq('/course_instance_note/remove', 'removeNote')

  setNotes(notes) {
    this.#notes = notes
  }

  verifyNotesPage() {
    this.verifyAddNewNote()
    console.log(this.#notes)
    if (this.#notes.hasOwnProperty('note')) {
      this.verifyNote(this.#notes, 'users-orgmgt')
    } else {
      Object.entries(this.#notes).forEach((note) => {
        this.verifyNote(note[1])
      })
    }
  }

  verifyNote(note, yamlFileName = 'users') {
    cy.getCurrentLoginUserScreenName().then((currentUserScreenName) => {
      const noteText = note.note
      new YamlHelper(yamlFileName)
        .read()
        .its(note.user)
        .then((response) => {
          const user = response.users[new Environment().getEnvYaml()]
          const fullName = user.hasOwnProperty('fullNames')
            ? user.fullNames
            : user.givenNames + ' ' + user.familyNames
          this.#expectToSeeNoteDetail(
            noteText,
            fullName,
            user.screenNames[0],
            currentUserScreenName
          )
        })
    })
  }

  #expectToSeeNoteDetail(noteText, fullName, screenName, currentUserScreenName) {
    this.getNote(noteText)
      .eq(0)
      .within(($note) => {
        cy.wrap($note).should('be.visible')
        const fullNameSelector = `.cec-card__headline:contains("${fullName}")`
        if (screenName === currentUserScreenName) {
          this.verifyOwnerNoteThreeDot($note, fullName, noteText)
          this.#expectToSeeNoteUserName($note, fullNameSelector)
        } else {
          cy.wrap($note).should('not.have.class', '.dropdown-three-dots')
          const screenNameSelector = `.cec-card__headline:contains("${screenName}")`
          this.#expectToSeeNoteUserName($note, fullNameSelector + ',' + screenNameSelector)
        }
      })
  }

  #expectToSeeNoteUserName(note, selector) {
    cy.wrap(note).find(selector).should('be.visible')
  }

  verifyOwnerNoteThreeDot($parent, fullName, noteText) {
    cy.wrap($parent).getThreeDots().click()
    cy.wrap($parent).clickDropdownName(Field.EDIT)
    cy.wrap($parent)
      .swal2()
      .within(($popup) => {
        cy.wrap($popup).should('be.visible')
        cy.wrap($popup).find('.swal2-title').should('contain.text', 'Edit note')
        cy.wrap($popup).find('span.font-weight-bold').should('contain.text', fullName)
        cy.wrap($popup).find('textarea').should('contain.value', noteText)
        cy.wrap($popup)
          .find('button:contains("Update")')
          .should('be.visible')
          .and('not.have.attr', 'disabled')
      })
      .closeSwal2()
    cy.wrap($parent).getThreeDots().click()
    cy.wrap($parent).clickDropdownName(Field.DELETE)
    cy.wrap($parent).verifySwal2Confirmation(
      'Are you sure you want to remove this note?',
      Field.NOTE_THIS_ACTION_CANNOT_BE_UNDONE,
      Field.YES_REMOVE,
      Field.CANCEL
    )
  }

  getNote(noteText) {
    return cy.get(`.border-bottom-style-dash-list:contains("${noteText}")`)
  }

  getNotes() {
    return cy.get('.note-wrapper > .border-bottom-style-dash > .border-bottom-style-dash-list')
  }

  verifyAddNewNote() {
    cy.getElementByLabel('Note')
      .should('have.attr', 'placeholder', 'Start typing a note here')
      .and('have.value', '')
    this.getAddButton().should('be.visible').and('have.attr', 'disabled')
  }

  getAddButton() {
    return cy.get('button:contains("Add")')
  }

  create(noteText) {
    this.#itcModifyNote.set()
    cy.get('textarea[placeholder = "Start typing a note here"]').clear().type(noteText)
    this.getAddButton().click()
    this.#itcModifyNote.wait()
  }

  delete(noteText) {
    this.getNotes().then(($notes) => {
      if ($notes.find(`p.text-muted:contains("${noteText}")`).length) {
        this.getNote(noteText)
          .eq(0)
          .within(($noteText) => {
            cy.wrap($noteText).getThreeDots().click()
            cy.wrap($noteText).clickDropdownName(Field.DELETE)
            this.#itcRemoveNote.set()
            cy.wrap($noteText).swal2Confirm(Field.YES_REMOVE).click()
            this.#itcRemoveNote.wait()
          })
      }
    })
  }

  expectNowDate(noteText) {
    this.getNote(noteText)
      .eq(0)
      .find('p.text-muted')
      .should('contain.text', noteText)
      .parent()
      .find('.cec-card__header > span.cec-card__datetime')
      .should(
        'contain.text',
        new DateUtil().getCurrentDate(DateFormat.CREATED_NOTE_DATE_TIME_FORMAT)
      )
  }

  edit(noteText, editNoteText) {
    this.getNote(noteText)
      .eq(0)
      .within(($noteText) => {
        cy.wrap($noteText).getThreeDots().click()
        cy.wrap($noteText).clickDropdownName(Field.EDIT)
      })
    cy.get('.swal2-popup').within(($popup) => {
      cy.wrap($popup).get('textarea').eq(0).clear().type(editNoteText)
      this.#itcModifyNote.set()
      cy.wrap($popup).get('button:contains("Update")').click()
      this.#itcModifyNote.wait()
    })
  }

  getNotePosition(noteText) {
    cy.wrap(null).as('position')
    this.getNotes().each(($ele, index) => {
      if ($ele.text().includes(noteText)) {
        cy.wrap(index + 1).as('position')
      }
    })
    return cy.get('@position')
  }

  expectNoteOnTop(noteText) {
    this.getNotes().eq(0).should('contain.text', noteText)
  }

  verifyDuplicatedNote(notedText) {
    this.getNote(notedText).then(($note) => {
      expect($note).to.have.length.gt(1)
      cy.get($note)
        .eq(0)
        .find('.cec-card__header > .cec-card__datetime')
        .invoke('text')
        .then(($firstNoteDate) => {
          cy.get($note)
            .eq(1)
            .find('.cec-card__header > .cec-card__datetime')
            .invoke('text')
            .then(($secondNoteDate) => {
              expect($firstNoteDate).to.not.equal($secondNoteDate)
            })
        })
    })
  }
}

export default Notes
