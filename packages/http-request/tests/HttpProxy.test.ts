import { axiosGET } from '../src'
import * as tunnel from 'tunnel'

describe('Test HttpProxy.test.ts', () => {
  it(`Test Default Proxies`, async () => {
    const url = 'http://ifconfig.co/ip'
    console.info(`Default Proxy: `, await axiosGET(url).quickSend())
    console.info(`Default Proxy: `, await axiosGET(url).addAxiosConfig({ proxy: false }).quickSend())
  })

  it(`Test Normal Proxies`, async () => {
    const url = 'https://ifconfig.co/ip'
    const normalProxy = { host: '127.0.0.1', port: 19111 }
    console.info(`Normal Proxy: `, await axiosGET(url).addAxiosConfig({ proxy: normalProxy }).quickSend())
  })

  it(`Test V2Ray HTTP Proxies`, async () => {
    const v2rayProxy = { host: '127.0.0.1', port: 19889 }
    console.info(
      `V2Ray Proxy HTTP: `,
      await axiosGET('http://ifconfig.co/ip').addAxiosConfig({ proxy: v2rayProxy }).quickSend()
    )
    const httpsAgent = tunnel.httpsOverHttp({ proxy: v2rayProxy })
    console.info(
      `V2Ray Proxy HTTPS: `,
      await axiosGET('https://ifconfig.co/ip').addAxiosConfig({ proxy: false, httpsAgent: httpsAgent }).quickSend()
    )
    console.info(
      `V2Ray Proxy HTTPS: `,
      await axiosGET('https://ifconfig.co/ip').addAxiosConfig({ proxy: v2rayProxy }).quickSend()
    )
  })
})
