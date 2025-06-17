import { ValueObject } from '@src/libs/ddd';

/**
 * create a jest mock for all methods and accessors of a given class.
 *
 * @example
 * class UserService {
 *   getUser() { return 'real'; }
 * }
 * const mock = mockClassMethods(UserService);
 * mock.getUser.mockReturnValue('mocked');
 */
export function mockClassMethods<T extends new (...args: any[]) => any>(
  ClassConstructor: T,
  overrides: Partial<jest.Mocked<InstanceType<T>>> = {},
): jest.Mocked<InstanceType<T>> {
  const instance: any = {};
  const prototype = ClassConstructor.prototype;

  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key === 'constructor') continue;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (!descriptor) continue;

    if (typeof descriptor.value === 'function') {
      instance[key] = jest.fn();
    } else if (descriptor.get || descriptor.set) {
      Object.defineProperty(instance, key, {
        get: descriptor.get ? jest.fn() : undefined,
        set: descriptor.set ? jest.fn() : undefined,
        configurable: true,
        enumerable: true,
      });
    }
  }

  Object.assign(instance, overrides);

  return instance as jest.Mocked<InstanceType<T>>;
}

/**
 * create a jest mock for any interface or plain object using Proxy.
 * any accessed property is auto-mocked with a `jest.fn()` unless already provided via overrides.
 *
 * @example
 * interface EmailService {
 *   sendEmail(to: string, body: string): Promise<void>;
 * }
 * const mock = mockInterface<EmailService>();
 * mock.sendEmail.mockResolvedValue();
 */
export function mockInterface<T extends object>(
  overrides: Partial<jest.Mocked<T>> = {},
): jest.Mocked<T> {
  const mock: any = {};
  const keys = Object.keys(overrides) as (keyof T)[];

  for (const key of keys) {
    mock[key] = overrides[key];
  }

  return new Proxy(mock, {
    get(target, prop: string | symbol) {
      if (prop === 'then') return undefined;
      if (prop === 'toString') return () => '[MockInterface]';
      if (prop === Symbol.toPrimitive) return () => '[MockInterface]';

      if (prop in target) return target[prop];

      const fn = jest.fn();
      target[prop] = fn;
      return fn;
    },
  }) as jest.Mocked<T>;
}

/**
 * cast property as jest.Mock
 */
export function asMock<T extends (...args: any[]) => any>(
  fn: T,
): jest.Mock<ReturnType<T>, Parameters<T>> {
  return fn as unknown as jest.Mock<ReturnType<T>, Parameters<T>>;
}

/**
 * mock AggregateRoot, allowing overrides on methods or props.
 *
 * @example
 * const mock = mockAggregateRoot(UserEntity, {
 *   email: 'test@example.com',
 *   role: UserRoles.admin,
 * });
 */
export function mockAggregateRoot<T extends new (...args: any[]) => any>(
  ClassConstructor: T,
  propsOverride: Partial<ReturnType<InstanceType<T>['getProps']>> = {},
  methodOverrides: Partial<jest.Mocked<InstanceType<T>>> = {},
): jest.Mocked<InstanceType<T>> {
  const mock = {
    validate: jest.fn(),
    getProps: jest.fn().mockReturnValue({
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...propsOverride,
    }),
    toObject: jest.fn().mockReturnValue({
      id: 'mock-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...propsOverride,
    }),
    addEvent: jest.fn(),
    clearEvents: jest.fn(),
    publishEvents: jest.fn(),
    ...methodOverrides,
  };

  return mock as jest.Mocked<InstanceType<T>>;
}

/**
 * create a mock instance of a ValueObject subclass.
 *
 * @example
 * const passwordMock = mockValueObject(Password, {
 *   overrides: { compare: jest.fn().mockResolvedValue(true) },
 *   value: 'hashed123',
 * });
 */
export function mockValueObject<T, V extends ValueObject<T>>(
  className: new (...args: any[]) => V,
  { overrides, value }: { overrides: Partial<jest.Mocked<V>>; value?: T } = {
    overrides: {},
    value: undefined,
  },
): jest.Mocked<V> {
  const mock: Partial<jest.Mocked<V>> = {
    equals: jest.fn().mockReturnValue(true),
    unpack: jest.fn().mockReturnValue(value),
    validate: jest.fn(),
    ...overrides,
  };

  // simulate internal structure: value stored in props.value
  Object.defineProperty(mock, 'value', {
    get: () => value ?? '[mock-value]',
  });

  // this cast is safe in tests because all VOs follow a common interface
  return mock as jest.Mocked<V>;
}
