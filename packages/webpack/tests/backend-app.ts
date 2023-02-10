import * as http from 'http'

http
  .createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('PONG\n')
  })
  .listen(3000)
