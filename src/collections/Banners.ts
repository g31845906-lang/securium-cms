import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'

export const Banners: CollectionConfig = {
  slug: 'banners',
  disableDuplicate: false,
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'heading',
    defaultColumns: ['heading', 'isPublished', 'updatedAt', 'duplicateAction'],
    group: 'Content',
  },
  fields: [
    {
      name: 'duplicateAction',
      type: 'text',
      virtual: true,
      admin: {
        components: {
          Cell: '@/components/BannerDuplicateCell',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
    },
    {
      name: 'buttonLink',
      type: 'text',
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
