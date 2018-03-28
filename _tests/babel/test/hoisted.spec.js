import {expect} from 'chai';
import rewiremock from '../../../src/index';
import foo from './foo';

rewiremock('./foo').with('mocked');
const fooMock = rewiremock.getMock('./foo');

describe('hoisted', () => {
  it('mocked test', () => {
    expect(foo).to.be.equal('mocked');
  });

  it('double mocked test', () => {
    fooMock.with('re mocked');
    expect(foo).to.be.equal('mocked');
  });
});