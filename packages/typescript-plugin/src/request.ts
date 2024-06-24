import type * as ts from 'typescript'

import type { TypeInfo } from './type-tree/types'

export type TsTypeColorPreviewRequest = {
  meta: 'ts-type-color-preview-type-info-request'
}

export type TsTypeColorPreviewCompletionsTriggerCharacter = TsTypeColorPreviewRequest | ts.CompletionsTriggerCharacter | undefined

export type TsTypeColorPreviewResponse = ts.WithMetadata<ts.CompletionInfo> & {
  __tsTypeColorPreviewResponse?: TypeInfo
}

export function isTsTypeColorPreviewRequest (request: TsTypeColorPreviewCompletionsTriggerCharacter): request is TsTypeColorPreviewRequest {
  return !!request && typeof request === 'object' && 'meta' in request && request['meta'] === 'ts-type-color-preview-type-info-request'
}
