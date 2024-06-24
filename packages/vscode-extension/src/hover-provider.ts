import * as vscode from 'vscode'
import type { TsTypeColorPreviewRequest, TypeInfo } from './types'
import { getColorsFromType } from './get-colors-from-type'

export function registerHoverProvider (context: vscode.ExtensionContext): void {
  async function provideHover (
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Hover | undefined> {
    const request: TsTypeColorPreviewRequest = {
      meta: 'ts-type-color-preview-type-info-request'
    }

    const location = {
      file: document.uri.fsPath,
      line: position.line + 1,
      offset: position.character + 1
    }

    const response: any = await vscode.commands.executeCommand(
      'typescript.tsserverRequest',
      'completionInfo',
      {
        ...location,
        triggerCharacter: request
      }
    )

    const tsTypeColorPreviewResponse: TypeInfo | undefined = response?.body?.__tsTypeColorPreviewResponse
    if (!tsTypeColorPreviewResponse) return

    const { typeTree } = tsTypeColorPreviewResponse

    const colorsList = getColorsFromType(typeTree)

    if (colorsList === undefined) return undefined

    const hoverText = new vscode.MarkdownString()

    for (const color of colorsList) {
      hoverText.appendMarkdown(
            `<span>${color.name}:</span>&nbsp; <span style="color:${
                color.hexValue
            };background-color:${
                color.hexValue
            };">${'&nbsp; &nbsp; &nbsp;'}</span><br>`
      )
    }
    // square "&#9724;"
    hoverText.supportHtml = true

    return new vscode.Hover(hoverText)
  }

  context.subscriptions.push(vscode.languages.registerHoverProvider('typescript', { provideHover }))
  context.subscriptions.push(vscode.languages.registerHoverProvider('typescriptreact', { provideHover }))
}
