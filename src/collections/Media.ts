import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'navigation',
        width: 100,
        height: 50,
        fit: 'contain',
        background: 'transparent',
      },
      {
        // Square 2x source for the 56px course logo tile in the course mega menu.
        name: 'logo',
        width: 112,
        height: 112,
        fit: 'contain',
        background: 'transparent',
      },
    ],
  },
}
