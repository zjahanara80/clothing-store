function myMiddlewareFunction(req, res, next) {
  console.log('Middleware executed');
  next();
}

module.exports = myMiddlewareFunction;