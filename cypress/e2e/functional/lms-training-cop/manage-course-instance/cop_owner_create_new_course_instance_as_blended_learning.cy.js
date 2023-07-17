import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import CopOwnerCreateInstance from '../../../../classes/lms-training-cop/create-instance/CopOwnerCreateInstance'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  context(Story.manageCourseInstance, () => {
    console.log(`CoP Owner create new instance as Blended Learning`)
    const copOwnerCreateInstance = new CopOwnerCreateInstance()
    copOwnerCreateInstance.setDeliveryMethod(DeliveryMethod.BLENDED_LEARNING)
    copOwnerCreateInstance.setTicketNumber('QA-911')
    copOwnerCreateInstance.execute()
  })
})
