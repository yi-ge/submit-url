import axios from 'axios'
import { google } from 'googleapis'
import { URL } from 'url'

interface Config {
  siteURL: string;
  baiduToken?: string;
  googleClientEmail?: string;
  googlePrivateKey?: string;
  bingAPIKey?: string
}

export default class SubmitURL {
  private siteURL: string;
  private siteHost: string;
  private baiduToken: string;
  private googleClientEmail: string;
  private googlePrivateKey: string;
  private bingAPIKey: string;

  constructor (config: Config) {
    this.siteURL = config.siteURL
    this.siteHost = new URL(this.siteURL).host
    this.baiduToken = config.baiduToken
    this.googleClientEmail = config.googleClientEmail
    this.googlePrivateKey = config.googlePrivateKey
    this.bingAPIKey = config.bingAPIKey
  }

  async toBaidu (urlList: Array<string>) {
    if (!this.baiduToken) return

    const res = await axios({
      method: 'post',
      url: `http://data.zz.baidu.com/urls?site=${this.siteHost}&token=${this.baiduToken}`,
      headers: { 'content-type': 'text/plain' },
      data: urlList.join('\n')
    })

    if (res.status === 200) {
      return {
        code: 1,
        msg: 'success',
        result: {
          success: res.data.success,
          remain: res.data.remain
        }
      }
    } else {
      return {
        code: 0,
        msg: res.statusText,
        result: {
          status: res.status,
          data: res.data
        }
      }
    }
  }

  async toGoogle (urlList: Array<string>) {
    if (!this.googleClientEmail || !this.googlePrivateKey) return

    this.googlePrivateKey = this.googlePrivateKey.replace(/\\n/g, '\n')

    const jwtClient = new google.auth.JWT(
      this.googleClientEmail,
      null,
      this.googlePrivateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    )

    const getAccessToken = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        jwtClient.authorize(function (err, tokens) {
          if (err) {
            reject(err)
          }

          resolve(tokens.access_token)
        })
      })
    }

    const commitOneUrl = async (accessToken: string, url: string): Promise<any> => {
      const res = await axios({
        method: 'post',
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        data: {
          url,
          type: 'URL_UPDATED'
        }
      })

      if (res && res.status === 200) {
        return {
          code: 1,
          msg: 'success',
          result: res.data
        }
      } else {
        return {
          code: 0,
          msg: res && res.statusText,
          result: res
        }
      }
    }

    const accessToken = await getAccessToken()
    const job = []

    for (const url of urlList) {
      job.push(commitOneUrl(accessToken, url))
    }

    const res = await Promise.allSettled(job)

    return {
      code: 1,
      msg: 'success',
      result: {
        successNumber: res.filter(item => item && item.status === 'fulfilled' && item.value && item.value.code === 1).length,
        commitLog: res
      }
    }
  }

  async toBing (urlList: Array<string>) {
    if (!this.bingAPIKey) return

    const res = await axios({
      method: 'post',
      url: `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${this.bingAPIKey}`,
      data: {
        siteUrl: this.siteURL,
        urlList
      }
    })

    if (res.status === 200 && res.data.d === null) {
      return {
        code: 1,
        msg: 'success',
        result: res.data
      }
    } else {
      return {
        code: 0,
        msg: res.statusText,
        result: {
          status: res.status,
          data: res.data
        }
      }
    }
  }
}
