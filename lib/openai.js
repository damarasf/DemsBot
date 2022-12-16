const { fetchJson } = require('../tools/fetcher')

const config = require('../config.json')

/**
 * openai chatgpt3.
 * @param {string} text
 * @returns {Promise<object>}
*/
const chatgpt3 = (text) => new Promise((resolve, reject) => {
    console.log('Searching for chatgpt3...')
    fetchJson('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.openai
        },
        body: JSON.stringify({
            prompt: text,
            max_tokens: 100,
            temperature: 0.9,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['\n', ' Human:', ' AI:']
        })
    })
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

module.exports = {
    chatgpt3
}

