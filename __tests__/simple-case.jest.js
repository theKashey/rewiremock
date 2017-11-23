var rewiremock = require('../lib/index').default;

//!!!!!!!!!!!!!!!!!!
jest.disableAutomock();
rewiremock.overrideEntryPoint(module);
require = rewiremock.requireActual;

describe('pass', () => {
  it('execute a', () => {
    rewiremock.inScope(() => {
      rewiremock('path')
        .with({
          readFileSync: () => "mocked"
        })
        .toBeUsed();

      rewiremock.enable();
      const mocked = require('./stub/a.js');
      rewiremock.disable();
      expect(mocked.test1()).toBe("mocked");
      expect(mocked.test2(2)).toBe(4);
    });
  });

  it('execute b', () => {
    rewiremock.inScope(() => {
      rewiremock('./b.js')
        .with((a) => a * 3)
        .toBeUsed();

      rewiremock.enable();
      const mocked = require('./stub/a.js');
      rewiremock.disable();
      expect(mocked.test2(3)).toBe(9);
    });
  });

  it('use proxy', () => {
    var mocked = rewiremock.proxy('./stub/a', {
      './b.js': (a) => a * 3
    });

    expect(mocked.test2(3)).toBe(9);
  });

  it('execute async', (done) => {
    rewiremock.around(() => require('./stub/a.js'), () => {
      rewiremock(() => require('./stub/b'))
        .with((a) => a * 3)
        .toBeUsed();
    }).then(mocked => {
      expect(mocked.test2(3)).toBe(9);
      done();
    });
  })
});