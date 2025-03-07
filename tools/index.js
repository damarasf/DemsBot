const chalk = require('chalk')
const crypto = require('crypto')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

/**
 * Get text with color.
 * @param {string} text 
 * @param {string} [color] 
 */
const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

/**
 * Create serial ID.
 * @param {number} size 
 * @returns {string}
 */
const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size)
}

/**
 * URL validator.
 * @param {string} url 
 * @returns {boolean}
 */
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi))
}

/**
 * Get time duration.
 * @param {Date} timestamp 
 * @param {Date} now 
 * @returns {number}
 */
const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const chromeArgs = [
		"--aggressive-cache-discard",
		"--aggressive-tab-discard",
		"--disable-accelerated-2d-canvas",
		"--disable-application-cache",
		"--disable-cache",
		"--disable-dev-shm-usage",
		"--disable-gpu",
		"--disable-offline-load-stale-cache",
		"--disable-setuid-sandbox",
		"--disable-setuid-sandbox",
		"--disk-cache-size=0",
		"--ignore-certificate-errors",
		"--no-first-run",
		"--no-sandbox",
		"--no-zygote"
	]

/**
 * Client options.
 * @param {Function} start 
 * @returns {object}
 */
const options = (start) => {
    const options = {
        sessionId: 'DemsBot',
        headless: true,
        qrTimeout: 0,
        authTimeout: 0,
        restartOnCrash: start,
        cacheEnabled: false,
        multiDevice: true, // change to true if you want run multidevice mode
        licenseKey: 'YOUR-LICENSE-KEY', // If you have license key, put here your license key
        useChrome: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: false,
        disableSpins: true,
        chromiumArgs: chromeArgs
    }
    return options
}

// Anti-spam
const usedCommandRecently = new Set()

/**
 * Check is number filtered.
 * @param {string} from 
 * @returns {boolean}
 */
const isFiltered = (from) => {
    return !!usedCommandRecently.has(from)
}

/**
 * Add filter to number.
 * @param {string} from 
 */
const addFilter = (from) => {
    usedCommandRecently.add(from)
    setTimeout(() => {
        return usedCommandRecently.delete(from)
    }, 2000) // 2 seconds delay
}

module.exports = {
    msgFilter: {
        isFiltered,
        addFilter
    },
    color,
    isUrl,
    processTime,
    options,
    createSerial
}
