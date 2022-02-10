import cors from 'cors'
import express from 'express'

import { httpPort } from '../../config.json'
import { initializeEdgeContextAndUser } from './edgecore'
import { routes } from './routes'

async function main(): Promise<void> {
  const { context, account } = await initializeEdgeContextAndUser()
  const app = express()

  app.use(express.json())
  app.use(cors())

  routes(app, context, account)

  app.listen(httpPort, () => {
    console.log('Server is listening on:', httpPort)
  })
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
