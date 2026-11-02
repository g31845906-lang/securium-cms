'use client'

import { PopupList, useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

const SETTINGS_LINKS = [{ label: 'Contact & Locations', slug: 'contact-settings' }]

const SettingsMenu = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const pathname = usePathname()

  return (
    <PopupList.ButtonGroup>
      <PopupList.GroupLabel label="Settings" />
      {SETTINGS_LINKS.map(({ label, slug }) => {
        const href = `${adminRoute}/globals/${slug}`

        return (
          <PopupList.Button active={pathname === href} href={href} key={slug}>
            {label}
          </PopupList.Button>
        )
      })}
    </PopupList.ButtonGroup>
  )
}

export default SettingsMenu
