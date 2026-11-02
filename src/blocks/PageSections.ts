import type { Block } from 'payload'

const sectionHeadingFields = [
  {
    name: 'heading',
    type: 'text',
    required: true,
  }
] as const

export const AboutUsBlock: Block = {
  slug: 'aboutUs',
  labels: {
    singular: 'About Us',
    plural: 'About Us Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'description',
      type: 'richText',  
    },
    {
      name: 'image',
      label: 'Image or Video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Select an image or video from the media library.',
      },
    },
  ],
}

export const MissionVissionBlock: Block = {
  slug: 'missionVision',
  labels: {
    singular: 'Mission Vision',
    plural: 'Mission Vision Sections',
    },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Our Mission & Vision',
      required: true,
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Our Mission',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Mission',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Our Vision',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Vision',
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
  }
export const WhyChooseUsBlock: Block = {
  slug: 'whyChooseUs',
  labels: {
    singular: 'Why Choose Us',
    plural: 'Why Choose Us Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'reasons',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Optional icon name or short label.' } },
      ],
    },
  ],
}

export const PopularCoursesBlock: Block = {
  slug: 'popularCourses',
  labels: {
    singular: 'Popular Courses',
    plural: 'Popular Courses Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'Banner Section',
    plural: 'Banner Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'banners',
      type: 'relationship',
      relationTo: 'banners',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: {
    singular: 'Partners',
    plural: 'Partner Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Features',
    plural: 'Feature Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonial Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const FaqsBlock: Block = {
  slug: 'faqs',
  labels: {
    singular: 'FAQs',
    plural: 'FAQ Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const BlogPostsBlock: Block = {
  slug: 'blogPosts',
  labels: {
    singular: 'Blog Posts',
    plural: 'Blog Post Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      filterOptions: {
        isPublished: { equals: true },
      },
    },
  ],
}

export const CertificatesBlock: Block = {
  slug: 'certificates',
  labels: {
    singular: 'Certificates',
    plural: 'Certificate Sections',
  },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'description',
      type: 'richText',  
    },
    {
      name: 'certificates',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' }
      ],
    },
  ],
}

export const AboutHeroSectionBlock: Block = {
  slug: 'aboutHero',
  labels: {
    singular: 'About Hero',
    plural: 'About Hero Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Securium Academy' },
    { name: 'heading', type: 'text', required: true },
    { name: 'highlight', type: 'text' },
    { name: 'description', type: 'textarea', required: true },
    { name: 'backgroundMedia', type: 'upload', relationTo: 'media' },
    { name: 'primaryButtonLabel', type: 'text' },
    { name: 'primaryButtonUrl', type: 'text' },
    { name: 'secondaryButtonLabel', type: 'text' },
    { name: 'secondaryButtonUrl', type: 'text' },
  ],
}

export const AboutProfileSectionBlock: Block = {
  slug: 'aboutProfile',
  labels: {
    singular: 'About Profile',
    plural: 'About Profile Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Our Profile' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'richText', required: true },
    {
      name: 'videoUrl',
      label: 'Video iframe URL',
      type: 'text',
      admin: {
        description: 'Paste the HTTPS YouTube or Vimeo embed URL (the src value from the iframe).',
      },
    },
    {
      name: 'video',
      label: 'Upload a video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional uploaded video. If provided, it takes precedence over the iframe URL.',
      },
    },
    {
      name: 'media',
      label: 'Fallback profile image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image shown when neither a video upload nor a valid iframe URL is provided.',
      },
    },
    { name: 'note', type: 'textarea' },
  ],
}

export const AboutValuesSectionBlock: Block = {
  slug: 'aboutValues',
  labels: {
    singular: 'About Values',
    plural: 'About Values Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'What guides us' },
    { name: 'heading', type: 'text', defaultValue: 'Our core values', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'values',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'icon',
          type: 'text',
          defaultValue: 'fa-solid fa-shield-halved',
          admin: {
            placeholder: 'fa-solid fa-shield-halved',
            description: 'Enter Font Awesome class name(s), for example: fa-solid fa-shield-halved',
          },
        },
      ],
    },
  ],
}

export const AboutStatisticsSectionBlock: Block = {
  slug: 'aboutStatistics',
  labels: {
    singular: 'About Statistics',
    plural: 'About Statistics Sections',
  },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'statistics',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'number', required: true, min: 0 },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const AboutStorySectionBlock: Block = {
  slug: 'aboutStory',
  labels: {
    singular: 'About Story Video',
    plural: 'About Story Video Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Inside Securium Academy' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'videoUrl',
      type: 'text',
      admin: { description: 'Optional YouTube or Vimeo embed URL.' },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional uploaded video. Takes precedence over the embed URL.' },
    },
  ],
}

export const AboutTeamSectionBlock: Block = {
  slug: 'aboutTeam',
  labels: {
    singular: 'About Team',
    plural: 'About Team Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'People make the difference' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'featureImage', type: 'upload', relationTo: 'media' },
    { name: 'featureHeading', type: 'text' },
    { name: 'featureDescription', type: 'textarea' },
    {
      name: 'join',
      type: 'group',
      label: 'Join Our Team',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Join Securium Academy' },
        { name: 'heading', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'opportunities',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Explore careers' },
        { name: 'buttonUrl', type: 'text', defaultValue: '/career' },
      ],
    },
    {
      name: 'members',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'designation', type: 'text' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const AboutAwardsSectionBlock: Block = {
  slug: 'aboutAwards',
  labels: {
    singular: 'About Awards',
    plural: 'About Awards Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Trust and standards' },
    { name: 'heading', type: 'text', defaultValue: 'Awards & Recognition', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'awards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

export const AboutPartnersSectionBlock: Block = {
  slug: 'aboutPartners',
  labels: {
    singular: 'About Partners',
    plural: 'About Partners Sections',
  },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Our network' },
    { name: 'heading', type: 'text', defaultValue: 'Our Partners', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'partners',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

export const AboutCallToActionSectionBlock: Block = {
  slug: 'aboutCallToAction',
  labels: {
    singular: 'About Call to Action',
    plural: 'About Call to Action Sections',
  },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Get in touch' },
    { name: 'buttonUrl', type: 'text', defaultValue: '#exampleModal' },
  ],
}

export const PageSectionBlocks: Block[] = [
  AboutHeroSectionBlock,
  AboutProfileSectionBlock,
  AboutValuesSectionBlock,
  AboutStatisticsSectionBlock,
  AboutStorySectionBlock,
  AboutTeamSectionBlock,
  AboutAwardsSectionBlock,
  AboutPartnersSectionBlock,
  AboutCallToActionSectionBlock,
  AboutUsBlock,
  WhyChooseUsBlock,
  MissionVissionBlock,
  BannerBlock,
  PopularCoursesBlock,
  PartnersBlock,
  FeaturesBlock,
  TestimonialsBlock,
  FaqsBlock,
  BlogPostsBlock,
  CertificatesBlock,
]
