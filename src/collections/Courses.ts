import type { CollectionConfig } from 'payload'

import { seoTab } from '../utilities/seo'
import { authenticatedOnly, publishedRead } from './access'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: publishedRead,
    update: authenticatedOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'isPublished', 'updatedAt'],
    group: 'Content',
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
              index: true,
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'overview',
              label: 'Overview',
              type: 'richText',
            },
            {
              name: 'prerequisite',
              label: 'Prerequisite',
              type: 'richText',
            },
            {
              name: 'targetAudience',
              label: 'Target Audience',
              type: 'richText',
            },
            {
              name: 'objectives',
              label: 'Objectives',
              type: 'richText',
            },
            {
              name: 'syllabus',
              label: 'Syllabus',
              type: 'array',
              fields: [
                {
                  name: 'moduleTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'moduleDescription',
                  type: 'richText',
                },
              ],
            },
            {
              name: 'whatYouWillLearn',
              label: 'What You Will Learn',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'content',
                      type: 'richText',
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'certificationSection',
              label: 'Certification Section',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'contentHeading',
                  label: 'Content Heading',
                  type: 'text',
                },
                {
                  name: 'contentDescription',
                  label: 'Content Description',
                  type: 'richText',
                },
              ],
            },
            {
              name: 'programHighlights',
              label: 'Program Highlights',
              type: 'group',
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  required: false,
                },
                {
                  name: 'items',
                  type: 'array',
                  fields: [
                    {
                      name: 'highlight',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'icon',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        description:
                          'Optional image icon. If both icon options are set, this image is used.',
                      },
                    },
                    {
                      name: 'iconText',
                      label: 'Icon or Emoji',
                      type: 'text',
                      admin: {
                        description:
                          'Optional emoji or Bootstrap icon class, for example bi bi-laptop.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'videoSection',
              label: 'Video Section',
              type: 'group',
              fields: [
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'videoUrl',
                  label: 'Video URL',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'toolsAndTechnologies',
              label: 'Tools & Technologies',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'info',
                  label: 'Information',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'relatedBlog',
              label: 'Related Blog',
              type: 'relationship',
              relationTo: 'blog-posts',
              hasMany: true,
            },
            {
              name: 'relatedFAQ',
              label: 'Related FAQ',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
              filterOptions: {
                isPublished: { equals: true },
              },
            },
            {
              name: 'relatedTestimonials',
              label: 'Related Testimonials',
              type: 'relationship',
              relationTo: 'testimonials',
              hasMany: true,
              filterOptions: {
                isPublished: { equals: true },
              },
            },
            {
              name: 'featured_image',
              label: 'Featured Image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logo',
              label: 'Course Logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Square logo or certification badge shown on the course card in the mega menu. Falls back to the category image.',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              filterOptions: {
                isPublished: { equals: true },
              },
            },
            {
              name: 'university',
              type: 'relationship',
              relationTo: 'universities',
              filterOptions: {
                isPublished: { equals: true },
              },
            },
            {
              name: 'level',
              type: 'select',
              options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'],
              defaultValue: 'All levels',
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'For example, "8 weeks" or "40 hours".',
              },
            },
            {
              name: 'price',
              type: 'number',
              min: 0,
            },
            {
              name: 'curriculum',
              type: 'array',
              fields: [
                {
                  name: 'moduleTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'moduleDescription',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        seoTab({ hasDescriptionGenerator: true }),
      ],
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
