jest.mock('@src/libs/application/context/app-request-context', () => {
  const mockGetRequestId = jest.fn().mockReturnValue('mock-request-id');
  const mockGetEntityManager = jest.fn().mockReturnValue({} as any);
  const mockRunInTransaction = jest
    .fn()
    .mockImplementation(async (fn) => await fn());

  return {
    AppRequestContext: {
      get current() {
        return {
          getRequestId: mockGetRequestId,
          getEntityManager: mockGetEntityManager,
          runInTransaction: mockRunInTransaction,
        };
      },
    },
  };
});
