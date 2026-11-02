import type { Endpoint } from 'payload'

import { getEnquirySeries, type EnquiryPeriod } from '../utilities/enquiryAnalytics'

const validPeriods: EnquiryPeriod[] = ['daily', 'weekly', 'monthly']

const isEnquiryPeriod = (value: string | null): value is EnquiryPeriod =>
  value !== null && validPeriods.some((period) => period === value)

export const enquiryAnalyticsEndpoint: Endpoint = {
  path: '/enquiry-analytics',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Authentication required.' }, { status: 401 })
    }

    if (!req.url) {
      return Response.json({ error: 'A request URL is required.' }, { status: 400 })
    }

    const period = new URL(req.url).searchParams.get('period')
    if (!isEnquiryPeriod(period)) {
      return Response.json({ error: 'Choose daily, weekly, or monthly.' }, { status: 400 })
    }

    const points = await getEnquirySeries(req.payload, period, req.user)

    return Response.json({ points })
  },
}
