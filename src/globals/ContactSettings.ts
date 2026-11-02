import type {
  ArrayFieldValidation,
  Field,
  GlobalConfig,
  TextFieldSingleValidation,
} from 'payload'

import { authenticatedOnly } from '../collections/access'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/

const DAY_OPTIONS = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' },
]

const validatePhone: TextFieldSingleValidation = (value) => {
  if (!value || PHONE_PATTERN.test(value)) {
    return true
  }

  return 'Enter a valid phone number, e.g. +91 98765 43210.'
}

const validateUrl: TextFieldSingleValidation = (value) => {
  if (!value) {
    return true
  }

  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:' ? true : 'URL must start with http(s)://.'
  } catch {
    return 'Enter a full URL, e.g. https://example.com.'
  }
}

// Times are stored as "HH:mm" (24-hour) strings so the frontend can render them
// without timezone conversion; the timezone field gives the context.
const validateTime: TextFieldSingleValidation = (value, { siblingData }) => {
  if ((siblingData as { isClosed?: boolean }).isClosed) {
    return true
  }

  if (!value) {
    return 'Required unless marked as closed.'
  }

  if (!TIME_PATTERN.test(value)) {
    return 'Use 24-hour HH:mm format, e.g. 09:30.'
  }

  return true
}

const validateClosesAt: TextFieldSingleValidation = (value, args) => {
  const result = validateTime(value, args)
  if (result !== true || (args.siblingData as { isClosed?: boolean }).isClosed) {
    return result
  }

  const { opensAt } = args.siblingData as { opensAt?: string }
  if (opensAt && TIME_PATTERN.test(opensAt) && value && value <= opensAt) {
    return 'Closing time must be after opening time.'
  }

  return true
}

const validateSinglePrimary: ArrayFieldValidation = (value) => {
  const rows = (Array.isArray(value) ? value : []) as { isPrimary?: boolean }[]
  if (rows.filter((row) => row?.isPrimary).length > 1) {
    return 'Only one location can be marked as primary.'
  }

  return true
}

const phoneField = (name: string, label: string, width = '50%'): Field => ({
  name,
  label,
  type: 'text',
  validate: validatePhone,
  admin: { placeholder: '+91 98765 43210', width },
})

const timeRangeFields: Field[] = [
  {
    name: 'isClosed',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    type: 'row',
    fields: [
      {
        name: 'opensAt',
        type: 'text',
        validate: validateTime,
        admin: {
          placeholder: '09:30',
          width: '50%',
          condition: (_, siblingData) => !siblingData?.isClosed,
        },
      },
      {
        name: 'closesAt',
        type: 'text',
        validate: validateClosesAt,
        admin: {
          placeholder: '18:30',
          width: '50%',
          condition: (_, siblingData) => !siblingData?.isClosed,
        },
      },
    ],
  },
]

