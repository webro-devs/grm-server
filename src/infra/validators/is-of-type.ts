import { ValidateBy, ValidationOptions } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

const IS_OFTYPE = 'IsOfType';

function IsOfType(
  type: any,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_OFTYPE,
      validator: {
        validate: (value: any) => value instanceof type,
        defaultMessage: ({ value }: ValidationArguments) =>
          `Current value ${typeof value} is not this type`,
      },
    },
    validationOptions,
  );
}

export default IsOfType;
