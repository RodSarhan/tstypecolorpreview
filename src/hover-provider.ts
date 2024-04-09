import * as vscode from "vscode";
import * as ts from "typescript";
import { prettifyType } from "./prettify-type";
import { EXTENSION_ID, MARKDOWN_MAX_LENGTH } from "./consts";
import { getProject } from "./project-cache";
import { washString } from "./helpers";

export function registerHoverProvider(context: vscode.ExtensionContext): void {
    async function provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.Hover | undefined> {
        // const config = vscode.workspace.getConfiguration(EXTENSION_ID);
        // const enableHover = config.get("enableHover", true);

        // if (!enableHover) {
        //     await Promise.resolve(undefined);
        //     return;
        // }

        const content = document.getText();
        const offset = document.offsetAt(position);
        const fileName = document.fileName;

        return await prettifyType(fileName, content, offset).then(
            (typeString) => {
                if (typeString === undefined) return undefined;
                // let finalArray = [];
                // vscode.window.showInformationMessage(typeString);
                let regularExpression = /#(?:[0-9a-fA-F]{3}){1,2}/g; // btw: this is the same as writing RegExp(/#(?:[0-9a-fA-F]{3}){1,2}/, 'g')
                let extractedHexCodes = typeString.match(regularExpression);
                if (!extractedHexCodes || extractedHexCodes.length > 5) {
                    return undefined;
                }
                // vscode.window.showInformationMessage(finalArray.toString());
                // Ignore hover if the type is already displayed from TS quick info
                // if (
                //     typeString.startsWith("type") ||
                //     typeString.startsWith("const")
                // ) {
                //     const project = getProject(fileName);
                //     const languageService =
                //         project.getLanguageService().compilerObject;
                //     const quickInfo = languageService.getQuickInfoAtPosition(
                //         fileName,
                //         offset
                //     );
                //     const quickInfoText = ts.displayPartsToString(
                //         quickInfo?.displayParts
                //     );

                //     if (
                //         washString(quickInfoText).includes(
                //             washString(typeString)
                //         )
                //     ) {
                //         return undefined;
                //     }
                // }

                // if (typeString.length > MARKDOWN_MAX_LENGTH) {
                //     typeString =
                //         typeString.substring(0, MARKDOWN_MAX_LENGTH) + "...";
                // }

                const hoverText = new vscode.MarkdownString();
                // hoverText.appendCodeblock(typeString, document.languageId);
                for (const item of extractedHexCodes) {
                    hoverText.appendMarkdown(`<span>${item}:</span>&nbsp; `);
                    hoverText.appendMarkdown(
                        `<span style="color:${item};background-color:${item};">${"I I"}</span><br>`
                    );
                }
                hoverText.supportHtml = true;

                return new vscode.Hover(hoverText);
            }
        );
    }

    context.subscriptions.push(
        vscode.languages.registerHoverProvider("typescript", { provideHover })
    );
    context.subscriptions.push(
        vscode.languages.registerHoverProvider("typescriptreact", {
            provideHover,
        })
    );
}
