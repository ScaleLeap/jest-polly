// Disable order checking for tests, so that the second
// request has a chance to match against the first request
import { jestPollyConfigService } from './config'

jestPollyConfigService.config = {
  matchRequestsBy: {
    order: false,
  },
}

import http from 'http'
import fetch from 'node-fetch'
import './jest-polly'

type Server = ReturnType<typeof http.createServer>

const createServer = (response: string, contentType = 'text/plain') =>
  new Promise<Server>((resolve, reject) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': contentType })
      res.write(response)
      res.end()
    })

    server
      .listen(8080)
      .once('error', reject)
      .once('listening', () => resolve(server))

    return server
  })

const destroyServer = (server: Server) =>
  new Promise((resolve, reject) => {
    return server
      .close()
      .once('error', reject)
      .once('close', resolve)
  })

test('replays recording', async () => {
  expect.assertions(1)

  const RESPONSE = 'Hello World!'

  const server = await createServer(RESPONSE)

  // Records if missing
  await fetchMessage()

  // Go offline
  await destroyServer(server)

  // Replays recording
  const message = await fetchMessage()
  expect(message).toBe(RESPONSE)
})

test('expands JSON response to JSON object', async () => {
  expect.assertions(1)

  const RESPONSE = JSON.stringify({ a: true })

  const server = await createServer(RESPONSE, 'application/json')

  // Records if missing
  await fetchMessage()

  // Go offline
  await destroyServer(server)

  // Replays recording
  const message = await fetchMessage()
  expect(message).toBe(RESPONSE)
})

async function fetchMessage() {
  const response = await fetch('http://localhost:8080')
  return response.text()
}
