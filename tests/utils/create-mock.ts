import {
  AggregateId,
  AggregateRoot,
  BaseEntityProps,
  CreateEntityProps,
  ValueObject,
} from '@src/libs/ddd';

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
export function mockAggregateRoot<P, T extends AggregateRoot<P>>(
  ClassConstructor: new (args: CreateEntityProps<P>) => T,
  propsOverride: Partial<P & BaseEntityProps> = {},
  methodOverrides: Partial<jest.Mocked<T>> = {},
): jest.Mocked<T> {
  const now = new Date();

  const baseProps: BaseEntityProps = {
    id: 'mock-id' as AggregateId,
    createdAt: now,
    updatedAt: now,
  };

  const allProps = {
    ...baseProps,
    ...propsOverride,
  } as P & BaseEntityProps;

  const instance = Object.create(ClassConstructor.prototype);

  // inject private/internal fields
  Object.defineProperties(instance, {
    _id: {
      value: allProps.id,
      writable: true,
      configurable: true,
    },
    _createdAt: {
      value: allProps.createdAt,
      writable: true,
      configurable: true,
    },
    _updatedAt: {
      value: allProps.updatedAt,
      writable: true,
      configurable: true,
    },
    props: {
      value: allProps,
      writable: true,
      configurable: true,
    },
    domainEvents: {
      value: [],
      writable: true,
      configurable: true,
    },
  });

  // restore getters like `entity.id`
  Object.defineProperties(instance, {
    id: {
      get: () => allProps.id,
      configurable: true,
    },
    createdAt: {
      get: () => allProps.createdAt,
      configurable: true,
    },
    updatedAt: {
      get: () => allProps.updatedAt,
      configurable: true,
    },
  });

  // manually cast core method mocks with `asMock`
  instance.getProps = asMock(() => Object.freeze({ ...allProps }));
  instance.toObject = asMock(() => ({ ...allProps }));
  instance.clearEvents = asMock(() => {});
  instance.validate = asMock(() => {});

  // mock methods
  let proto = ClassConstructor.prototype;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor') continue;

      if (Object.keys(instance).includes(key)) continue;

      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (!desc) continue;

      if (typeof desc.value === 'function') {
        instance[key] = jest.fn();
      } else if (desc.get || desc.set) {
        if (Object.prototype.hasOwnProperty.call(instance, key)) continue;

        Object.defineProperty(instance, key, {
          get: desc.get ? jest.fn() : undefined,
          set: desc.set ? jest.fn() : undefined,
          configurable: true,
        });
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  Object.assign(instance, methodOverrides);

  return instance as jest.Mocked<T>;
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
