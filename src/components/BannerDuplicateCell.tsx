'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  collectionSlug: string
  rowData: {
    id?: number | string
  }
}

const BannerDuplicateCell = ({ collectionSlug, rowData }: Props) => {
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [error, setError] = useState('')
  const [isDuplicated, setIsDuplicated] = useState(false)

  const duplicateBanner = async () => {
    if (rowData.id === undefined) {
      setError('Could not identify this banner.')
      return
    }

    setIsDuplicating(true)
    setError('')
    setIsDuplicated(false)

    try {
      const response = await fetch(
        `/api/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(String(rowData.id))}/duplicate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: '{}',
        },
      )

      if (!response.ok) {
        const responseText = await response.text()
        let message = response.statusText || 'Could not duplicate this banner.'

        if (responseText !== '') {
          try {
            const data: unknown = JSON.parse(responseText)
            if (
              typeof data === 'object' &&
              data !== null &&
              'errors' in data &&
              Array.isArray(data.errors) &&
              typeof data.errors[0]?.message === 'string'
            ) {
              message = data.errors[0].message
            } else if (
              typeof data === 'object' &&
              data !== null &&
              'message' in data &&
              typeof data.message === 'string'
            ) {
              message = data.message
            }
          } catch {
            message = responseText
          }
        }

        setError(message)
        return
      }

      setIsDuplicated(true)
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not duplicate this banner because of a network error.',
      )
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <div>
      <button
        aria-label="Duplicate banner"
        disabled={isDuplicating}
        onClick={(event) => {
          event.stopPropagation()
          void duplicateBanner()
        }}
        type="button"
      >
        {isDuplicating ? 'Duplicating…' : 'Duplicate'}
      </button>
      {error !== '' && <p role="alert">{error}</p>}
      {isDuplicated && <span role="status">Banner duplicated.</span>}
    </div>
  )
}

export default BannerDuplicateCell
