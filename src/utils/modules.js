export const toModule = (name) => name && require.cache[name];
export const getModuleName = (module) => String(module.filename || module.i);
export const getModuleParent = (module) => module && (module.parent || toModule(module.parents && module.parents[0]));
export const getModuleParents = (module) => module && (module.parent ? [getModuleName(module.parent)] : module.parents);
export const moduleCompare = (a, b) => a === b || getModuleName(a) === getModuleName(b);