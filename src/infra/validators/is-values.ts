import { ValidateBy, ValidationOptions } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

const IS_VALUES = 'isValues';

function IsValues(
  types: Array<string | number>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_VALUES,
      validator: {
        validate: (value: string | number) => types.includes(value),
        defaultMessage: ({ value }: ValidationArguments) =>
          `Current value ${value} is not in permitted values: [${types.join(
            ', ',
          )}]`,
      },
    },
    validationOptions,
  );
}

export default IsValues;
