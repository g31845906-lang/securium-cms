'use client'

import { useState } from 'react'

import type { EnquiryChartPoint, EnquiryPeriod } from '../utilities/enquiryAnalytics'

type Props = {
  initialPoints: EnquiryChartPoint[]
}

type SeriesResponse = {
  points: EnquiryChartPoint[]
}

const periods: { label: string; value: EnquiryPeriod }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const chartWidth = 760
const chartHeight = 280
const left = 46
const right = 18
const top = 24
const bottom = 42

const EnquiryChart = ({ initialPoints }: Props) => {
  const [period, setPeriod] = useState<EnquiryPeriod>('daily')
  const [points, setPoints] = useState(initialPoints)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const chartAreaWidth = chartWidth - left - right
  const chartAreaHeight = chartHeight - top - bottom
  const maxValue = Math.max(1, ...points.map(({ value }) => value))
  const ceiling = Math.max(4, Math.ceil(maxValue / 4) * 4)
  const coordinates = points.map((point, index) => ({
    ...point,
    x: left + (points.length === 1 ? chartAreaWidth / 2 : (index / (points.length - 1)) * chartAreaWidth),
    y: top + chartAreaHeight - (point.value / ceiling) * chartAreaHeight,
  }))
  const line = coordinates.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const area = coordinates.length
    ? `${line} L ${coordinates[coordinates.length - 1].x} ${top + chartAreaHeight} L ${coordinates[0].x} ${top + chartAreaHeight} Z`
    : ''

  const selectPeriod = async (nextPeriod: EnquiryPeriod) => {
    if (nextPeriod === period || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/enquiry-analytics?period=${nextPeriod}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Could not load ${nextPeriod} enquiry analytics.`)
      }

      const result: SeriesResponse = await response.json()
      if (!Array.isArray(result.points)) {
        throw new Error('The analytics response was invalid.')
      }

      setPeriod(nextPeriod)
      setPoints(result.points)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Could not load enquiry analytics.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="enquiry-chart" aria-labelledby="enquiry-chart-title">
      <div className="enquiry-chart__header">
        <div>
          <h2 id="enquiry-chart-title">Enquiry Survey</h2>
        </div>
        <div className="enquiry-chart__filters" aria-label="Chart time period">
          {periods.map(({ label, value }) => (
            <button
              aria-pressed={period === value}
              className="enquiry-chart__filter"
              disabled={isLoading}
              key={value}
              onClick={() => void selectPeriod(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="enquiry-chart__error" role="alert">
          {error}
        </p>
      ) : (
        <div className="enquiry-chart__plot" aria-busy={isLoading}>
          <svg
            className="enquiry-chart__svg"
            role="img"
            aria-label={`${period[0].toUpperCase()}${period.slice(1)} enquiry activity chart`}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >
            <defs>
              <linearGradient id="enquiry-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((step) => {
              const value = ceiling - (ceiling / 4) * step
              const y = top + (chartAreaHeight / 4) * step

              return (
                <g key={step}>
                  <line
                    className="enquiry-chart__gridline"
                    x1={left}
                    x2={chartWidth - right}
                    y1={y}
                    y2={y}
                  />
                  <text className="enquiry-chart__axis-label" textAnchor="end" x={left - 10} y={y + 4}>
                    {Math.round(value)}
                  </text>
                </g>
              )
            })}
            {area && <path className="enquiry-chart__area" d={area} />}
            {line && <path className="enquiry-chart__line" d={line} />}
            {coordinates.map(({ label, value, x, y }, index) => (
              <g key={label}>
                <circle className="enquiry-chart__point" cx={x} cy={y} r="4">
                  <title>{`${label}: ${value} ${value === 1 ? 'enquiry' : 'enquiries'}`}</title>
                </circle>
                {points.length <= 9 || index % 2 === 0 ? (
                  <text
                    className="enquiry-chart__axis-label"
                    textAnchor="middle"
                    x={x}
                    y={chartHeight - 12}
                  >
                    {label}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
          {isLoading && <span className="enquiry-chart__loading">Updating chart…</span>}
        </div>
      )}
      <p className="enquiry-chart__footnote">All dates are shown in UTC.</p>
    </section>
  )
}

export default EnquiryChart
