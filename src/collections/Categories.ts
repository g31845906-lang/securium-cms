import type { CollectionConfig } from 'payload'

import { authenticatedOnly, publishedRead } from './access'

export const Categories: CollectionConfig = {
  slug: 'categories',
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
  // Adds drag-and-drop reordering in the admin list; the frontend sorts by `_order`.
  orderable: true,
  // Drag-and-drop only works while the list is sorted by `_order`.
  defaultSort: '_order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
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
