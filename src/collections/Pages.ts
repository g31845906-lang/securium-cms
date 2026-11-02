import type { CollectionConfig } from 'payload'

import { PageSectionBlocks } from '../blocks/PageSections'
import { seoTab } from '../utilities/seo'
import { slugifyTitle } from '../utilities/slugifyTitle'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                hidden: true,
              },
            },
            {
              name: 'heroImage',
              label: 'Hero Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional banner image displayed behind the page title on the frontend.',
              },
            },
            {
              name: 'sections',
              type: 'blocks',
              blocks: PageSectionBlocks,
              admin: {
                description: '',
              },
            },
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
        seoTab(),
      ],
    },
  ],
}
