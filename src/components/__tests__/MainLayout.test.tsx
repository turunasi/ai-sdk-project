// src/components/__tests__/MainLayout.test.tsx
import { render, screen } from "@testing-library/react";
import { MainLayout } from "../MainLayout";
import { auth } from "@/features/auth/lib/auth";
import { prisma } from "@/features/database";

// Mock auth and prisma
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));
jest.mock("@/features/database", () => ({
  prisma: {
    conversation: {
      findMany: jest.fn(),
    },
  },
}));

// Mock child components
jest.mock("@/components/Sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-sidebar">{children}</div>
  ),
}));
jest.mock("@/features/auth/components/UserSidebarContent", () => ({
  UserSidebarContent: ({ session }: { session: any }) => (
    <div data-testid="mock-user-sidebar-content">
      Mocked UserSidebarContent: {session?.user?.name || "No User"}
    </div>
  ),
}));
jest.mock("@/features/chat", () => ({
  ChatHistory: ({ history }: { history: any[] }) => (
    <div data-testid="mock-chat-history">
      Mocked ChatHistory: {history.length} items
    </div>
  ),
}));

describe("MainLayout", () => {
  const mockAuth = auth as jest.Mock;
  const mockPrismaConversationFindMany = prisma.conversation
    .findMany as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children and fetches chat history for authenticated user", async () => {
    const mockSession = { user: { id: "user123", name: "Test User" } };
    const mockHistory = [
      { id: "c1", title: "Chat 1" },
      { id: "c2", title: "Chat 2" },
    ];

    mockAuth.mockResolvedValue(mockSession);
    mockPrismaConversationFindMany.mockResolvedValue(mockHistory);

    const TestChild = () => (
      <div data-testid="test-child">Test Child Content</div>
    );

    const layout = await MainLayout({ children: <TestChild /> });
    render(layout);

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindMany).toHaveBeenCalledWith({
      where: { userId: "user123" },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    });

    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-chat-history")).toHaveTextContent(
      "Mocked ChatHistory: 2 items",
    );
    expect(screen.getByTestId("mock-user-sidebar-content")).toHaveTextContent(
      "Mocked UserSidebarContent: Test User",
    );
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders children and fetches empty chat history for unauthenticated user", async () => {
    mockAuth.mockResolvedValue(null);
    mockPrismaConversationFindMany.mockResolvedValue([]); // Should not be called, but mock for safety

    const TestChild = () => (
      <div data-testid="test-child">Test Child Content</div>
    );

    const layout = await MainLayout({ children: <TestChild /> });
    render(layout);

    expect(mockAuth).toHaveBeenCalledTimes(1);
    expect(mockPrismaConversationFindMany).not.toHaveBeenCalled(); // Should not be called if no user ID

    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-chat-history")).toHaveTextContent(
      "Mocked ChatHistory: 0 items",
    );
    expect(screen.getByTestId("mock-user-sidebar-content")).toHaveTextContent(
      "Mocked UserSidebarContent: No User",
    );
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });
});
