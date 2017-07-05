//import rewiremock from '../../nested';
//import rewiremock from '../../src/nested';

module.exports = (rewiremock) => {
    rewiremock('./foo')
        .with(() => 'aa');

    rewiremock('../b/bar')
        .with(() => 'bb');

    rewiremock('../b/baz')
        .with(() => 'cc');
};