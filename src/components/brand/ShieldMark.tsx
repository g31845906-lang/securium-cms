import React from 'react'

type Props = {
  size?: number
}

export const ShieldMark = ({ size = 32 }: Props) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size}
    viewBox="0 0 32 32"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2.5 4.5 6.75v8.5c0 7.1 4.85 12.6 11.5 14.25 6.65-1.65 11.5-7.15 11.5-14.25v-8.5L16 2.5Z"
      fill="var(--brand-navy)"
      stroke="var(--brand-accent)"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="m11 16 3.5 3.5L21.5 12"
      stroke="var(--brand-accent)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
  </svg>
)
