import sinon from 'sinon';
import rewiremock from 'rewiremock';
import Component1 from 'common/Component1';
import selectors from 'common/selectors';

rewiremock('common/Component1').by('common/Component2');
rewiremock('common/Component2/action').with({
  action: () => {
  }
});
rewiremock('common/selectors').mockThrough(() => sinon.stub());

const b = 1;
let a = b;