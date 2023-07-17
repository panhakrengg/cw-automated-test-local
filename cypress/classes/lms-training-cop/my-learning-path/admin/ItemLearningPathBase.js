import { MyLearningPath } from '../../../constants/MyLearningPath'

class ItemLearningPathBase {

  getSideBar() {
    return cy.get(MyLearningPath.sideBarAlias)
  }
}

export default ItemLearningPathBase
