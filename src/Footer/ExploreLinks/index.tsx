'use client'

import { usePathname } from 'next/navigation'
import { CMSLink } from '@/components/Link'
import { isLinkActive } from '@/utilities/isLinkActive'
import type { Footer } from '@/payload-types'

type ExploreLinksProps = {
  links: Footer['exploreSection']['links']
}

export const ExploreLinks: React.FC<ExploreLinksProps> = ({ links }) => {
  const pathname = usePathname()

  return (
    <div
      className="w-full flex flex-col items-start justify-center"
      style={{
        gap: 'var(--footer-gap)',
      }}
    >
      {links?.map(({ link }, i) => {
        const isActive = isLinkActive(link, pathname)

        return (
          <div key={i} className="w-full relative">
            <div
              className="relative"
              style={{
                marginLeft: 'var(--footer-link-list-indent)',
              }}
            >
              <CMSLink
                {...link}
                appearance="inline"
                className={`font-normal font-sans transition-colors ${
                  isActive ? 'text-foreground' : 'text-secondary hover:text-foreground'
                }`}
                style={{
                  fontSize: 'var(--footer-content-font-size)',
                  listStyleType: 'disc',
                  display: 'list-item',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

