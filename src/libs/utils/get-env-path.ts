export function getEnvFilePath(): string[] {
  switch (process.env.NODE_ENV) {
    case 'test':
      return ['.env.test', '.env'];
    case 'development':
    default:
      return ['.env'];
  }
}
