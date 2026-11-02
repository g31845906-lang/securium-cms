import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isPublished', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'website',
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
