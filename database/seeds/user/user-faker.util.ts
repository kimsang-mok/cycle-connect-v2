import { faker } from '@faker-js/faker';
import { UserRoles } from '@src/modules/user/domain/user.types';

export function randomUserRole(): UserRoles {
  return faker.helpers.arrayElement(Object.values(UserRoles));
}

export function randomUserEmail(): string {
  return faker.internet.email().toLowerCase();
}

export function randomUserName(): { firstName: string; lastName: string } {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

export function randomUserPassword(): string {
  return faker.internet.password({ length: 12 });
}

export function randomToken(): string {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
}
