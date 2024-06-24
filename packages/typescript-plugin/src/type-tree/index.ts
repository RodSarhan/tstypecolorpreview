import type * as ts from 'typescript'

import type { TypeInfo, TypeTree } from './types'
import { getDescendantAtRange } from './get-ast-node'

let typescript: typeof ts
let checker: ts.TypeChecker

/**
 * Get TypeInfo at a position in a source file
 */
export function getTypeInfoAtPosition (
  typescriptContext: typeof ts,
  typeChecker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  position: number
): TypeInfo | undefined {
  try {
    typescript = typescriptContext
    checker = typeChecker

    const node = getDescendantAtRange(typescript, sourceFile, [position, position])
    if (!node || node === sourceFile || !node.parent) return undefined

    const symbol = typeChecker.getSymbolAtLocation(node)
    if (!symbol) return undefined

    let type = typeChecker.getTypeOfSymbolAtLocation(symbol, node)

    // If the symbol has a declared type, use that when available
    const declaredType = typeChecker.getDeclaredTypeOfSymbol(symbol)
    if (declaredType.flags !== typescript.TypeFlags.Any) {
      type = declaredType
    }

    const syntaxKind = symbol?.declarations?.[0]?.kind ?? typescript.SyntaxKind.ConstKeyword
    const name = symbol?.getName() ?? typeChecker.typeToString(type)

    const typeTree = getTypeTree(type)

    return {
      typeTree,
      syntaxKind,
      name
    }
  } catch (e) {
    return undefined
  }
}

/**
 * Recursively get type information by building a TypeTree object from the given type
 */
function getTypeTree (type: ts.Type): TypeTree {
  const typeName = checker.typeToString(type, undefined, typescript.TypeFormatFlags.NoTruncation)

  if (type.isStringLiteral()) return {
    kind: 'string-literal',
    typeName
  }

  if (type.isUnion()) return {
    kind: 'union',
    typeName,
    types: type.types.map(t => getTypeTree(t))
  }

  return {
    kind: 'others',
    typeName
  }
}
