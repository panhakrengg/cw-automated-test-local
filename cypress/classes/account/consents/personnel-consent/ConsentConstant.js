import Field from '../../../constants/Field'

class ConsentConstant {
  static options = [Field.VIEW, Field.EDIT, Field.REVOKE]
  static consentTabs = [
    { index: 0, name: 'Communities' },
    { index: 1, name: 'Courses' },
    { index: 2, name: 'Others' },
  ]
  static communityDetailLabels = [
    { index: 0, label: 'given' },
    { index: 1, label: 'last changed' },
  ]
  static courseDetailLabels = [
    { index: 0, label: 'join' },
    { index: 1, label: 'last changed' },
  ]

  static otherDetailLabels = this.communityDetailLabels
}

export default ConsentConstant
