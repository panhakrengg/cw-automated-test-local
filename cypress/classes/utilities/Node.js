import Environment from '../base/Environment'

class Node extends Environment {
  liferayNodeZero
  liferayNodeOne
  liferayBothNode

  constructor() {
    super()
    this.liferayNodeZero = 0
    this.liferayNodeOne = 1
    this.liferayBothNode = 2
  }

  escapeStepWithNodeProblem(nodeNumber, currentSystem = false, stepCallBack = () => {}) {
    cy.get('meta[name="environment"]')
      .invoke('attr', 'content')
      .then(($node) => {
        const bothNode = nodeNumber == this.liferayBothNode
        const onlyNode = $node.includes(nodeNumber.toString())
        const result = `These step of test case has problem with ${
          bothNode ? 'both nodes' : `node ${$node}`
        }`
        if (currentSystem && (bothNode || onlyNode)) {
          return expect(result).to.exist
        } else {
          stepCallBack()
        }
      })
  }
}

export default Node
