import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateProjectDetailPageIntro: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    payload.logger.info('Revalidating projectDetailPageIntro')
    revalidateTag('global_projectDetailPageIntro')
  }

  return doc
}

