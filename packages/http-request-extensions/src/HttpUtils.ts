import { AxiosBuilder } from '@fangcha/app-request'
import { HttpsProxyAgent } from 'https-proxy-agent'
import * as url from 'url'
import * as tunnel from 'tunnel'

interface Params {
  proxyUrl?: string
  usingTunnel?: boolean
}

export class HttpUtils {
  public static makeHttpsProxy(proxyUrl: string, usingTunnel?: boolean) {
    if (usingTunnel) {
      const options = url.parse(proxyUrl)
      return tunnel.httpsOverHttp({
        proxy: {
          host: options.hostname || '',
          port: Number(options.port),
          proxyAuth: options.auth || undefined,
        },
      })
    } else {
      return new HttpsProxyAgent(proxyUrl)
    }
  }

  public static fixHttpsProxy(request: AxiosBuilder, options: Params = {}) {
    const proxyUrl = options.proxyUrl || process.env.https_proxy
    if (request.getRequestUrl().startsWith('https://') && proxyUrl) {
      request.addAxiosConfig({ proxy: false, httpsAgent: this.makeHttpsProxy(proxyUrl, options.usingTunnel) })
    }
  }
}
