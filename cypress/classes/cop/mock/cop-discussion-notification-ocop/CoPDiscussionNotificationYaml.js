import EntryYamlManagement from '../../../utilities/EntryYamlManagement'

class CoPDiscussionNotificationYaml {
  #copDiscussionNotificationPath = 'cop-discussion/cop_discussion_notification'
  #newThreadsOCoPFuncDiscussionNotify = 'NewThreads.oCoPFuncDiscussionNotify'
  #newCategoriesOCoPFuncDiscussionNotify = 'NewCategories.oCoPFuncDiscussionNotify'
  #communitiesOCoPFuncDiscussionNotify = 'Communities.oCoPFuncDiscussionNotify'
  #replyThreadOCoPFuncDiscussionNotify = 'ReplyThread.oCoPFuncDiscussionNotify'

  #readYamlData(entryPath, callback) {
    EntryYamlManagement._readDataEntry(this.#copDiscussionNotificationPath, entryPath, callback)
  }

  getNewThreadsOCoPFuncDiscussionNotify(callback) {
    this.#readYamlData(this.#newThreadsOCoPFuncDiscussionNotify, callback)
  }

  getNewCategoriesOCoPFuncDiscussionNotify(callback) {
    this.#readYamlData(this.#newCategoriesOCoPFuncDiscussionNotify, callback)
  }

  getCommunitiesOCoPFuncDiscussionNotify(callback) {
    this.#readYamlData(this.#communitiesOCoPFuncDiscussionNotify, callback)
  }

  getReplyThreadOCoPFuncDiscussionNotify(callback) {
    this.#readYamlData(this.#replyThreadOCoPFuncDiscussionNotify, callback)
  }
}

export default CoPDiscussionNotificationYaml
