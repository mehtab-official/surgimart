export const cookies = () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
})
export const headers = () => new Headers()
