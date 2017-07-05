let currentScope = null;

export const setScope = (scope) => currentScope = scope;

export default () => currentScope;
