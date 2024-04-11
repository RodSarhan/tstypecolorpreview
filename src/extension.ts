import * as vscode from "vscode";
import { registerHoverProvider } from "./hover-provider";
import { registerProjectInitializer } from "./project-initializer";

export function activate(context: vscode.ExtensionContext): void {
    registerProjectInitializer(context);
    registerHoverProvider(context);
}
