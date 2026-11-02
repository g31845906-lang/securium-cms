import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, CodeBlock, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import type { Block } from 'payload'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { Authors } from './collections/Authors'
import { Courses } from './collections/Courses'
import { Enquiries } from './collections/Enquiries'
import { FAQs } from './collections/FAQs'
import { Testimonials } from './collections/Testimonials'
import { Universities } from './collections/Universities'
import { Clients } from './collections/Clients'
import { Banners } from './collections/Banners'
import { Categories } from './collections/Categories'
import { AwardsAndRecognitions } from './collections/AwardsAndRecognitions'
import { SuccessStories } from './collections/SuccessStories'
import { ContactSettings } from './globals/ContactSettings'
import { enquiryAnalyticsEndpoint } from './endpoints/enquiryAnalytics'
import { generateDescription, generateImage, generateTitle, generateURL } from './utilities/seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const codeBlock = CodeBlock({ defaultLanguage: 'html' })
const codeBlockWithPreview: Block = {
  ...codeBlock,
  fields: codeBlock.fields.map((field) => {
    if (!('name' in field) || field.name !== 'code' || field.type !== 'code') {
      return field
    }

    return {
      ...field,
      admin: {
        ...field.admin,
        components: {
          ...field.admin?.components,
          Field: {
            path: '@/components/HtmlCodePreviewField',
            clientProps: { defaultLanguage: 'html' },
          },
        },
      },
    }
  }),
}

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'dark',
    meta: {
      titleSuffix: ' — Securium CMS',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/brand/Logo',
        Icon: '@/components/brand/Icon',
      },
      settingsMenu: ['@/components/SettingsMenu'],
      views: {
        dashboard: {
          Component: '@/components/DashboardAnalytics',
        },
      },
    },
  },
  collections: [Users, Media, Pages, Courses, BlogPosts, BlogCategories, Authors, Banners, Categories, FAQs, Testimonials, SuccessStories, Enquiries, Universities, Clients, AwardsAndRecognitions],
  globals: [ContactSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [codeBlockWithPreview],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  endpoints: [enquiryAnalyticsEndpoint],
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
       // Start with this disabled for local testing
      clientUploads: false,
    }),
    // SEO fields are added per collection (see seoTab in Pages and Courses);
    // the plugin provides the generate endpoints and admin UI components.
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle,
      generateDescription,
      generateImage,
      generateURL,
    }),
  ],
})
