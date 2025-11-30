import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateAboutPageDecorations: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating aboutPageDecorations`)

    revalidateTag('global_aboutPageDecorations')
  }

  return doc
}

