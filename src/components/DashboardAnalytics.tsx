import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@payload-config'
import EnquiryChart from './EnquiryChart'
import { getEnquirySeries } from '../utilities/enquiryAnalytics'

const DashboardAnalytics = async () => {
  const payload = await getPayload({ config })
  const [courses, publishedCourses, enquiries, newEnquiries, universities, enquirySeries] = await Promise.all([
    payload.count({ collection: 'courses' }),
    payload.count({ collection: 'courses', where: { isPublished: { equals: true } } }),
    payload.count({ collection: 'enquiries' }),
    payload.count({ collection: 'enquiries', where: { status: { equals: 'New' } } }),
    payload.count({ collection: 'universities' }),
    getEnquirySeries(payload, 'daily'),
  ])

  const metrics = [
    {
      label: 'Courses',
      value: courses.totalDocs,
      detail: `${publishedCourses.totalDocs} published`,
      href: '/admin/collections/courses',
      tone: 'blue',
    },
    {
      label: 'Enquiries',
      value: enquiries.totalDocs,
      detail: `${newEnquiries.totalDocs} new`,
      href: '/admin/collections/enquiries',
      tone: 'violet',
    },
    {
      label: 'Universities',
      value: universities.totalDocs,
      detail: 'Partner institutions',
      href: '/admin/collections/universities',
      tone: 'green',
    },
  ]

  return (
    <>
      <section className="dashboard-analytics" aria-labelledby="dashboard-analytics-title">
        <div className="dashboard-analytics__heading">
          <div>
            <p className="dashboard-analytics__eyebrow">OVERVIEW</p>
            <h2 id="dashboard-analytics-title">Academy at a glance</h2>
            <p className="dashboard-analytics__description">
              A live summary of your courses, incoming enquiries, and university partners.
            </p>
          </div>
        </div>
        <div className="dashboard-analytics__grid">
          {metrics.map((metric) => (
            <Link
              className={`dashboard-analytics__card dashboard-analytics__card--${metric.tone}`}
              href={metric.href}
              key={metric.label}
            >
              <span className="dashboard-analytics__label">{metric.label}</span>
              <span className="dashboard-analytics__value">{metric.value.toLocaleString()}</span>
              <span className="dashboard-analytics__detail">{metric.detail}</span>
              <span className="dashboard-analytics__arrow" aria-hidden="true">
                View collection <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <EnquiryChart initialPoints={enquirySeries} />
    </>
  )
}

export default DashboardAnalytics
