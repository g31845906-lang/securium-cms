import type { CollectionConfig } from 'payload'

import { authenticatedOnly } from './access'
import { slugifyTitle } from '../utilities/slugifyTitle'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: ({ req }) => (req.user ? true : { profileStatus: { equals: 'published' } }),
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'designation', 'profileStatus', 'updatedAt'],
    group: 'Content',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, originalDoc }) => {
        if (!data) {
          return data
        }

        const name = data.name ?? (operation === 'update' ? originalDoc?.name : undefined)
        if (typeof name === 'string') {
          data.slug = slugifyTitle(name)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'designation',
      type: 'text',
    },
    {
      name: 'shortBiography',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fullBiography',
      type: 'richText',
    },
    {
      name: 'areasOfExpertise',
      type: 'array',
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Enter the full professional profile URL, including https://.',
          },
        },
      ],
    },
    {
      name: 'profileStatus',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
