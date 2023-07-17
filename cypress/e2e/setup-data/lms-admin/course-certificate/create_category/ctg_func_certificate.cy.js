import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import SetUpCategory from '../../../../../classes/lms/admin/categories/SetUpCategory'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'
import SignInLmsAs from '../../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  let ctgObj
  const setupCategory = new SetUpCategory()
  before(() => {
    new YamlHelper('lms-admin/course-certificate/course-certificate')
      .read()
      .then(({ CategoryData }) => {
        ctgObj = CategoryData.ctgFuncCertificate
      })
    new SignInLmsAs().lnAdmin_Emery()
  })

  context(Story.courseCertificate, () => {
    it('Ctg Func Certificate', () => {
      setupCategory.setCategoryObject(ctgObj)

      setupCategory.createNewCategory()
      setupCategory.addUsers()
    })
  })
})
