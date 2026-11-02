import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'
import { slugifyTitle } from '../utilities/slugifyTitle'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isPublished', 'updatedAt'],
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
      name: 'description',
      type: 'textarea',
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
