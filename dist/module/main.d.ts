interface Config {
    siteURL: string;
    baiduToken?: string;
    googleClientEmail?: string;
    googlePrivateKey?: string;
    bingAPIKey?: string;
}
export default class SubmitURL {
    private siteURL;
    private siteHost;
    private baiduToken;
    private googleClientEmail;
    private googlePrivateKey;
    private bingAPIKey;
    constructor(config: Config);
    toBaidu(urlList: Array<string>): Promise<{
        code: number;
        msg: string;
        result: {
            success: any;
            remain: any;
            status?: undefined;
            data?: undefined;
        };
    } | {
        code: number;
        msg: string;
        result: {
            status: number;
            data: any;
            success?: undefined;
            remain?: undefined;
        };
    }>;
    toGoogle(urlList: Array<string>): Promise<{
        code: number;
        msg: string;
        result: {
            successNumber: number;
            commitLog: PromiseSettledResult<any>[];
        };
    }>;
    toBing(urlList: Array<string>): Promise<{
        code: number;
        msg: string;
        result: any;
    }>;
}
export {};
