import { AxiosBuilder } from '@fangcha/app-request'
import { HttpsProxyAgent } from 'https-proxy-agent'

export class HttpUtils {
  public static fixHttpsProxy(request: AxiosBuilder) {
    if (request.getRequestUrl().startsWith('https://') && process.env.https_proxy) {
      const httpsAgent = new HttpsProxyAgent(process.env.https_proxy)
      request.addAxiosConfig({ proxy: false, httpsAgent: httpsAgent })
    }
  }
}
