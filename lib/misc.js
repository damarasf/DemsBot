const { fetchJson, fetchText } = require('../tools/fetcher')
const config = require('../config.json')
const moment = require('moment-timezone')
const needle = require('needle')

/**
 * Get jadwal sholat.
 * @param {string} city
 * @returns {Promise<object>}
 */
const jadwalSholat = (city) => new Promise((resolve, reject) => {
    const url = 'https://api.banghasan.com/sholat/format/json'
    const kodeKota = new Array()
    const tanggal = moment.tz('Asia/Jakarta').format('YYYY-MM-DD')
    console.log(`Get jadwal sholat for ${city}...`)
    needle(url + '/kota/nama/' + city, (err, resp, body) => {
        if (err) throw err
        switch (body.kota.length) {
            case 0:
                reject('Kota tidak ditemukan!')
            break
            default:
                kodeKota.push(body.kota[0]['id'])
                needle(url + '/jadwal/kota/' + kodeKota[0] + '/tanggal/' + tanggal, (err, resp, body) => {
                    if (err) throw err
                    resolve([body.jadwal.data])
                })
            break
        }
    })
})

module.exports = {
    jadwalSholat
}
