import YamlHelper from './YamlHelper'

export class NonCWUsersMock {
  readNonCwUserFromYaml(num) {
    return new YamlHelper('non-cw-users').read().its(`cw${num}`)
  }

  getNonCwUser03() {
    return this.readNonCwUserFromYaml('03')
  }

  getNonCwUser06() {
    return this.readNonCwUserFromYaml('06')
  }
}
