import LearningQueries from '../queries/LearningQueries'

class LearningAssertions extends LearningQueries {
  expectNotToSeeFilterItemByCategoryType(type, filterItem) {
    super.getFilterItemsWrapper(type).within(() => {
      cy.expectElementWithLabelNotExist(filterItem, 'li.checkbox-wrapper')
    })
  }

  expectToSeeFilterItemByCategoryType(type, filterItem) {
    super.getFilterItemsWrapper(type).within(() => {
      cy.expectElementWithLabelVisible(filterItem, 'li.checkbox-wrapper')
    })
  }
}

export default LearningAssertions
