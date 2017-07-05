const createScope = (parentScope, parentModule) => ({
    parentScope,
    parentModule: parentModule || (parentScope ? parentScope.parentModule : null),

    mockedModules: {},
    mocks: {},

    passBy: [],
    isolation: false,

    plugins: []
});

export default createScope;