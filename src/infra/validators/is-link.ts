import { ValidateBy, ValidationOptions } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

const IS_LINK = 'isLink';

function IsLink(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_LINK,
      validator: {
        validate: (value: string) => value.startsWith('https://'),
        defaultMessage: ({ value }: ValidationArguments) =>
          `Current value ${typeof value} is not a link`,
      },
    },
    validationOptions,
  );
}

export default IsLink;
