# submit-url

Submit url to baidu google bing search engine.

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
