import createPlugin, {PASS, NO} from './_common';

const shouldMock = (mock, request, parent, topModule) => {
    return parent.parent === topModule ? PASS : NO;
};

const plugin = createPlugin({
    shouldMock
});

export default plugin;