import config from '@payload-config'
import { getPayload } from 'payload'

// One-off: categories created before `orderable` was enabled have no `_order` key.
// Saving them lets Payload's orderable hook append a key, in alphabetical order.
const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'categories',
  depth: 0,
  pagination: false,
  sort: 'name',
  where: { _order: { exists: false } },
})

for (const category of docs) {
  await payload.update({ collection: 'categories', id: category.id, data: {} })
  payload.logger.info(`Assigned order to category "${category.name}"`)
}

payload.logger.info(`Backfilled ${docs.length} categories.`)
process.exit(0)
