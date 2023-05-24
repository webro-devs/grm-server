class ExcelDataValidation {
  private message = {};
  constructor(private data) {}

  public validate() {
    this.checkProperties(this.data);
    this.checkType(this.data);
    this.checkValue(this.data);
    return this.message;
  }

  private checkProperties(data) {
    //.....
  }
  private checkType(data) {
    //....
  }
  private checkValue(data) {
    //....
  }
}
