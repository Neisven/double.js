const ConditionChecker = require(".././condition");
module.exports = {
  name: "$onlyIf",
  callback: (context) => {
    context.argsCheck(3);
    const [condition, trueCase, falseCase] = context.inside.split(";");
    const resolvedCondition = ConditionChecker.solve(condition);
    return resolvedCondition === "true" ? trueCase : falseCase;
  },
};