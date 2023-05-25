class ExcelDataValidation {
  private message = {
    error: false,
    msg: [],
    missingProps: [],
  };
  constructor(private data) {}

  public validate() {
    this.checkProperties(this.data);
    this.checkType(this.data);
    this.checkValue(this.data);
    this.restoreErrors();
    return this.message;
  }

  private checkProperties(data) {
    for (const item of data) {
      const properties = Object.keys(item);
      const expectedProperties = [
        'Collection',
        'Model',
        'Size',
        'Color',
        'Code',
        'Shape',
        'Style',
        'Count',
        'M2',
      ];

      if (properties.length < 9)
        this.message.msg.push('You have less propery!');
      else if (properties.length > 9)
        this.message.msg.push('You have Unexpected property!');

      this.message.missingProps.push(
        ...expectedProperties.filter((item) => !properties.includes(item)),
      );
    }
  }
  private checkType(data) {
    for (const item of data) {
      if (isNaN(item.count)) {
        this.message.msg.push('Count should be a number.');
      } else {
        item.count = item.count * 1;
      }
    }
  }

  private checkValue(data) {
    //....
  }

  private restoreErrors() {
    this.message.missingProps = [...new Set(this.message.missingProps)];
    this.message.msg = [...new Set(this.message.msg)];
    if (this.message.missingProps.length > 0 || this.message.msg.length > 0)
      this.message.error = true;
  }
}
