const util = require('util')
const streamWeb = require('stream/web')
const workerThreads = require('worker_threads')

global.TextEncoder = util.TextEncoder
global.TextDecoder = util.TextDecoder as any
global.ReadableStream = streamWeb.ReadableStream as any
global.WritableStream = streamWeb.WritableStream as any
global.TransformStream = streamWeb.TransformStream as any
global.MessageChannel = workerThreads.MessageChannel as any
global.MessagePort = workerThreads.MessagePort as any
global.BroadcastChannel = workerThreads.BroadcastChannel as any

const undici = require('undici')
global.Request  = undici.Request  as any
global.Response = undici.Response as any
global.Headers  = undici.Headers  as any
global.fetch    = undici.fetch    as any
global.Blob     = require('buffer').Blob
global.FormData = undici.FormData as any
global.File     = undici.File     as any

if (typeof global.FileList === 'undefined' || global.FileList === null) {
  class FileList extends Array {}
  global.FileList = FileList as any
}

if (typeof global.DataTransfer === 'undefined' || global.DataTransfer === null) {
  class DataTransfer {
    items = []
    files = new global.FileList()
  }
  global.DataTransfer = DataTransfer as any
}

if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() { return [] }
  } as any
}

jest.setTimeout(30000)
require('@testing-library/jest-dom')
const { server } = require('./__tests__/__mocks__/mswServer')

// Ensure jest-dom matchers are available
const matchers = require('@testing-library/jest-dom/matchers');
expect.extend(matchers);

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: any) => children,
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('@sanity/image-url', () => {
  return () => ({
    image: () => ({
      url: () => 'http://example.com/img.png'
    })
  })
})

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
})
afterAll(() => server.close())

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
})
