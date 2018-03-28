import {expect} from 'chai';
import rewiremock from './rewiremock';
import foo from './foo';

rewiremock('foo').with('mocked');

describe('hoisted', () => {
  it('mocked test', () => {
    expect(foo).to.be.equal('mocked');
  });
});