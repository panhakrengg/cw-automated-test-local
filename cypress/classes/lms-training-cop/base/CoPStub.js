import Environment from '../../base/Environment'

const environment = new Environment()

function copUrl() {
  if (environment.isPrd()) return '/web/tcop-learning-management'
  else return '/web/learn-tennis'
}

function copName() {
  if (environment.isPrd()) return 'TCoP Learning Management'
  else return 'Learn Tennis'
}

export const CoPConst = {
  NAME: copName(),
  URL: copUrl(),
}
