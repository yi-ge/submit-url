var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { google } from 'googleapis';
import { URL } from 'url';
export default class SubmitURL {
    constructor(config) {
        this.siteURL = config.siteURL;
        this.siteHost = new URL(this.siteURL).host;
        this.baiduToken = config.baiduToken;
        this.googleClientEmail = config.googleClientEmail;
        this.googlePrivateKey = config.googlePrivateKey;
        this.bingAPIKey = config.bingAPIKey;
    }
    toBaidu(urlList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.baiduToken)
                return;
            const res = yield axios({
                method: 'post',
                url: `http://data.zz.baidu.com/urls?site=${this.siteHost}&token=${this.baiduToken}`,
                headers: { 'content-type': 'text/plain' },
                data: urlList.join('\n')
            });
            if (res.status === 200) {
                return {
                    code: 1,
                    msg: 'success',
                    result: {
                        success: res.data.success,
                        remain: res.data.remain
                    }
                };
            }
            else {
                return {
                    code: 0,
                    msg: res.statusText,
                    result: {
                        status: res.status,
                        data: res.data
                    }
                };
            }
        });
    }
    toGoogle(urlList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.googleClientEmail || !this.googlePrivateKey)
                return;
            this.googlePrivateKey = this.googlePrivateKey.replace(/\\n/g, '\n');
            const jwtClient = new google.auth.JWT(this.googleClientEmail, null, this.googlePrivateKey, ['https://www.googleapis.com/auth/indexing'], null);
            const getAccessToken = () => {
                return new Promise((resolve, reject) => {
                    jwtClient.authorize(function (err, tokens) {
                        if (err) {
                            reject(err);
                        }
                        resolve(tokens.access_token);
                    });
                });
            };
            const commitOneUrl = (accessToken, url) => __awaiter(this, void 0, void 0, function* () {
                const res = yield axios({
                    method: 'post',
                    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        url,
                        type: 'URL_UPDATED'
                    }
                });
                if (res && res.status === 200) {
                    return {
                        code: 1,
                        msg: 'success',
                        result: res.data
                    };
                }
                else {
                    return {
                        code: 0,
                        msg: res && res.statusText,
                        result: res
                    };
                }
            });
            const accessToken = yield getAccessToken();
            const job = [];
            for (const url of urlList) {
                job.push(commitOneUrl(accessToken, url));
            }
            const res = yield Promise.allSettled(job);
            return {
                code: 1,
                msg: 'success',
                result: {
                    successNumber: res.filter(item => item && item.status === 'fulfilled' && item.value && item.value.code === 1).length,
                    commitLog: res
                }
            };
        });
    }
    toBing(urlList) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.bingAPIKey)
                return;
            const res = yield axios({
                method: 'post',
                url: `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${this.bingAPIKey}`,
                data: {
                    siteUrl: this.siteURL,
                    urlList
                }
            });
            if (res.status === 200 && res.data.d === null) {
                return {
                    code: 1,
                    msg: 'success',
                    result: res.data
                };
            }
            else {
                return {
                    code: 0,
                    msg: res.statusText,
                    result: {
                        status: res.status,
                        data: res.data
                    }
                };
            }
        });
    }
}
