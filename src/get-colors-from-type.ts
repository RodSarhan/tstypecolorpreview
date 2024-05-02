import { SyntaxKind } from "ts-morph";
import { getProject } from "./project-cache";
import { converter, formatHex8 } from "culori";
const convertToRGB = converter("rgb");

type ColorObject = {
    name: string;
    hexValue: string;
    transparency: number | undefined;
};

//This is working for all react native supported color formats except
// const didntWork: {
//     number1: 'hwb(0, 0%, 22%)'; //Other HWB formats work
//     number2: 'hwb(360, 33%, 22%)'; //Other HWB formats work
//     number3: '0xff00ff00'; //int not working
// };

const getColorObjectFromType = (type: string) => {
    const rgbFromString = convertToRGB(type);
    if (rgbFromString) {
        return {
            name: type,
            hexValue: formatHex8(rgbFromString),
            transparency: rgbFromString.alpha,
        };
    }
};

export async function getColorsFromType(
    fileName: string,
    content: string,
    offset: number
) {
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

    const colorsList: ColorObject[] = [];

    if (type.isUnion()) {
        type.getUnionTypes().forEach((unionType) => {
            if (unionType.isStringLiteral()) {
                const cleanString = unionType.getText().replaceAll('"', "");
                const colorObject = getColorObjectFromType(cleanString);
                if (colorObject) colorsList.push(colorObject);
            }
        });
    }

    if (type.isStringLiteral()) {
        const cleanString = type.getText().replaceAll('"', "");
        const colorObject = getColorObjectFromType(cleanString);
        if (colorObject) colorsList.push(colorObject);
    }

    return colorsList.length > 0 ? colorsList : undefined;
}
