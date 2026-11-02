import type { Payload, PayloadRequest } from 'payload'

export type EnquiryPeriod = 'daily' | 'weekly' | 'monthly'

export type EnquiryChartPoint = {
  label: string
  value: number
}

const getUtcWeekStart = (date: Date) => {
  const day = date.getUTCDay()
  const mondayOffset = day === 0 ? 6 : day - 1

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - mondayOffset))
}

export const getEnquirySeries = async (
  payload: Payload,
  period: EnquiryPeriod,
  user?: PayloadRequest['user'],
): Promise<EnquiryChartPoint[]> => {
  const now = new Date()
  const buckets = []

  if (period === 'daily') {
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    for (let offset = 6; offset >= 0; offset -= 1) {
      const start = new Date(today)
      start.setUTCDate(today.getUTCDate() - offset)
      const end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 1)

      buckets.push({
        start,
        end,
        label: new Intl.DateTimeFormat('en', {
          day: 'numeric',
          month: 'short',
          timeZone: 'UTC',
        }).format(start),
      })
    }
  } else if (period === 'weekly') {
    const thisWeek = getUtcWeekStart(now)

    for (let offset = 7; offset >= 0; offset -= 1) {
      const start = new Date(thisWeek)
      start.setUTCDate(thisWeek.getUTCDate() - offset * 7)
      const end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 7)

      buckets.push({
        start,
        end,
        label: new Intl.DateTimeFormat('en', {
          day: 'numeric',
          month: 'short',
          timeZone: 'UTC',
        }).format(start),
      })
    }
  } else {
    const thisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

    for (let offset = 11; offset >= 0; offset -= 1) {
      const start = new Date(Date.UTC(thisMonth.getUTCFullYear(), thisMonth.getUTCMonth() - offset, 1))
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))

      buckets.push({
        start,
        end,
        label: new Intl.DateTimeFormat('en', {
          month: 'short',
          timeZone: 'UTC',
        }).format(start),
      })
    }
  }

  return Promise.all(
    buckets.map(async ({ end, label, start }) => {
      const result = await payload.count({
        collection: 'enquiries',
        overrideAccess: user ? false : true,
        ...(user ? { user } : {}),
        where: {
          createdAt: {
            greater_than_equal: start.toISOString(),
            less_than: end.toISOString(),
          },
        },
      })

      return { label, value: result.totalDocs }
    }),
  )
}
