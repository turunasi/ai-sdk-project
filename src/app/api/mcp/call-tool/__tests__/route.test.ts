import { POST } from "../route";
import { auth } from "@/features/auth/lib/auth";
import { experimental_createMCPClient } from "ai";

// Mock dependencies
jest.mock("@/features/auth/lib/auth", () => ({
  auth: jest.fn(),
}));

const mockCallTool = jest.fn();
const mockClose = jest.fn();
jest.mock("ai", () => ({
  experimental_createMCPClient: jest.fn(() =>
    Promise.resolve({
      callTool: mockCallTool,
      close: mockClose,
    }),
  ),
}));

describe("POST /api/mcp/tool", () => {
  const mockAuth = auth as jest.Mock;
  const mockCreateMCPClient = experimental_createMCPClient as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "test-user" } });
  });

  it("should execute a tool and return the result on success", async () => {
    const requestBody = {
      toolName: "add",
      args: { a: 2, b: 3 },
    };
    const mockToolResult = { content: [{ type: "text", text: "5" }] };
    mockCallTool.mockResolvedValue(mockToolResult);

    const request = new Request("http://localhost/api/mcp/tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(mockToolResult);
    expect(mockCreateMCPClient).toHaveBeenCalledTimes(1);
    expect(mockCallTool).toHaveBeenCalledWith({
      name: "add",
      arguments: { a: 2, b: 3 },
    });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost/api/mcp/tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolName: "test", args: {} }),
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody.error).toBe("Unauthorized");
    expect(mockCallTool).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();
  });

  it("should return 400 for an invalid request body", async () => {
    const request = new Request("http://localhost/api/mcp/tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invalid_key: "value" }), // Missing toolName
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe("Invalid request body");
    expect(mockCallTool).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();
  });
});
