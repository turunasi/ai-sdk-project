// src/features/database/lib/__tests__/prisma.test.ts

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    // Mock any methods used in your application if needed for other tests
  })),
}));

describe("Prisma Client Singleton", () => {
  beforeEach(() => {
    // Reset modules to ensure prisma.ts is re-evaluated in each test.
    // This also resets our mock of '@prisma/client'.
    jest.resetModules();
    // Ensure global.prisma is cleared to simulate the first-time import.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.prisma;
  });

  it("should create a new PrismaClient instance if one does not exist", async () => {
    // After resetting modules, we need to get a fresh reference to the mocked client.
    const { PrismaClient: MockPrismaClient } = await import("@prisma/client");
    const { default: prisma } = await import("../prisma");

    expect(MockPrismaClient).toHaveBeenCalledTimes(1);
    expect(prisma).toBeInstanceOf(MockPrismaClient);
  });

  it("should return the existing PrismaClient instance if one already exists", async () => {
    // The first import will create an instance.
    await import("../prisma");
    const { PrismaClient: MockPrismaClient } = await import("@prisma/client");

    // The second and third imports should reuse the existing instance.
    const { default: prisma1 } = await import("../prisma");
    const { default: prisma2 } = await import("../prisma");

    expect(MockPrismaClient).toHaveBeenCalledTimes(1); // Constructor should only be called once.
    expect(prisma1).toBe(prisma2); // Both variables point to the same instance
  });
});
