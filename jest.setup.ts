// In jest.setup.ts
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { Request, Response, Headers, fetch } from "whatwg-fetch";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.fetch = fetch;
