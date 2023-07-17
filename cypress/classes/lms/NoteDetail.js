import Notes from '../lms-training-cop/Notes'

class NoteDetail extends Notes {
  constructor(object) {
    super()
    if (object.hasOwnProperty('notes')) {
      super.setNotes(object.notes)
    } else {
      super.setNotes(object)
    }
  }

  _verifyNoteOverview() {
    super.verifyNotesPage()
  }
}
export default NoteDetail
