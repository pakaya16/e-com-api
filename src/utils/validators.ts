import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from "class-validator";
import { EntityManager } from "typeorm";

export type TableInterface = {
  tableName: string,
  column: string,
  condition?: any
}

@ValidatorConstraint({ name: "IsUniqueConstraint", async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {
  }

  async validate(
    value: any,
    args?: ValidationArguments
  ): Promise<boolean> {
    const { tableName, column }: TableInterface = args.constraints[0];
    const dataExist = await this.entityManager.getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return !dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;
    return `${field} is already exist`;
  }
}

export function IsUnique(options: TableInterface, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: "IsUnique",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint
    });
  };
}


@ValidatorConstraint({ name: "IsExistsConstraint", async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {
  }

  async validate(
    value: any,
    args?: ValidationArguments
  ): Promise<boolean> {
    const { tableName, column }: TableInterface = args.constraints[0];
    const dataExist = await this.entityManager.getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return !!dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;
    return `${field} is not exist`;
  }
}

export function IsExists(options: TableInterface, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: "IsExists",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsExistsConstraint
    });
  };
}