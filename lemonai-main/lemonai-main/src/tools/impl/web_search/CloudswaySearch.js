const axios = require('axios');

const HOST = 'https://searchapi.cloudsway.net/search/{endpoint}/base';

class CloudswaySearch {
    constructor({access_key: ACCESS_KEY, endpoint: ENDPOINT}) {
        this.ACCESS_KEY = ACCESS_KEY;
        this.ENDPOINT = ENDPOINT;
        this.baseUrl = HOST.replace('{endpoint}', this.ENDPOINT);
    }

    async search(query, options = {}) {
        const defaultOptions = {
            count: 1,
            safeSearch: 'Strict'
        };

        const requestOptions = {
            ...defaultOptions,
            ...options,
            q: query,
            count: options.max_results || 1 // override default count
        };

        try {
            const url = new URL(this.baseUrl);
            Object.entries(requestOptions).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value);
                }
            });

            const response = await axios.get(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${this.ACCESS_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            this.result = response.data;
            return this.result;
        } catch (error) {
            console.error('Cloudsway Search error:', error);
            throw error;
        }
    }

    async formatContent() {
        const {queryContext, webPages} = this.result;
        const list = [];
        for (const item of webPages?.value || []) {
            const description = `URL: ${item.url || 'N/A'}\nTitle: ${item.name || item.title || 'N/A'}\nContent: ${item.snippet || item.content || 'N/A'}\n`;
            list.push(description);
        }
        return list.join('======\n======');
    }

    async formatJSON() {
        const {queryContext,webPages = []} = this.result;
        let result = []
        for (const item of webPages?.value|| []) {
            result.push({
                url: item.url,
                title: item.name,
                content: item.snippet
            });
        }
        return result;
    }

    async check() {
        try {
            const testQuery = "test connection";
            const url = new URL(this.baseUrl);
            url.searchParams.append('q', testQuery);
            url.searchParams.append('max_results', '1');
            url.searchParams.append('search_depth', 'basic');

            const response = await axios.get(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${this.ACCESS_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                return {status: 'success', message: 'Cloudsway Search API connection successful.'};
            } else {
                return {status: 'fail', message: `Cloudsway Search API returned status: ${response.status}`};
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    return {status: 'fail', message: 'Cloudsway Search API key is invalid or unauthorized.'};
                } else {
                    return {
                        status: 'fail',
                        message: `Cloudsway Search API error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`
                    };
                }
            } else if (error.request) {
                return {
                    status: 'fail',
                    message: 'No response received from Cloudsway Search API. Check network connection.'
                };
            } else {
                return {status: 'fail', message: `An unexpected error occurred: ${error.message}`};
            }
        }
    }
}

module.exports = CloudswaySearch;