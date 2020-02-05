// Disable order checking for tests, so that the second
// request has a chance to match against the first request
import { jestPollyConfigService } from './config';

jestPollyConfigService.config = {
	matchRequestsBy: {
		order: false
	}
};

import http from 'http';
import fetch from 'node-fetch';
import './jest-polly';

const RESPONSE = 'Hello World!';

const server = http.createServer((_req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(RESPONSE);
  res.end();
})

beforeEach(done => {
	server.listen(8080).once('listening', done);
})

afterEach(done => {
	server.close().once('close', done);
})

test('replays recording', async done => {
	expect.assertions(1);

  // Records if missing
  await fetchMessage();

  // Go offline
  server.close().once('close', async () => {
		// Replays recording
		const message = await fetchMessage();
    expect(message).toBe(RESPONSE);
    done();
  })
});

async function fetchMessage() {
	const response = await fetch('http://localhost:8080');
  return response.text();
}
