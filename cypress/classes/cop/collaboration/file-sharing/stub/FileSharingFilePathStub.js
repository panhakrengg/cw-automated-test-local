import { SourceType } from '../base-file-sharing/FileSharingConstant'

export const Source = Object.freeze({
  base: 'cypress/fixtures/cop-file-sharing/attachments/',
  supportFileUploadVersion:
    'cypress/fixtures/cop-file-sharing/attachments/' + 'support-file-upload-version/',
})

class FileSharingFilePathStub {
  static getFilePath(path = SourceType.base) {
    switch (path) {
      case SourceType.base:
        return Source.base
      case SourceType.supportFileUploadVersion:
        return Source.supportFileUploadVersion
    }
  }
}

export default FileSharingFilePathStub
