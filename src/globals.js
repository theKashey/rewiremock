let currentScope = null;

export const setScope = (scope) => currentScope = scope;

export const getScopeVariable = (name, scope = currentScope) => {
  if(name in scope){
    return scope[name];
  }
  if(scope.parentScope){
    return getScopeVariable(name, scope.parentScope);
  }
  return undefined;
}

export const collectScopeVariable = (name, scope = currentScope, collect = []) => {
  if(name in scope){
    if(Array.isArray(scope[name])) {
      collect.push(...scope[name])
    } else {
      collect.push(scope[name])
    }
  }
  if(scope.parentScope){
    collectScopeVariable(name, scope.parentScope, collect);
  }
  return collect;
}

export default () => currentScope;
