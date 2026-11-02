import type { Access } from 'payload'

export const authenticatedOnly: Access = ({ req }) => Boolean(req.user)

export const publishedRead: Access = ({ req }) =>
  req.user ? true : { isPublished: { equals: true } }
