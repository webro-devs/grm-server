import { HttpException, HttpStatus } from '@nestjs/common';
import { delete_file } from '../helpers';

type message = {
  error: boolean;
  msg: string[];
  missingProps: string[];
  missingCells: string[];
};

let message: message = {
  error: false,
  msg: [],
  missingProps: [],
  missingCells: [],
};

const checkProperties = (data) => {
  for (const item of data) {
    const properties = Object.keys(item);
    const expectedProperties = [
      'Collection',
      'Model',
      'Color',
      'Size',
      'Code',
      'Count',
    ];

    if (properties.length < 9) message.msg.push('You have missing propery!');
    else if (properties.length > 9)
      message.msg.push('You have Unexpected property!');

    message.missingProps.push(
      ...expectedProperties.filter((item) => !properties.includes(item)),
    );
  }
};

const checkType = (data) => {
  for (const item of data) {
    if (isNaN(item.Count)) {
      message.msg.push('Count should be a number.');
    } else {
      item.Count = item.Count * 1;
    }
  }
};

const checkValue = (data) => {
  const alphabet = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
  const expectedProperties = ['Collection', 'Model', 'Size', 'Code', 'Count'];

  data.forEach((item, index) => {
    const properties = Object.keys(item);

    expectedProperties.forEach((el, i) => {
      if (!properties.includes(el)) {
        const cell = `${index + 1}:${alphabet[i]}`;
        message.missingCells.push(cell);
      }
    });
  });
};

const restoreErrors = (path: string) => {
  message.missingProps = [...new Set(message.missingProps)];
  message.msg = [...new Set(message.msg)];
  if (
    message.missingProps.length > 0 ||
    message.msg.length > 0 ||
    message.missingCells.length > 0
  )
    message.error = true;

  if (message.error) {
    delete_file(path);
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
};

const validate = (data, path) => {
  message = {
    error: false,
    msg: [],
    missingProps: [],
    missingCells: [],
  };
  checkProperties(data);
  checkType(data);
  checkValue(data);
  restoreErrors(path);
};

export default validate;