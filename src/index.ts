import bodyParser from 'body-parser'
import express from 'express'

import CONFIG from '../config.json'

const app = express()

const persons = [
  {
    name: 'Jon George',
    age: 45
  }
]

app.listen(CONFIG.httpPort, () => {
  console.log('Server is listening on:', CONFIG.httpPort)
})

app.use(bodyParser.json({ limit: '1mb' }))

app.get('/persons', (req, res, next) => {
  res.send(persons)
})

app.post('/persons', (req, res, next) => {
  const receivedPerson = req.body
  if (
    receivedPerson.name === CONFIG.name &&
    receivedPerson.age === CONFIG.age
  ) {
    persons.push(receivedPerson)
    res.json(persons)
  } else {
    res.json(false)
  }
})
