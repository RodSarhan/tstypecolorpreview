import type * as ts from 'typescript'

import { isTsTypeColorPreviewRequest } from './request'
import type { TsTypeColorPreviewCompletionsTriggerCharacter, TsTypeColorPreviewResponse } from './request'
import { getTypeInfoAtPosition } from './type-tree'

function init (modules: { typescript: typeof ts }): ts.server.PluginModule {
  const ts = modules.typescript

  function create (info: ts.server.PluginCreateInfo): ts.LanguageService {
    // Log a message
    info.project.projectService.logger.info('TS Type Color Preview LSP is starting')

    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null)
    for (const k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
      const x = info.languageService[k]!
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: unknown[]) => x.apply(info.languageService, args)
    }

    /**
     * Override getCompletionsAtPosition to provide color information
     */
    proxy.getCompletionsAtPosition = (fileName, position, options) => {
      const requestBody = options?.triggerCharacter as TsTypeColorPreviewCompletionsTriggerCharacter
      if (!isTsTypeColorPreviewRequest(requestBody)) {
        return info.languageService.getCompletionsAtPosition(fileName, position, options)
      }

      const program = info.project['program'] as ts.Program | undefined
      if (!program) return undefined

      const sourceFile = program.getSourceFile(fileName)
      if (!sourceFile) return undefined

      const checker = program.getTypeChecker()

      const tsTypeColorPreviewResponse = getTypeInfoAtPosition(ts, checker, sourceFile, position)

      const response: TsTypeColorPreviewResponse = {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: [],
        __tsTypeColorPreviewResponse: tsTypeColorPreviewResponse
      }

      return response
    }

    return proxy
  }

  return { create }
}

export = init
