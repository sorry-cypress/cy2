import { parse } from 'acorn';
import escodegen from 'escodegen';
import estraverse from 'estraverse';
import { Program } from 'estree';
import { normalizePath } from './path';

export const parseJS = (code: string) =>
  parse(code, {
    ecmaVersion: 2020,
  }) as unknown as Program;

export const generateJS = (ast: Program) => escodegen.generate(ast);

export const FN_ID = 'cy2_injected';

export const instrumentCypressInit = (
  code: string,
  injectedModulePath: string
) => {
  const normalizedPath = normalizePath(injectedModulePath);
  const injectedFn = `
function ${FN_ID}() {
    try { require('${normalizedPath}'); }
    catch (e) {}
}`;

  const injectedCode = `(${injectedFn})();`;

  const ast = parseJS(code);

  if (!hasInjected(ast)) {
    return generateJS(injectAST(ast, parseJS(injectedCode)));
  }

  return generateJS(replaceAST(ast, parseJS(injectedFn)));
};

export function hasInjected(ast: Program) {
  let found = false;
  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type == estraverse.Syntax.Identifier && node.name === FN_ID) {
        found = true;
        return this.break();
      }
    },
  });
  return found;
}

function injectAST(ast: Program, injectedAst: Program) {
  estraverse.traverse(ast, {
    enter: function (node) {
      if (node.type === estraverse.Syntax.Program) {
        node.body.unshift(injectedAst.body[0]);
        return this.break();
      }
    },
  });
  return ast;
}

function replaceAST(ast: Program, injectedFnAst: Program) {
  return estraverse.replace(ast, {
    enter: function (node) {
      if (
        node.type == estraverse.Syntax.FunctionExpression &&
        node.id.name === FN_ID
      ) {
        return injectedFnAst.body[0];
      }
    },
  });
}
