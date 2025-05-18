const templateOptions = {
  placeholderPattern: /^([A-Z0-9]+)([A-Z0-9_]+)$/,
};

const REWIREMOCK_GLOBAL = {name: 'rewiremock'};

const isRewiremock = expr => {
  const callee = expr.get('callee');
  if (!callee.node) {
    return false;
  }
  const object = callee.get('object');
  return (
    (callee.isIdentifier(REWIREMOCK_GLOBAL) || (callee.isMemberExpression() && isRewiremock(object)))
  );
}


module.exports = (args) => {

  const {template} = args;

  const enable = template('rewiremock.enable();\n', templateOptions);
  const disable = template('rewiremock.disable();global["_REWIREMOCK_HOISTED_"] = [];\n', templateOptions);

  const registrations = template(
`(function rwrmck(){
  global["_REWIREMOCK_HOISTED_"] = global["_REWIREMOCK_HOISTED_"] || [];
  global["_REWIREMOCK_HOISTED_"].push(function(rewiremock){     
    MOCKS 
   });
})('rwrmck');`, templateOptions);

  const REGISTRATIONS = Symbol('registrations')

  return {
    visitor: {
      Program: {
        enter({node}) {
          node[REGISTRATIONS] = {
            imports: [],
            mocks: []
          }
        },
        exit({node}) {
          const {imports, mocks} = node[REGISTRATIONS];
          if (mocks.length) {

            const hasImportsTransformed = imports.some(({node}) => !node);
            if (hasImportsTransformed) {
              throw new Error('rewiremock: another plugin transformed `imports`. Please hoist rewiremock/babel, see https://github.com/theKashey/rewiremock/issues/102');
            }

            const mocker = registrations({
              MOCKS: [...mocks, enable()]
            });

            node.body.push(mocker);

            mocker._blockHoist = Infinity

            imports[imports.length - 1].insertAfter(disable());
          }
        }
      },

      ImportDeclaration(path) {
        path.parent[REGISTRATIONS].imports.push(path);
      },
      ExpressionStatement(path) {
        if (!path.parent[REGISTRATIONS]) {
          return false;
        }

        const expr = path.get('expression');

        if (!expr.isCallExpression()) {
          return false;
        }

        if (isRewiremock(expr)) {
          path.parent[REGISTRATIONS].mocks.push(path.node);
          path.remove();
        }

      },
    },
  };
};
