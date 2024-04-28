import * as vscode from "vscode";
import { getStringLiteralTypes } from "./get-string-literal-types";

const hexRegex = /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i;

export function registerHoverProvider(context: vscode.ExtensionContext): void {
    async function provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.Hover | undefined> {
        const content = document.getText();
        const offset = document.offsetAt(position);
        const fileName = document.fileName;

        return await getStringLiteralTypes(fileName, content, offset).then(
            (typeStrings) => {
                if (typeStrings === undefined) return undefined;
                const colorsListAsHex: { name: string; hexValue: string }[] =
                    [];

                for (const typeString of typeStrings) {
                    if (hexRegex.test(typeString)) {
                        colorsListAsHex.push({
                            name: typeString,
                            hexValue: typeString,
                        });
                        continue;
                    }
                }

                // if (typeString.length > MARKDOWN_MAX_LENGTH) {
                //     typeString =
                //         typeString.substring(0, MARKDOWN_MAX_LENGTH) + "...";
                // }

                const hoverText = new vscode.MarkdownString();
                // hoverText.appendCodeblock(typeString, document.languageId);
                for (const item of colorsListAsHex) {
                    hoverText.appendMarkdown(
                        `<span>${item.name}:</span>&nbsp; <span style="color:${
                            item.hexValue
                        };background-color:${
                            item.hexValue
                        };">${"&nbsp; &nbsp; &nbsp;"}</span><br>`
                    );
                }
                // square "&#9724;"
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
