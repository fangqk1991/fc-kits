import { axiosGET } from '@fangcha/app-request'
import { HttpsProxyAgent } from 'https-proxy-agent'

process.env.http_proxy = 'http://127.0.0.1:19889'
process.env.https_proxy = 'http://127.0.0.1:19889'
process.env.all_proxy = 'socks5://127.0.0.1:19888'

describe('Test HttpsProxyAgent.tests.ts', () => {
  it(`Test HttpsProxyAgent`, async () => {
    const request = axiosGET('https://ifconfig.co/json')
    if (request.getRequestUrl().startsWith('https://') && process.env.https_proxy) {
      const httpsAgent = new HttpsProxyAgent(process.env.https_proxy)
      request.addAxiosConfig({ proxy: false, httpsAgent: httpsAgent })
    }
    await request.quickSend().then((response) => console.info(response))
  })

  it(`Test Default Proxies`, async () => {
    const url = 'http://ifconfig.co/ip'
    console.info(`Default Proxy: `, await axiosGET(url).quickSend())
    console.info(`Default Proxy: `, await axiosGET(url).addAxiosConfig({ proxy: false }).quickSend())
  })

  it(`Test HTTP Proxies`, async () => {
    const proxyOptions = { host: '127.0.0.1', port: 6152 }
    console.info(
      `V2Ray Proxy HTTP: `,
      await axiosGET('http://ifconfig.co/ip').addAxiosConfig({ proxy: proxyOptions }).quickSend()
    )
    const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:6152')
    console.info(
      `V2Ray Proxy HTTPS: `,
      await axiosGET('https://ifconfig.co/ip').addAxiosConfig({ proxy: false, httpsAgent: httpsAgent }).quickSend()
    )
  })
})
