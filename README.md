# Submit URL

Submit url to baidu google bing search engine.

## API

### Installation

```bash
npm install submit-url
```

### Usage Example

```javascript
import submitURL from 'submit-url'

const submitURL = new SubmitURL({
  siteURL: process.env.SITE_URL || '',
  baiduToken: process.env.BAIDU_TOKEN || '',
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
  bingAPIKey: process.env.BING_API_KEY || ''
})

const [baidu, google, bing] = await Promise.allSettled([
  submitURL.toBaidu(urlList),
  submitURL.toGoogle(urlList),
  submitURL.toBing(urlList)
])

return { baidu, google, bing }
```

## API Service with Docker

### Usage Example

```bash
docker run --name submit-url -itd -m 300m --restart=always \
-e TOKEN=cbe205ad-1026-4906-8caa-cf4ab8b35d1a \
-e SITE_URL=https://www.xxx.xx \
-e BAIDU_TOKEN=bKRK********EiOB \
-e BING_API_KEY=3356082b***************7b039e756 \
-e GOOGLE_CLIENT_EMAIL=blog-***@blog-******.iam.gserviceaccount.com \
-e GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n********\n-----END PRIVATE KEY-----\n" \
-p 8080:80 \
wy373226722/submit-url:latest
```

### Documentation

[将新文章推送到百度、谷歌、Bing搜索引擎](https://www.wyr.me/post/631)
