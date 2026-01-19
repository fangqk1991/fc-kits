import { AxiosBuilder } from '@fangcha/app-request'
import { HttpsProxyAgent } from 'https-proxy-agent'
import * as url from 'url'
import * as tunnel from 'tunnel'

interface Params {
  proxyUrl?: string
  usingTunnel?: boolean
}

export class HttpUtils {
  public static fixHttpsProxy(request: AxiosBuilder, options: Params = {}) {
    const proxyUrl = options.proxyUrl || process.env.https_proxy
    if (request.getRequestUrl().startsWith('https://') && proxyUrl) {
      if (options.usingTunnel) {
        const parsedProxyUrl = url.parse(proxyUrl)
        const httpsAgent = tunnel.httpsOverHttp({
          proxy: {
            host: parsedProxyUrl.hostname || '',
            port: Number(parsedProxyUrl.port),
            proxyAuth: parsedProxyUrl.auth || undefined,
          },
        })
        request.addAxiosConfig({ proxy: false, httpsAgent: httpsAgent })
      } else {
        const httpsAgent = new HttpsProxyAgent(proxyUrl)
        request.addAxiosConfig({ proxy: false, httpsAgent: httpsAgent })
      }
    }
  }
}
