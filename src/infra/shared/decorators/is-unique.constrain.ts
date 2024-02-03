import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityManager } from 'typeorm';

@ValidatorConstraint({ name: 'IsUniqueConstant', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const tableName: string = args.constraints[0];
    const column = args.property;

    if (column && value) {
      const result = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value })
        .getOne();

      return !result ? true : false;
    } else {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.value} already exists.`;
  }
}
