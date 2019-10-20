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
  const placeholder = template('{}', templateOptions);

  const registrations = template(
    `(function rwrmck(){
  global["_REWIREMOCK_HOISTED_"] = global["_REWIREMOCK_HOISTED_"] || [];
  global["_REWIREMOCK_HOISTED_"].push(function(rewiremock){     
    MOCKS 
   });
})('rwrmck');`, templateOptions);

  const REGISTRATIONS = Symbol('registrations');

  // const disableStatement = disable();

  return {
    visitor: {
      Program: {
        enter({node}) {
          node[REGISTRATIONS] = {
            hasRewiremock: false,
            imports: [],
            mocks: []
          }
        },
        exit({node}, {file}) {
          const {mocks, hasRewiremock, slot} = node[REGISTRATIONS];
          if (mocks.length) {

            if (!hasRewiremock) {
              /* eslint-disable no-console */
              console.warn('`rewiremock` was not found in imports at', file.opts.filename, ', but it was used.');
            }

            const mocker = registrations({
              MOCKS: [...mocks, enable()]
            });

            node.body.push(mocker);

            mocker._blockHoist = Infinity;
            if (slot) {
              slot.insertAfter(disable());
            }
          }
          if (slot) {
            slot.remove();
          }
        }
      },

      ImportDeclaration(path) {
        if (path.node.source.value.indexOf('rewiremock') >= 0) {
          path.parent[REGISTRATIONS].hasRewiremock = true;
        }

        // rolling insert
        if(path.parent[REGISTRATIONS].slot){
          path.parent[REGISTRATIONS].slot.remove();
        }
        path.parent[REGISTRATIONS].slot = path.insertAfter(placeholder())[0];

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