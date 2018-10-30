import {expect} from 'chai';
import rewiremock from '../../../src/index';
import foo from './foo';
import bar from './bar';


rewiremock('./foo').with('mocked').dynamic();
rewiremock('./bar').callThrough().with({a:'mocked'}).dynamic();

const fooMock = rewiremock.getMock('./foo');
const barMock = rewiremock.getMock('./bar');

describe('hoisted/dynamic', () => {
  describe('string', () => {
    it('mocked test', () => {
      expect(foo).to.be.equal('mocked');
    });

    it('double mocked test', () => {
      fooMock.with('re mocked');
      expect(foo).to.be.equal('mocked');
    });
  });

  describe('object', () => {
    it('mocked test', () => {
      expect(bar.a).to.be.equal('mocked');
      expect(bar.b).to.be.equal('real b');
    });//

    it('unmocked test', () => {
      barMock.with({});
      expect(bar.a).to.be.equal('real a');
    });

    it('double mocked test', () => {
      barMock.with({a:'remocked'});
      expect(bar.a).to.be.equal('remocked');
    });
  });
});