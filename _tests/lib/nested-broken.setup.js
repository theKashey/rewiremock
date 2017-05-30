//import rewiremock from '../../src/index';
import rewiremock from '../../src/index';

rewiremock('./foo')
    .with(()=>'aa');

rewiremock('../b/bar')
    .with(()=>'bb');

rewiremock('../b/baz')
    .with(()=>'cc');