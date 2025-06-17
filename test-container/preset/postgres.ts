import { GenericContainer } from 'testcontainers';
import { ContainerFactory } from '../core/container-factory';

type PostgresOptions = {
  username?: string;
  password?: string;
  database?: string;
  port?: number;
  image?: string;
};

ContainerFactory.definePreset<PostgresOptions>('postgres', (options) => {
  const {
    username = 'user',
    password = 'password',
    database = 'cycleconnect_test',
    port = 5432,
    image = 'postgres:alpine',
  } = options || {};

  return new GenericContainer(image)
    .withExposedPorts(port)
    .withEnvironment({
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: database,
    })
    .withReuse();
});
