# TypeScript Type Tree Generator

This project is a TypeScript Language Server Plugin that generates the type info of unions and string literals.

## Custom Requests through getCompletionsAtPosition

This plugin overrides the `getCompletionsAtPosition` method of the TypeScript Language Server to enable sending custom requests. By hijacking this method, we can intercept the completion request and inject our own logic to generate and return the type tree.

When a completion request is made with the TS type color preview Metadata flag, instead of providing the usual code completions, the plugin generates a type tree for the entity at the cursor position. This type tree is then included in the completion details that are sent back to the client.

This approach allows us to leverage the existing communication channel between the client and the server, and to provide additional information without requiring changes to the client or the protocol.

## Response TypeInfo

The response from the plugin includes a `TypeInfo` object, which contains detailed type information about a TypeScript node. Here's a breakdown of its structure:

```typescript
export type TypeProperty = { name: string, type: TypeTree }

/**
 * TypeTree is a tree representation of a TypeScript type.
 */
export type TypeTree = { typeName: string } & (
  | { king: 'string-literal'}
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
```
