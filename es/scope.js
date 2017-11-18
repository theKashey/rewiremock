var createScope = function createScope(parentScope, parentModule) {
    return {
        parentScope: parentScope,
        parentModule: parentModule || (parentScope ? parentScope.parentModule : null),

        mockedModules: {},
        mocks: {},
        asyncMocks: [],

        passBy: [],
        isolation: false,

        plugins: []
    };
};

export default createScope;