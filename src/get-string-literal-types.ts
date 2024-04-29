import { SyntaxKind } from "ts-morph";
import { getProject } from "./project-cache";

export async function getStringLiteralTypes(
    fileName: string,
    content: string,
    offset: number
): Promise<string[] | undefined> {
    const project = getProject(fileName);
    const sourceFile = project.addSourceFileAtPath(fileName);

    // Use the current document's text as the source file's text, supports unsaved changes
    sourceFile.replaceWithText(content);

    const node = sourceFile.getDescendantAtPos(offset);
    if (node === undefined) return;

    const nodeKind = node.getKind();
    if (nodeKind !== SyntaxKind.Identifier) return;

    const typeChecker = project.getTypeChecker();
    const type = typeChecker.getTypeAtLocation(node);

    const stringLiteralTypes: string[] = [];

    if (type.isUnion()) {
        type.getUnionTypes().forEach((unionType) => {
            if (unionType.isStringLiteral()) {
                stringLiteralTypes.push(
                    unionType.getText().replaceAll('"', "")
                );
            }
        });
    }

    if (type.isStringLiteral()) {
        stringLiteralTypes.push(type.getText().replaceAll('"', ""));
    }

    return stringLiteralTypes;
}
