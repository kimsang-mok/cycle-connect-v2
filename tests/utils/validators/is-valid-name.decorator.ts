import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[A-Za-z]+$/.test(value.trim());
        },
        defaultMessage(args: ValidationArguments) {
          const fieldName = args.property;
          return `${fieldName} must contain only letters with no spaces, hyphens, or special characters`;
        },
      },
    });
  };
}
