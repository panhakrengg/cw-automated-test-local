import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import CoPDiscussionNotificationOCoP from '../../../../classes/discussion/base/CoPDiscussionNotificationOCoP'
import SignInAs from '../../../../classes/utilities/SignInAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.CoPDiscussions, () => {
  const copDiscussion = new CoPDiscussionNotificationOCoP()
  let communityName, communityUrl, category, categoryName, author

  const receiveNotification = () => {
    copDiscussion.actionNotification.clickIconNotification()
    copDiscussion.assertionThreadNotification.expectToSeeCreatedNewCategoryNotification(
      author,
      communityName,
      categoryName
    )

    cy.logInTestCase('Reset: remove notification')
    copDiscussion.actionNotification.removeNotificationByBadgeDesc(categoryName)
  }
  const notReceiveNotification = () => {
    copDiscussion.actionNotification.clickIconNotification()
    copDiscussion.assertionThreadNotification.expectNotToSeeNotification(categoryName)
  }

  context(Story.copDiscussionNotificationOCoP, () => {
    before(() => {
      copDiscussion.yaml.getNewCategoriesOCoPFuncDiscussionNotify((data) => {
        const cop = data
        communityName = cop.name
        communityUrl = cop.url

        category = cop.discussions.categories.auKendallNewCategory
        categoryName = category.name
      })

      cy.stubUser(UserRole.CoPAdministrationUser.ADMIN_KENDAL).then((user) => {
        author = user.fullName
      })
    })

    it('CoP Admin create new category then cop-owner, another cop-admin, cop-member check notification - OCoP', () => {
      Story.ticket('QA-1317')
      copDiscussion.login.copAdminKendal(communityUrl)

      cy.logInTestCase('Reset: remove category')
      copDiscussion.actionDiscussion.clickAllCategories()
      copDiscussion.actionDiscussion.removeCategories(categoryName)

      cy.logInTestCase('Create then publish new category')
      copDiscussion.actionDiscussion.createThenPublishNewCategory(category)
      copDiscussion.assertionDiscussion.expectToOpenCategoryDetail(categoryName)

      cy.logInTestCase('Author check notification')
      notReceiveNotification()

      cy.logInTestCase('CoP Owner check notification')
      SignInAs.copOwner_Kristy()
      receiveNotification()

      cy.logInTestCase('CoP Admin check notification')
      SignInAs.copAdmin_Bettye()
      receiveNotification()

      cy.logInTestCase('CoP Member check notification')
      SignInAs.copMember_Enola()
      notReceiveNotification()
    })
  })
})
