import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'
import { slugifyTitle } from '../utilities/slugifyTitle'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authorProfile', 'publishedAt', 'isPublished'],
    group: 'Content',
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, originalDoc }) => {
        if (!data) {
          return data
        }

        const title = data.title ?? (operation === 'update' ? originalDoc?.title : undefined)
        if (typeof title === 'string') {
          data.slug = slugifyTitle(title)
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        description: 'Legacy free-text author label. Select an Author profile for new posts.',
      },
    },
    {
      name: 'authorProfile',
      label: 'Author',
      type: 'relationship',
      relationTo: 'authors',
      filterOptions: {
        profileStatus: { equals: 'published' },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
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
