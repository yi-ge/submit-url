import Fastify from 'fastify'
import fastifyCORS from '@fastify/cors'
import SubmitURL from '../dist/cmjs/main'

// Please provide a random value.
const token = process.env.TOKEN || ''

const submitURL = new SubmitURL({
  siteURL: process.env.SITE_URL || '',
  baiduToken: process.env.BAIDU_TOKEN || '',
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
  bingAPIKey: process.env.BING_API_KEY || ''
})

const server = Fastify()
await server.register(fastifyCORS, {
  // put your options here
})

server.post<{
  Body: {
    token: string,
    urlList: string[]
  }
}>('/', async (request) => {
  const urlList = request.body.urlList
  if (request.body.token === token && urlList) {
    // @ts-ignore - typescript isn't smart enough to see the disjoint here
    const [baidu, google, bing] = await Promise.allSettled([
      submitURL.toBaidu(urlList),
      submitURL.toGoogle(urlList),
      submitURL.toBing(urlList)
    ])

    return { baidu, google, bing }
  }

  return {
    code: 403,
    msg: 'Authorization required.'
  }
})

server.listen(80, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

try {
  await server.listen({ port: 80, host: '0.0.0.0' })

  const address = server.server.address()
  const port = typeof address === 'string' ? address : address?.port
  console.log(`Server listening at ${address}:${port}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
