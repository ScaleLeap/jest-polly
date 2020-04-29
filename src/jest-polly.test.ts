// Disable order checking for tests, so that the second
// request has a chance to match against the first request
import './jest-polly'

import http from 'http'
import fetch from 'node-fetch'

import { jestPollyConfigService } from './config'

jestPollyConfigService.config = {
  matchRequestsBy: {
    order: false,
  },
}

type Server = ReturnType<typeof http.createServer>

const createServer = (response: string, contentType = 'text/plain') =>
  new Promise<Server>((resolve, reject) => {
    const server = http.createServer((_request, response_) => {
      response_.writeHead(200, { 'Content-Type': contentType })
      response_.write(response)
      response_.end()
    })

    server
      .listen(8080)
      .once('error', reject)
      .once('listening', () => resolve(server))

    return server
  })

const destroyServer = (server: Server) =>
  new Promise((resolve, reject) => {
    return server.close().once('error', reject).once('close', resolve)
  })

async function fetchMessage() {
  const response = await fetch('http://localhost:8080')
  return response.text()
}

// eslint-disable-next-line jest/require-top-level-describe
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

// eslint-disable-next-line jest/require-top-level-describe
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

// eslint-disable-next-line jest/require-top-level-describe, sonarjs/no-identical-functions
test('does not expand previously stringified JSON response', async () => {
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
