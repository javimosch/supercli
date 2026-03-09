var mockApp
const express = require("express")

const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
  listKeys: jest.fn().mockResolvedValue([])
}

jest.mock("../server/storage/adapter", () => ({
  getStorage: jest.fn(() => mockStorage)
}))

jest.mock("express", () => {
  const mApp = {
    use: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    listen: jest.fn((port, cb) => {
      if (cb) cb();
    }),
    post: jest.fn()
  }
  mockApp = mApp;
  const mExpress = jest.fn(() => mApp)
  mExpress.json = jest.fn(() => (req, res, next) => next())
  mExpress.urlencoded = jest.fn(() => (req, res, next) => next())
  mExpress.static = jest.fn(() => (req, res, next) => next())
  mExpress.Router = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    use: jest.fn(),
    stack: []
  }))
  return mExpress
})

describe("server app", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    jest.spyOn(console, "log").mockImplementation()
    jest.spyOn(console, "error").mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test("initializes app and starts listening", () => {
    require("../server/app")
    expect(mockApp.listen).toHaveBeenCalled()
  })

  test("handles start-up error", () => {
    const { getStorage } = require("../server/storage/adapter")
    getStorage.mockImplementationOnce(() => { throw new Error("fatal") })
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {})
    
    require("../server/app")
    
    expect(mockExit).toHaveBeenCalledWith(1)
    mockExit.mockRestore()
  })
})
