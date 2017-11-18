var currentScope = null;

export var setScope = function setScope(scope) {
  return currentScope = scope;
};

export default (function () {
  return currentScope;
});