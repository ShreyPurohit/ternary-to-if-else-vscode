import * as babelGenerator from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as vscode from 'vscode';

/**
 * Detects if a string contains a ternary expression.
 * @param code The code snippet to analyze.
 * @returns True if a ternary expression exists, otherwise false.
 */
export function isTernary(code: string): boolean {
  try {
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    let foundTernary = false;

    traverse(ast, {
      ConditionalExpression() {
        foundTernary = true;
        return;
      },
    });

    return foundTernary;
  } catch (error) {
    console.error('Error parsing code:', error);
    return false;
  }
}

/**
 * Converts a ternary expression into an equivalent if-else statement.
 * @param code The ternary expression to convert.
 * @returns The converted if-else statement as a string.
 */
export function convertToIfElse(code: string): string {
  try {
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    let result = '';

    traverse(ast, {
      ConditionalExpression(path) {
        if (!t.isConditionalExpression(path.node)) {
          result = 'Invalid ternary expression';
          return;
        }
        const ifElseStatement = buildIfElse(path.node);
        result = ifElseStatement;
        path.stop();
      },
    });

    return result || 'Invalid ternary expression';
  } catch (error) {
    console.error('Error converting ternary to if-else:', error);
    return 'Error parsing or converting ternary expression';
  }
}

/**
 * Recursively builds an if-else statement from a ConditionalExpression node.
 * @param node The AST node representing the ternary expression.
 * @returns The if-else statement as a string.
 */
function buildIfElse(node: t.ConditionalExpression, indentLevel = 0): string {
  const baseIndent = getIndent(indentLevel);
  const nestedIndent = getIndent(indentLevel + 1);

  const condition = generateCode(node.test);
  const consequent = t.isConditionalExpression(node.consequent)
    ? buildIfElse(node.consequent, indentLevel + 1)
    : `${nestedIndent}${generateCode(node.consequent)}`;

  const alternate = t.isConditionalExpression(node.alternate)
    ? buildIfElse(node.alternate, indentLevel + 1)
    : `${nestedIndent}${generateCode(node.alternate)}`;

  return `${baseIndent}if (${condition}) {\n${consequent}\n${baseIndent}} else {\n${alternate}\n${baseIndent}}`;
}

/**
 * Generates code from an AST node.
 * @param node The AST node.
 * @returns The string representation of the node.
 */
function generateCode(node: t.Node): string {
  const { code } = babelGenerator.default(node, { compact: false });
  return code;
}

/**
 * Utility for consistent indentation
 * @param level The indentation level
 * @returns The string representing the indent for that level
 */
function getIndent(level: number): string {
  return '    '.repeat(level);
}

function stripReturnKeyword(code: string): string {
  const wrappedCode = `function dummy() { ${code} }`;

  try {
    const ast = parse(wrappedCode, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
    let expressionWithoutReturn = '';

    traverse(ast, {
      ReturnStatement(path) {
        const argument = path.node.argument;
        if (argument) {
          expressionWithoutReturn = generateCode(argument);
          path.stop();
        }
      },
    });

    return expressionWithoutReturn || code;
  } catch (error) {
    console.error('Error stripping return keyword:', error);
    return code;
  }
}

/**
 * Activates the extension and provides hover functionality.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const hoverProvider = vscode.languages.registerHoverProvider(
    ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        let fullExpression = '';
        let currentLine = position.line;

        while (currentLine < document.lineCount) {
          const lineText = document.lineAt(currentLine).text.trim();
          if (token.isCancellationRequested) {
            return null;
          }

          fullExpression += ` ${lineText}`;
          if (lineText.endsWith(';') || lineText.endsWith('}') || currentLine === document.lineCount - 1) break;
          currentLine++;
        }

        if (fullExpression.trim().startsWith('return')) {
          fullExpression = stripReturnKeyword(fullExpression);
        }

        if (!fullExpression.trim().endsWith(';')) {
          fullExpression += ';';
        }

        if (isTernary(fullExpression)) {
          try {
            const ifElse = convertToIfElse(fullExpression);
            return new vscode.Hover({
              language: 'typescript',
              value: ifElse,
            });
          } catch (error) {
            console.error('Error converting ternary:', error);
          }
        }

        return null;
      }
    }
  );
  context.subscriptions.push(hoverProvider);
}

export function deactivate() { }
