import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

class ExcelDataValidation {
  private message: { error: boolean; msg: string[]; missingProps: string[] } = {
    error: false,
    msg: [],
    missingProps: [],
  };
  private data;

  public validate(data) {
    this.data = data;
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
        this.message.msg.push('You have missing propery!');
      else if (properties.length > 9)
        this.message.msg.push('You have Unexpected property!');

      this.message.missingProps.push(
        ...expectedProperties.filter((item) => !properties.includes(item)),
      );
    }
  }
  private checkType(data) {
    for (const item of data) {
      if (isNaN(item.Count)) {
        this.message.msg.push('Count should be a number.');
      } else {
        item.Count = item.Count * 1;
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

    if (this.message.error)
      throw new HttpException(this.message, HttpStatus.BAD_REQUEST);
  }
}

export default ExcelDataValidation;
