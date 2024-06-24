import type * as ts from 'typescript'

export type TypeProperty = { name: string, type: TypeTree }

/**
 * TypeTree is a tree representation of a TypeScript type.
 */
export type TypeTree = { typeName: string } & (
  | { kind: 'string-literal' }
  | { kind: 'union', types: TypeTree[] }
  | { kind: 'others' }
)

/**
 * TypeInfo contains the type information of a TypeScript node.
 */
export type TypeInfo = {
  typeTree: TypeTree
  syntaxKind: ts.SyntaxKind
  name: string
}
