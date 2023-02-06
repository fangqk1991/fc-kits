import { axiosGET } from '../src'
import * as tunnel from 'tunnel'

describe('Test HttpProxy.test.ts', () => {
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
    const httpsAgent = tunnel.httpsOverHttp({ proxy: proxyOptions })
    console.info(
      `V2Ray Proxy HTTPS: `,
      await axiosGET('https://ifconfig.co/ip').addAxiosConfig({ proxy: false, httpsAgent: httpsAgent }).quickSend()
    )
  })
})
