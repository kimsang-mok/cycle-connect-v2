import { TransformFnParams } from 'class-transformer';

export function CapitalizeName() {
  return ({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };
}
