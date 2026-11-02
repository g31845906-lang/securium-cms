import type { CollectionConfig } from 'payload'

import { authenticatedOnly } from './access'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  access: {
    create: () => true,
    delete: authenticatedOnly,
    read: authenticatedOnly,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'course', 'status', 'createdAt'],
    group: 'Leads',
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['New', 'Contacted', 'Qualified', 'Closed'],
      defaultValue: 'New',
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
  ],
}
