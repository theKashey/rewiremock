module.exports = () => {
  const isRewiremock = callee =>
    callee.get('object').isIdentifier(REWIREMOCK_GLOBAL) ||
    (callee.isMemberExpression() && isRewiremock(callee.get('object')));

  const shouldHoistExpression = expr => {


    return (
      property.isIdentifier() &&
      FUNCTIONS[property.node.name] &&
      (object.isIdentifier(REWIREMOCK_GLOBAL) ||
        (callee.isMemberExpression() && shouldHoistExpression(object))) &&
      FUNCTIONS[property.node.name](expr.get('arguments'))
    );
  };

  return {
    visitor: {
      Import(path){
        console.log(path);
      },
      ExpressionStatement(path: any) {
        const expr = path.get('expression');
        if (!expr.isCallExpression()) {
          return false;
        }

        const callee = expr.get('callee');
        const object = callee.get('object');
        const property = callee.get('property');
      },
    },
  };
};