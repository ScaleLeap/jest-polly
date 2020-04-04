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

const RESPONSE = 'Hello World!'

type Server = ReturnType<typeof http.createServer>

const createServer = () =>
  new Promise<Server>((resolve, reject) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.write(RESPONSE)
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

let server: Server

beforeEach(async () => {
  server = await createServer()
})

afterEach(() => destroyServer(server))

test('replays recording', async done => {
  expect.assertions(1)

  // Records if missing
  await fetchMessage()

  // Go offline
  server.close().once('close', async () => {
    // Replays recording
    const message = await fetchMessage()
    expect(message).toBe(RESPONSE)
    done()
  })
})

async function fetchMessage() {
  const response = await fetch('http://localhost:8080')
  return response.text()
}
