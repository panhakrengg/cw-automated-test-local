class Size {
  static kiloBytes() {
    return 1024
  }
  static megaBytes() {
    return Math.pow(this.kiloBytes(), 2)
  }
  static gigaBytes() {
    return Math.pow(this.kiloBytes(), 3)
  }
}

export default Size
