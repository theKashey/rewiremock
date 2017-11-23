jest.enableAutomock();

describe('fail', () => {
  it('should throw', () => {
    expect(() => require('../lib/index')).toThrow();
  })
});