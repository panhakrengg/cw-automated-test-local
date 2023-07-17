import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

export default class LogActivityLibraryYaml {
  #logActivityLibraryYaml = 'lms-admin/lms-change-log/log-activity-library'
  #auSOActivityFilePdfLog = 'NewActivityLibrary.file.auSOActivityFilePdfLog'
  #editFileActivityLibrary = 'EditActivityLibrary.file'
  #sOActivityFileArchiveLog = 'ArchiveActivityLibrary.file.sOActivityFileArchiveLog'
  #sOActivityFileUnarchiveLog = 'UnarchiveActivityLibrary.file.sOActivityFileUnarchiveLog'
  #auSOActivityFileDeleteLog = 'DeleteActivityLibrary.file.auSOActivityFileDeleteLog'

  getUrlId(obj) {
    return EntryYamlManagement._getUrlId(obj)
  }

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#logActivityLibraryYaml, entryPath, callback)
  }

  getAuSOActivityFilePdfLog(callback) {
    this.#readYamlData(this.#auSOActivityFilePdfLog, callback)
  }

  getEditFileActivityLibrary(callback) {
    this.#readYamlData(this.#editFileActivityLibrary, callback)
  }

  getSOActivityFileArchiveLog(callback) {
    this.#readYamlData(this.#sOActivityFileArchiveLog, callback)
  }

  getSOActivityFileUnarchiveLog(callback) {
    this.#readYamlData(this.#sOActivityFileUnarchiveLog, callback)
  }

  getAuSOActivityFileDeleteLog(callback) {
    this.#readYamlData(this.#auSOActivityFileDeleteLog, callback)
  }
}
