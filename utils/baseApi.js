const AppError = require("./appError");
const fetch = require("node-fetch");

class BaseApi {
    constructor(url) {
        this.baseUrl = url;
    }

    fetch = async (url, body, args, requestInit) => {
        try {
            const urlObj = new URL(url, this.newUrl);
            if (args) {
                urlObj.search = new URLSearchParams(args).toString();
            }
            const requestOptions = { ...requestInit, body };
            const response = await fetch(urlObj.toString, requestOptions);
            if (!response.ok) {
                let errorMsg = response.text;
                new AppError(errorMsg, 400);
            }

            if (response.status === 204) {
                return;
            }
            return response.json();
        } catch (error) {
            new AppError(error.message);
        }
    };

    get = (url, args, requestInit) =>
        this.fetch(url, undefined, args, { ...requestInit, method: "GET" });

    post = (url, body, args, requestInit) => {
        const bodyString = body ? JSON.stringify(body) : undefined;
        return this.fetch(url, bodyString, args, {
            ...requestInit,
            method: "POST",
        });
    };
}

module.exports = BaseApi;
