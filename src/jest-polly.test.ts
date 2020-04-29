// Disable order checking for tests, so that the second
// request has a chance to match against the first request
import './jest-polly'

import http from 'http'
import fetch from 'node-fetch'

import { jestPollyConfigService } from './config'

const APPLICATION_JSON_MIME = 'application/json'

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

async function postMessage() {
  const response = await fetch('http://localhost:8080', {
    method: 'POST',
    headers: {
      'Content-Type': APPLICATION_JSON_MIME,
    },
    body: JSON.stringify({
      a: true,
    }),
  })

  return response.json()
}

describe('jest-polly', () => {
  it('replays recording', async () => {
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

  it('expands JSON response to JSON object', async () => {
    expect.assertions(1)

    const RESPONSE = JSON.stringify({ a: true })

    const server = await createServer(RESPONSE, APPLICATION_JSON_MIME)

    // Records if missing
    await fetchMessage()

    // Go offline
    await destroyServer(server)

    // Replays recording
    const message = await fetchMessage()

    expect(message).toBe(RESPONSE)
  })

  // eslint-disable-next-line sonarjs/no-identical-functions
  it('does not expand previously stringified JSON response', async () => {
    expect.assertions(1)

    const RESPONSE = JSON.stringify({ a: true })

    const server = await createServer(RESPONSE, APPLICATION_JSON_MIME)

    // Records if missing
    await fetchMessage()

    // Go offline
    await destroyServer(server)

    // Replays recording
    const message = await fetchMessage()

    expect(message).toBe(RESPONSE)
  })

  it('expands JSON request body', async () => {
    expect.assertions(1)

    const server = await createServer('{}')

    await postMessage()

    // Go offline
    await destroyServer(server)

    // Replays recording
    const message = await postMessage()

    expect(message).toStrictEqual({})
  })
})