// enumName must be unique per select, so each schedule array gets its own.
const workingHoursField = (enumName: string, overrides: Partial<Field> = {}): Field =>
  ({
    name: 'workingHours',
    type: 'array',
    labels: { singular: 'Schedule', plural: 'Working Hours' },
    admin: {
      description:
        'Regular weekly hours. Group days that share the same timing, e.g. Mon–Fri 09:30–18:30.',
    },
    fields: [
      {
        name: 'days',
        type: 'select',
        hasMany: true,
        required: true,
        enumName,
        options: DAY_OPTIONS,
      },
      ...timeRangeFields,
    ],
    ...overrides,
  }) as Field

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Contact & Locations',
  access: {
    read: () => true,
    update: authenticatedOnly,
  },
  admin: {
    group: 'Settings',
    description:
      'Organization-wide contact details, office and training-center locations, and operating hours.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryEmail',
                  type: 'email',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'supportEmail',
                  type: 'email',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                phoneField('primaryPhone', 'Primary Contact Number'),
                phoneField('alternatePhone', 'Alternate Contact Number'),
              ],
            },
            {
              type: 'row',
              fields: [
                phoneField('whatsappNumber', 'WhatsApp Number'),
                phoneField('tollFreeNumber', 'Toll-Free Number'),
              ],
            },
            {
              name: 'whatsappMessage',
              label: 'WhatsApp Pre-filled Message',
              type: 'text',
              admin: {
                placeholder: 'Hi, I would like to know more about your courses.',
              },
            },
            {
              name: 'websiteUrl',
              label: 'Website URL',
              type: 'text',
              validate: validateUrl,
              admin: { placeholder: 'https://www.example.com' },
            },
            {
              name: 'additionalContacts',
              type: 'array',
              labels: { singular: 'Contact', plural: 'Additional Contacts' },
              admin: {
                description: 'Department-specific emails or numbers, e.g. Admissions, Careers.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: { placeholder: 'Admissions', width: '30%' },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      defaultValue: 'phone',
                      enumName: 'enum_contact_settings_contact_type',
                      options: [
                        { label: 'Phone', value: 'phone' },
                        { label: 'Email', value: 'email' },
                        { label: 'Other', value: 'other' },
                      ],
                      admin: { width: '20%' },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Locations',
          fields: [
            {
              name: 'locations',
              type: 'array',
              labels: { singular: 'Location', plural: 'Locations' },
              validate: validateSinglePrimary,
              admin: {
                description: 'Drag to reorder; the first location is shown first on the site.',
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/LocationRowLabel',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Noida Head Office',
                        width: '50%',
                      },
                    },
                    {
                      name: 'locationType',
                      type: 'select',
                      required: true,
                      defaultValue: 'office',
                      enumName: 'enum_contact_settings_location_type',
                      options: [
                        { label: 'Head Office', value: 'head-office' },
                        { label: 'Office', value: 'office' },
                        { label: 'Training Center', value: 'training-center' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'isPrimary',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description: 'Main location used in the site header/footer.',
                        width: '50%',
                      },
                    },
                    {
                      name: 'isPublished',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        description: 'Uncheck to hide this location on the site.',
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Address & Map',
                  fields: [
                    {
                      name: 'addressLine1',
                      label: 'Address Line 1',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'addressLine2',
                      label: 'Address Line 2',
                      type: 'text',
                    },
                    {
                      name: 'landmark',
                      type: 'text',
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'city',
                          type: 'text',
                          required: true,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'state',
                          type: 'text',
                          admin: { width: '50%' },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'postalCode',
                          type: 'text',
                          admin: { width: '50%' },
                        },
                        {
                          name: 'country',
                          type: 'text',
                          defaultValue: 'India',
                          admin: { width: '50%' },
                        },
                      ],
                    },
                    {
                      name: 'mapUrl',
                      label: 'Google Maps Link',
                      type: 'text',
                      validate: validateUrl,
                    },
                    {
                      name: 'mapEmbedUrl',
                      label: 'Map Embed URL',
                      type: 'text',
                      validate: validateUrl,
                      admin: {
                        description: 'The src URL from the Google Maps "Embed a map" iframe.',
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'latitude',
                          type: 'number',
                          min: -90,
                          max: 90,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'longitude',
                          type: 'number',
                          min: -180,
                          max: 180,
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Location Contact',
                  admin: {
                    description: 'Leave blank to fall back to the organization contact details.',
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [phoneField('phone', 'Phone'), phoneField('alternatePhone', 'Alternate Phone')],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'email',
                          type: 'email',
                          admin: { width: '50%' },
                        },
                        phoneField('whatsappNumber', 'WhatsApp Number'),
                      ],
                    },
                    {
                      name: 'contactPerson',
                      type: 'text',
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Location Hours',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      name: 'useCustomHours',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        description:
                          'Override the organization hours (Hours & Timings tab) for this location.',
                      },
                    },
                    workingHoursField('enum_contact_settings_location_hours_days', {
                      admin: {
                        condition: (_, siblingData) => Boolean(siblingData?.useCustomHours),
                      },
                    } as Partial<Field>),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Hours & Timings',
          fields: [
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'Asia/Kolkata',
              admin: {
                description: 'IANA timezone name, e.g. Asia/Kolkata.',
              },
            },
            workingHoursField('enum_contact_settings_hours_days'),
            {
              name: 'specialHours',
              type: 'array',
              labels: { singular: 'Special Day', plural: 'Holidays & Special Hours' },
              admin: {
                description: 'Overrides for specific dates such as public holidays.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      admin: {
                        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' },
                        width: '50%',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      admin: { placeholder: 'Diwali', width: '50%' },
                    },
                  ],
                },
                ...timeRangeFields,
              ],
            },
            {
              name: 'hoursNote',
              type: 'textarea',
              admin: {
                description: 'Extra info shown with the hours, e.g. "Weekend batches by appointment".',
              },
            },
          ],
        },
      ],
    },
  ],
}
