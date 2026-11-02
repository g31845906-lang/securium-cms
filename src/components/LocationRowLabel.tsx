'use client'

import { useRowLabel } from '@payloadcms/ui'

type LocationRow = {
  city?: string
  isPrimary?: boolean
  name?: string
}

const LocationRowLabel = () => {
  const { data, rowNumber } = useRowLabel<LocationRow>()
  const name = data?.name || `Location ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  const city = data?.city ? ` — ${data.city}` : ''
  const primary = data?.isPrimary ? ' (Primary)' : ''

  return (
    <span>
      {name}
      {city}
      {primary}
    </span>
  )
}

export default LocationRowLabel
