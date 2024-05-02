import * as vscode from "vscode";
import { getColorsFromType } from "./get-colors-from-type";

export function registerHoverProvider(context: vscode.ExtensionContext): void {
    async function provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.Hover | undefined> {
        const content = document.getText();
        const offset = document.offsetAt(position);
        const fileName = document.fileName;

        const colorsList = await getColorsFromType(
            fileName,
            content,
            offset
        );

        if (colorsList === undefined) return undefined;

        const hoverText = new vscode.MarkdownString();

        for (const color of colorsList) {
            hoverText.appendMarkdown(
                `<span>${color.name}:</span>&nbsp; <span style="color:${
                    color.hexValue
                };background-color:${
                    color.hexValue
                };">${"&nbsp; &nbsp; &nbsp;"}</span><br>`
            );
        }
        // square "&#9724;"
        hoverText.supportHtml = true;

        return new vscode.Hover(hoverText);
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
