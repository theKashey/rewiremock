import rdefault from '../';
import rnode from '../node';
import rweb from '../webpack';

describe('endpoints', () => {
  it('default smoke', () => {
    const rewiremock = rdefault;
    rewiremock(() => require('./lib/a/foo')).with({});
    rewiremock.proxy(() => require('./lib/a/test'), {});
  });

  it('node smoke', () => {
    const rewiremock = rnode;
    rnode.addPlugin(rnode.plugins.usedByDefault);
    rewiremock(() => require('./lib/a/foo')).with({});
    rewiremock.proxy(() => require('./lib/a/test'), {});
  });

  it('webpack smoke', () => {
    const rewiremock = rweb;
    rweb.addPlugin(rweb.plugins.usedByDefault);
    rewiremock(() => require('./lib/a/foo')).with({});
    rewiremock.proxy(() => require('./lib/a/test'), {});
  });
});