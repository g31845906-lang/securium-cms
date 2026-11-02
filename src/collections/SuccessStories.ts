import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'

const youtubeUrlPattern =
  /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}/i

export const SuccessStories: CollectionConfig = {
  slug: 'success-stories',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'youtubeUrl', 'sortOrder', 'isPublished'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'youtubeUrl',
      label: 'YouTube URL',
      type: 'text',
      required: true,
      admin: {
        description: 'A YouTube video link, e.g. https://www.youtube.com/watch?v=… or https://youtu.be/…',
      },
      validate: (value: string | null | undefined) =>
        typeof value === 'string' && youtubeUrlPattern.test(value.trim())
          ? true
          : 'Enter a valid YouTube video URL.',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower values appear first.',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
