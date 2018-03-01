const createScope = (parentScope, parentModule) => ({
    parentScope,
    parentModule: parentModule || (parentScope ? parentScope.parentModule : null),

    mockedModules: {},
    mocks: {},
    asyncMocks: [],

    passBy: [],
    //isolation: false,

    plugins: [],
    options: {}
});

export default createScope;