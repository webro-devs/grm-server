import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUniqueConstraint } from './is-unique.constrain';

export function IsUnique(
  options: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
