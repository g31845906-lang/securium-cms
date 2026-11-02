import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'
import type { Tab } from 'payload'

const SITE_NAME = 'Securium'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

const uploadId = (value: unknown): number | string | undefined => {
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }
  return undefined
}

export const generateTitle: GenerateTitle = ({ doc }) =>
  doc?.title ? `${doc.title} | ${SITE_NAME}` : SITE_NAME

export const generateDescription: GenerateDescription = ({ collectionSlug, doc }) => {
  if (collectionSlug === 'courses') {
    return doc?.summary || ''
  }
  return ''
}

export const generateImage: GenerateImage = ({ collectionSlug, doc }) => {
  const image = collectionSlug === 'courses' ? doc?.featured_image : doc?.heroImage
  return uploadId(image) ?? ''
}

export const generateURL: GenerateURL = ({ collectionSlug, doc }) => {
  if (!doc?.slug) {
    return SITE_URL
  }
  return collectionSlug === 'courses'
    ? `${SITE_URL}/courses/${doc.slug}`
    : `${SITE_URL}/${doc.slug}`
}

/**
 * Builds a per-collection SEO tab. Each collection stores its own `meta` group,
 * so Pages and Courses manage their SEO metadata independently.
 */
export const seoTab = ({ hasDescriptionGenerator = false } = {}): Tab => ({
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({ hasGenerateFn: true }),
    MetaImageField({ relationTo: 'media', hasGenerateFn: true }),
    MetaDescriptionField({ hasGenerateFn: hasDescriptionGenerator }),
    {
      name: 'keywords',
      type: 'text',
      admin: {
        description: 'Comma-separated keywords.',
      },
    },
    {
      name: 'canonicalURL',
      label: 'Canonical URL',
      type: 'text',
      admin: {
        description: 'Leave empty to use the default URL for this document.',
      },
    },
    {
      name: 'noIndex',
      label: 'Hide from search engines (noindex)',
      type: 'checkbox',
      defaultValue: false,
    },
    PreviewField({
      hasGenerateFn: true,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
})
