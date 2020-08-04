"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const fastifyCORS = require("fastify-cors");
const main_1 = require("../cmjs/main");
// Please provide a random value.
const token = process.env.TOKEN || '';
const submitURL = new main_1.default({
    siteURL: process.env.SITE_URL || '',
    baiduToken: process.env.BAIDU_TOKEN || '',
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    bingAPIKey: process.env.BING_API_KEY || ''
});
const server = fastify_1.default();
server.register(fastifyCORS);
server.post('/', (request) => __awaiter(void 0, void 0, void 0, function* () {
    const urlList = request.body.urlList;
    if (request.body.token === token && urlList) {
        // @ts-ignore - typescript isn't smart enough to see the disjoint here
        const [baidu, google, bing] = yield Promise.allSettled([
            // submitURL.toBaidu(urlList),
            null,
            submitURL.toGoogle(urlList),
            null
            // submitURL.toBing(urlList)
        ]);
        return { baidu, google, bing };
    }
    return {
        code: 403,
        msg: 'Authorization required.'
    };
}));
server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
