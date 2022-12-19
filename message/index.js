/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-irregular-whitespace */

/********** MODULES **********/
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const os = require('os')
const isPorn = require('is-porn')
const config = require('../config.json')
const ms = require('parse-ms')
const toMs = require('ms')
const mathjs = require('mathjs')
const emojiUnicode = require('emoji-unicode')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const google = require('google-it')
const cron = require('node-cron')
/********** END OF MODULES **********/

/********** UTILS **********/
const { msgFilter, color, processTime, isUrl, createSerial } = require('../tools')
const { fun, misc, toxic } = require('../lib')
const { uploadImages } = require('../tools/fetcher')
const { ind } = require('./text/lang/')
const { daily, register, afk, reminder, premium, limit} = require('../function')
const cd = 4.32e+7
const limitCount = 30
const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'
const dateNow = moment.tz('Asia/Jakarta').format('DD-MM-YYYY')
// config openai
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/********** END OF UTILS **********/

/********** DATABASES **********/
const _openaig = JSON.parse(fs.readFileSync('./database/group/openai.json'))
const _openaiu = JSON.parse(fs.readFileSync('./database/user/openai.json'))
const _antilink = JSON.parse(fs.readFileSync('./database/group/antilink.json'))
const _antinsfw = JSON.parse(fs.readFileSync('./database/group/antinsfw.json'))
const _welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'))
const _autosticker = JSON.parse(fs.readFileSync('./database/group/autosticker.json'))
const _ban = JSON.parse(fs.readFileSync('./database/bot/banned.json'))
const _premium = JSON.parse(fs.readFileSync('./database/bot/premium.json'))
const _mute = JSON.parse(fs.readFileSync('./database/bot/mute.json'))
const _registered = JSON.parse(fs.readFileSync('./database/bot/registered.json'))
let _limit = JSON.parse(fs.readFileSync('./database/user/limit.json'))
const _afk = JSON.parse(fs.readFileSync('./database/user/afk.json'))
const _reminder = JSON.parse(fs.readFileSync('./database/user/reminder.json'))
const _daily = JSON.parse(fs.readFileSync('./database/user/daily.json'))
const _stick = JSON.parse(fs.readFileSync('./database/bot/sticker.json'))
const _setting = JSON.parse(fs.readFileSync('./database/bot/setting.json'))
let { memberLimit, groupLimit } = _setting
/********** END OF DATABASES **********/

/********** MESSAGE HANDLER **********/
// eslint-disable-next-line no-undef
module.exports = msgHandler = async (client = new Client(), message) => {
    try {
        const { type, id, fromMe, from, t, sender, buttons, selectedButtonId, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, chatId, mentionedJidList, author } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName
        const botNumber = await client.getHostNumber() + '@c.us'
        const blockNumber = await client.getBlockedIds()
        const ownerNumber = config.ownerBot
        const authorWm = config.authorStick
        const packWm = config.packStick
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss')

        const cmd = caption || body || ''
        const command = cmd.toLowerCase().split(' ')[0] || ''
        const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(command) ? command.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi) : '-'
        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video' || type === 'buttons_response') && caption) && caption.startsWith(prefix)) ? caption : ''
        const args = body.trim().split(/ +/).slice(1)
        const uaOverride = config.uaOverride
        const q = args.join(' ')
        const ar = args.map((v) => v.toLowerCase())
        const url = args.length !== 0 ? args[0] : ''
        const prompt = `${body}`
        // const prompt = `${body}\ n\ nContext:\ n${chats}\ n\ nQ: ${q}\ nA:`
        // const prompt = chats

        /********** VALIDATOR **********/
        const isCmd = body.startsWith(prefix)
        const isBlocked = blockNumber.includes(sender.id)
        const isOwner = ownerNumber.includes(sender.id)
        const isBanned = _ban.includes(sender.id)
        const isPremium = premium.checkPremiumUser(sender.id, _premium)
        const isRegistered = register.checkRegisteredUser(sender.id, _registered)
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
        const isOpenAiOnGroup = isGroupMsg ? _openaig.includes(groupId) : false
        const isOpenAiOn = _openaiu.includes(sender.id)
        const isWelcomeOn = isGroupMsg ? _welcome.includes(groupId) : false
        const isDetectorOn = isGroupMsg ? _antilink.includes(groupId) : false
        const isAutoStickerOn = isGroupMsg ? _autosticker.includes(groupId) : false
        const isAntiNsfw = isGroupMsg ? _antinsfw.includes(groupId) : false
        const isMute = isGroupMsg ? _mute.includes(chat.id) : false
        const isAfkOn = isGroupMsg ? afk.checkAfkUser(sender.id, _afk) : false
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
        const isQuotedVoice = quotedMsg && quotedMsg.type === 'ptt'
        const isImage = type === 'image'
        const isVideo = type === 'video'
        const isAudio = type === 'audio'
        const isVoice = type === 'ptt'
        const isGif = mimetype === 'image/gif'
        /********** END OF VALIDATOR **********/

        // Automate
        premium.expiredCheck(_premium)
        cron.schedule('0 0 * * *', () => {
            const reset = []
            _limit = reset
            console.log('Hang tight, it\'s time to reset usage limits...')
            fs.writeFileSync('./database/user/limit.json', JSON.stringify(_limit))
            console.log('Success!')
        }, {
            scheduled: true,
            timezone: 'Asia/Jakarta'
        })

        // Anti group link detector
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
                const valid = await client.inviteInfo(chats)
                if (valid) {
                    console.log(color('[KICK]', 'red'), color('Received a group link and it is a valid link!', 'yellow'))
                    await client.reply(from, ind.linkDetected(), id)
                    await client.removeParticipant(groupId, sender.id)
                } else {
                    console.log(color('[WARN]', 'yellow'), color('Received a group link but it is not a valid link!', 'yellow'))
                }
            }
        }
        
        // Example response button (if you have license key)
        if (message.type === 'buttons_response') {
        if (message.selectedButtonId === 'menu') {
        	await client.sendText(from, ind.menu(jumlahUser, pushname, isPremium ? 'YES' : 'NO'))
        }
        }

        // Anti virtext 
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && !isOwner) {
           if (chats.length > 5000) {
               await client.sendTextWithMentions(from, `@${sender.id} is detected sending a virtext.\nYou will be kicked!`)
               await client.removeParticipant(groupId, sender.id)
               await client.clearChat(groupId)
               await client.deleteChat(groupId)
            }
        } 
               
        // Sticker keywords 
        if (isGroupMsg && isRegistered) {
            if (_stick.includes(chats)) {
                await client.sendImageAsSticker(from, `./temp/sticker/${chats}.webp`, { author: authorWm, pack: packWm })
            }
        }

        // Anti fake group link
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isDetectorOn && !isOwner) {
            if (chats.match(new RegExp(/(https:\/\/chat.(?!whatsapp.com))/gi))) {
                console.log(color('[KICK]', 'red'), color('Received a fake group link!', 'yellow'))
                await client.reply(from, 'Fake group link detected!', id)
                await client.removeParticipant(groupId, sender.id)
            }
        }

        // Anti NSFW link
        if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiNsfw && !isOwner) {
            if (isUrl(chats)) {
                const classify = new URL(isUrl(chats))
                console.log(color('[FILTER]', 'yellow'), 'Checking link:', classify.hostname)
                isPorn(classify.hostname, async (err, status) => {
                    if (err) return console.error(err)
                    if (status) {
                        console.log(color('[NSFW]', 'red'), color('The link is classified as NSFW!', 'yellow'))
                        await client.reply(from, ind.linkNsfw(), id)
                        await client.removeParticipant(groupId, sender.id)
                    } else {
                        console.log(('[NEUTRAL]'), color('The link is safe!'))
                    }
                })
            }
        }

        // Auto sticker
        if (isGroupMsg && isAutoStickerOn && isMedia && isImage && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64, { author: authorWm, pack: packWm })
            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
        }

        // Auto sticker video
        if (isGroupMsg && isAutoStickerOn && isMedia && isVideo && !isCmd) {
            const mediaData = await decryptMedia(message, uaOverride)
            const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await client.sendMp4AsSticker(from, videoBase64, { stickerMetadata: true, pack: packWm, author: authorWm, fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', crop: false, loop: 0 })
            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
        }

        // AFK
        if (isGroupMsg) {
            for (let ment of mentionedJidList) {
                if (afk.checkAfkUser(ment, _afk)) {
                    const getId = afk.getAfkId(ment, _afk)
                    const getReason = afk.getAfkReason(getId, _afk)
                    const getTime = afk.getAfkTime(getId, _afk)
                    await client.reply(from, ind.afkMentioned(getReason, getTime), id)
                }
            }
            if (afk.checkAfkUser(sender.id, _afk) && !isCmd) {
                _afk.splice(afk.getAfkPosition(sender.id, _afk), 1)
                fs.writeFileSync('./database/user/afk.json', JSON.stringify(_afk))
                await client.sendText(from, ind.afkDone(pushname))
            }
        }

        // Mute
        if (isCmd && isMute && !isGroupAdmins && !isOwner && !isPremium) return 
        
        // Ignore banned and blocked users
        if (isCmd && (isBanned || isBlocked) && !isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && (isBanned || isBlocked) && isGroupMsg) return console.log(color('[BAN]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Anti spam
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))

        // Log
        if (isCmd && !isGroupMsg) {
            console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
            await client.sendSeen(from)
        }
        if (isCmd && isGroupMsg) {
            console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle))
            await client.sendSeen(from)
        }
        
        // Anti spam
        if (isCmd && !isPremium && !isOwner) msgFilter.addFilter(from)

        // openai chatbot user massage
        if (!isGroupMsg && isOpenAiOn) {
            try {                
                if (!isOpenAiOn) return await client.reply(from, ind.notOpenai(), id)
                // if (!q) return await client.reply(from, ind.emptyMess(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                
                // send typing status openwa
                await client.simulateTyping(from,true)
    
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: message,
                    temperature: 0,
                    max_tokens: 2048,
                    top_p: 0.5,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    // stop: ["4"],
                    });
    
                let text = response.data.choices[0].text;
                // send response
                await client.reply(from, text, id)
            } catch (err) {
                await client.reply(from, `Maaf ${pushname}, bot tidak dapat menjawab pertanyaan anda. Silahkan tanyakan sesuatu yang lain.`, id)
            }
        }

        switch (command) {
            // Register
            // case prefix+'register':
            //     if (isRegistered) return await client.reply(from, ind.registeredAlready(), id)
            //     if (isGroupMsg) return await client.reply(from, ind.pcOnly(), id)
            //     if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
            //     const namaUser = q.substring(0, q.indexOf('|') - 1)
            //     const umurUser = q.substring(q.lastIndexOf('|') + 2)
            //     const serialUser = createSerial(20)
            //     if (Number(umurUser) >= 40) return await client.reply(from, ind.ageOld(), id)
            //     register.addRegisteredUser(sender.id, namaUser, umurUser, time, serialUser, _registered)
            //     await client.reply(from, ind.registered(namaUser, umurUser, sender.id, time, serialUser), id)
            //     console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'))
            // break

            // Simple Register
            case prefix+'register':
                if (isRegistered) return await client.reply(from, ind.registeredAlready(), id)
                // if (isGroupMsg) return await client.reply(from, ind.pcOnly(), id)
                const serialUser = createSerial(20)
                register.addRegisteredUser(sender.id, time, serialUser, _registered)
                await client.reply(from, ind.registered(sender.id, time, serialUser), id)
                console.log(color('[REGISTER]'), color(time, 'yellow'), 'User registered:', color(pushname, 'cyan'), 'Serial:', color(serialUser, 'cyan'))
            break

            // Misc
            case prefix+'google':
            case prefix+'googlesearch':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q) return await client.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.reply(from, ind.wait(), id)
                google({ 'query': q, 'no-display': true })
                    .then(async (results) => {
                        let txt = `*── 「 GOOGLE SEARCH 」 ──*\n\n_*Search results for: ${q}*_`
                        for (let i = 0; i < results.length; i++) {
                            txt += `\n\n➸ *Title*: ${results[i].title}\n➸ *Desc*: ${results[i].snippet}\n➸ *Link*: ${results[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await client.reply(from, txt, id)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    })
            break
            case prefix+'afk':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (isAfkOn) return await client.reply(from, ind.afkOnAlready(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const reason = q ? q : 'Nothing.'
                afk.addAfkUser(sender.id, time, reason, _afk)
                await client.reply(from, ind.afkOn(pushname, reason), id)
            break
            case prefix+'jadwalsholat':
            case prefix+'jadwalsolat':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q) return await client.reply(from, ind.wrongFormat(), id)
                await client.reply(from, ind.wait(), id)
                misc.jadwalSholat(q)
                    .then((data) => {
                        data.map(async ({isya, subuh, dzuhur, ashar, maghrib, terbit}) => {
                            const x = subuh.split(':')
                            const y = terbit.split(':')
                            const xy = x[0] - y[0]
                            const yx = x[1] - y[1]
                            const perbandingan = `${xy < 0 ? Math.abs(xy) : xy} jam ${yx < 0 ? Math.abs(yx) : yx} menit`
                            const msg = `Jadwal sholat untuk ${q} dan sekitarnya ( *${dateNow}* )\n\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\nSubuh: ${subuh}\n\nDiperkirakan matahari akan terbit pada pukul ${terbit} dengan jeda dari subuh sekitar ${perbandingan}`
                            await client.reply(from, msg, id)
                            console.log('Success sending jadwal sholat!')
                        })
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    })
            break
            
            case prefix+'math':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q) return await client.reply(from, ind.wrongFormat(), id)
                if (typeof mathjs.evaluate(q) !== 'number') {
                    await client.reply(from, ind.notNum(q), id)
                } else {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, `*── 「 MATH 」 ──*\n\n${q} = ${mathjs.evaluate(q)}`, id)
                }
            break
            case prefix+'mutual':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) return await client.reply(from, 'Command ini tidak bisa digunakan di dalam grup!', id)
                if (limit.isLimit(sender.id, _limit, limitCount, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.reply(from, 'Looking for a partner...', id)
                await client.sendContact(from, register.getRegisteredRandomId(_registered))
                await client.sendText(from, `Partner found: 🙉\n*${prefix}next* — find a new partner`)
            break
            case prefix+'next':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isGroupMsg) return await client.reply(from, 'Command ini tidak bisa digunakan di dalam grup!', id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.reply(from, 'Looking for a partner...', id)
                await client.sendContact(from, register.getRegisteredRandomId(_registered))
                await client.sendText(from, `Partner found: 🙉\n*${prefix}next* — find a new partner`)
            break
            case prefix+'toxic':
                if (!isRegistered) return await client.reply(from , ind.notRegistered(), id)
                await client.reply(from, toxic(), id)
            break
            case prefix+'reminder':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const timeRemind = q.substring(0, q.indexOf('|') - 1)
                const messRemind = q.substring(q.lastIndexOf('|') + 2)
                const parsedTime = ms(toMs(timeRemind))
                reminder.addReminder(sender.id, messRemind, timeRemind, _reminder)
                await client.sendTextWithMentions(from, ind.reminderOn(messRemind, parsedTime, sender))
                const intervRemind = setInterval(async () => {
                    if (Date.now() >= reminder.getReminderTime(sender.id, _reminder)) {
                        await client.sendTextWithMentions(from, ind.reminderAlert(reminder.getReminderMsg(sender.id, _reminder), sender))
                        _reminder.splice(reminder.getReminderPosition(sender.id, _reminder), 1)
                        fs.writeFileSync('./database/user/reminder.json', JSON.stringify(_reminder))
                        clearInterval(intervRemind)
                    }
                }, 1000)
            break
            case prefix+'imagetourl':
            case prefix+'imgtourl':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const linkImg = await uploadImages(mediaData, `${sender.id}_img`)
                    await client.reply(from, linkImg, id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break

            // Bot
                // Example case if you have license key
            /*case prefix+'menu':
            case prefix+'help':
               await client.sendButtons(from, "Hallo, saya client bot.\nsilahkan klik button do bawah untuk melihan menu."),
               [
                  {id:"menu","text":"Menu"},
               ],
               "", "© client Bot")
               await client.reply(from, menuId.textMenu(pushname, prefix), id)
            break*/
            case prefix+'menu':
            case prefix+'help':
                const jumlahUser = _registered.length
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (args[0] === '1') {
                    if (isGroupMsg){
                        if (!isOpenAiOnGroup) return await client.reply(from, ind.notOpenai(), id)
                        await client.sendText(from, ind.menuOpenai())
                    } else if (!isGroupMsg) {
                        if (!isOpenAiOn) return await client.reply(from, ind.notOpenai(), id)
                        await client.sendText(from, ind.menuOpenaiU())
                    }
                } else if (args[0] === '2') {
                    await client.sendText(from, ind.menuBot())
                } else if (args[0] === '3') {
                    await client.sendText(from, ind.menuMisc())
                } else if (args[0] === '4') {
                    await client.sendText(from, ind.menuSticker())
                } else if (args[0] === '5') {
                    await client.sendText(from, ind.menuFun())
                } else if (args[0] === '6') {
                    await client.sendText(from, ind.menuModeration())
                } else if (args[0] === '7') {
                    if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                    await client.sendText(from, ind.menuOwner())
                } else {
                    await client.sendText(from, ind.menu(jumlahUser, pushname, isPremium ? 'YES' : 'NO'))
                }
            break
            case prefix+'rules':
            case prefix+'rule':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                await client.sendText(from, ind.rules())
            break
            case prefix+'status':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                await client.sendText(from, `*RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB\n*CPU*: ${os.cpus()[0].model}`)
            break
            case prefix+'listblock':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                let block = ind.listBlock(blockNumber)
                for (let i of blockNumber) {
                    block += `@${i.replace('@c.us', '')}\n`
                }
                await client.sendTextWithMentions(from, block)
            break
            case prefix+'owner':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                // send link instagram profile with button
                await client.sendLinkWithAutoPreview(from, 'https://www.instagram.com/damara.sf/')
            break
            case prefix+'runtime':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                const formater = (seconds) => {
                    const pad = (s) => {
                        return (s < 10 ? '0' : '') + s
                    }
                    const hrs = Math.floor(seconds / (60 * 60))
                    const mins = Math.floor(seconds % (60 * 60) / 60)
                    const secs = Math.floor(seconds % 60)
                    return ' ' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs)
                }
                const uptime = process.uptime()
                await client.reply(from, `*── 「 BOT UPTIME 」 ──*\n\n❏${formater(uptime)}`, id)
            break
            case prefix+'ping':
            case prefix+'p':
            case 'test':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                await client.sendText(from, `Halo, silahkan ketik *#menu*\n\nSpeed: ${processTime(t, moment())} detik`)
            break
            case prefix+'delete':
            case prefix+'del':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!quotedMsg) return await client.reply(from, ind.wrongFormat(), id)
                if (isGroupMsg) {
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (isGroupAdmins) {
                await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                } else if (!isGroupAdmins) { 
                if (!quotedMsgObj.fromMe) return await client.reply(from, ind.wrongFormat(), id)
                await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                }
                } else if (!isGroupMsg) {
                if (!quotedMsgObj.fromMe) return await client.reply(from, ind.wrongFormat(), id)
                await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
           	}
            break
            case prefix+'report':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q) return await client.reply(from, ind.emptyMess(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const lastReport = daily.getLimit(sender.id, _daily)
                if (lastReport !== undefined && cd - (Date.now() - lastReport) > 0) {
                    const time = ms(cd - (Date.now() - lastReport))
                    await client.reply(from, ind.daily(time), id)
                } else {
                    if (isGroupMsg) {
                        await client.sendText(ownerNumber, `*── 「 REPORT 」 ──*\n\n*From*: ${pushname}\n*ID*: ${sender.id}\n*Group*: ${(name || formattedTitle)}\n*Message*: ${q}`)
                        await client.reply(from, ind.received(pushname), id)
                    } else {
                        await client.sendText(ownerNumber, `*── 「 REPORT 」 ──*\n\n*From*: ${pushname}\n*ID*: ${sender.id}\n*Message*: ${q}`)
                        await client.reply(from, ind.received(pushname), id)
                    }
                    daily.addLimit(sender.id, _daily)
                }
            break
            case prefix+'react' : case prefix+'reaction' :
              if (quotedMsg) {
            	if (args.length !== 1)  return await client.reply(from, ind.wrongFormat(), id)
            	const getReact = args[0]
                  await client.react(quotedMsg.id, getReact)
            	} else {
            	await client.reply(from, ind.wrongFormat(), id)
            	}
            break
            case prefix+'join':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isUrl(url) && !url.includes('chat.whatsapp.com')) return await client.reply(from, ind.wrongFormat(), id)
                const checkInvite = await client.inviteInfo(url)
                if (isOwner) {
                    await client.joinGroupViaLink(url)
                    await client.reply(from, ind.ok(), id)
                    await client.sendText(checkInvite.id, `Hello!! I was invited by ${pushname}`)
                } else {
                    const getGroupData = await client.getAllGroups()
                    if (getGroupData.length >= groupLimit) {
                        await client.reply(from, `Invite refused. Max group is: ${groupLimit}`, id)
                    } else if (getGroupData.size <= memberLimit) {
                        await client.reply(from, `Invite refused. Minimum member is: ${memberLimit}`, id)
                    } else {
                        if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                        limit.addLimit(sender.id, _limit, isPremium, isOwner)
                        await client.joinGroupViaLink(url)
                        await client.reply(from, ind.ok(), id)
                        await client.sendText(checkInvite.id, `Hello!! I was invited by ${pushname}`)
                    }
                }
            break
            case prefix+'premiumcheck':
            case prefix+'cekpremium':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isPremium) return await client.reply(from, ind.notPremium(), id)
                const cekExp = ms(premium.getPremiumExpired(sender.id, _premium) - Date.now())
                await client.reply(from, `*── 「 PREMIUM EXPIRED 」 ──*\n\n➸ *ID*: ${sender.id}\n➸ *Premium left*: ${cekExp.days} day(s) ${cekExp.hours} hour(s) ${cekExp.minutes} minute(s)`, id)
            break
            case prefix+'premiumlist':
            case prefix+'listpremium':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                let listPremi = '*── 「 PREMIUM USERS 」 ──*\n\n'
                const deret = premium.getAllPremiumUser(_premium)
                const arrayPremi = []
                for (let i = 0; i < deret.length; i++) {
                    const checkExp = ms(premium.getPremiumExpired(deret[i], _premium) - Date.now())
                    arrayPremi.push(await client.getContact(premium.getAllPremiumUser(_premium)[i]))
                    listPremi += `${i + 1}. ➸ *Name*: ${arrayPremi[i].pushname}\n➸ *Expired*: ${checkExp.days} day(s) ${checkExp.hours} hour(s) ${checkExp.minutes} minute(s)\n\n`
                    // listPremi += `${i + 1}. wa.me/${premium.getAllPremiumUser(_premium)[i].replace('@c.us', '')}\n➸ *Name*: ${arrayPremi[i].pushname}\n➸ *Expired*: ${checkExp.days} day(s) ${checkExp.hours} hour(s) ${checkExp.minutes} minute(s)\n\n`
                }
                await client.reply(from, listPremi, id)
            break
            case prefix+'getpic':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (mentionedJidList.length !== 0) {
                    const userPic = await client.getProfilePicFromServer(mentionedJidList[0])
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    if (userPic === undefined) {
                        var pek = errorImg
                    } else {
                        pek = userPic
                    }
                    await client.sendFileFromUrl(from, pek, 'pic.jpg', '', id)
                } else if (args.length !== 0) {
                    const userPic = await client.getProfilePicFromServer(args[0] + '@c.us')
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    if (userPic === undefined) {
                        var peks = errorImg
                    } else {
                        peks = userPic
                    }
                    await client.sendFileFromUrl(from, peks, 'pic.jpg', '', id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'serial':
                if (!isRegistered) return await client.reply(from, ind.registered(), id)
                if (isGroupMsg) return await client.reply(from, ind.pcOnly(), id)
                if (args.length !== 1) return await client.reply(from, ind.wrongFormat(), id)
                const serials = args[0]
                if (register.checkRegisteredUserFromSerial(serials, _registered)) {
                    const name = register.getRegisteredNameFromSerial(serials, _registered)
                    const age = register.getRegisteredAgeFromSerial(serials, _registered)
                    const time = register.getRegisteredTimeFromSerial(serials, _registered)
                    const id = register.getRegisteredIdFromSerial(serials, _registered)
                    await client.sendText(from, ind.registeredFound(name, age, time, serials, id))
                } else {
                    await client.sendText(from, ind.registeredNotFound(serials))
                }
            break
            case prefix+'limit':
                if (isPremium || isOwner) return await client.reply(from, '⤞ Limit left: ∞ (UNLIMITED)', id)
                await client.reply(from, `⤞ Limit left: ${limit.getLimit(sender.id, _limit, limitCount)} / ${limitCount}\n\nJika limit sudah habis, Silakan lakukan hal berikut: \n❏ *_Tunggu hingga jam 00:00 WIB supaya limit terisi kembali_* \n❏ *_Menjadi premium member, supaya unlimited limit. Ketik ${prefix}owner untuk membeli premium ^^_* `, id)
            break


            // Fun
            case prefix+'dadu': 
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                fun.dadu()
                    .then(async (body) => {
                        const dadugerak = body.split('\n')
                        const dadugerakx = dadugerak[Math.floor(Math.random() * dadugerak.length)]
                        await client.sendStickerfromUrl(from, dadugerakx, null, { author: authorWm, pack: packWm })
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    })
            break
            case prefix+'dogesticker':
            case prefix+'doge':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                fun.doge()
                    .then(async (body) => {
                        const dogeg = body.split('\n')
                        const dogegx = dogeg[Math.floor(Math.random() * dogeg.length)]
                        await client.sendStickerfromUrl(from, dogegx, null, { author: authorWm, pack: packWm })
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    })
            break
            case prefix+'profile':
            case prefix+'me':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                // if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                // limit.addLimit(sender.id, _limit, isPremium, isOwner)
                if (quotedMsg) {
                    const getQuoted = quotedMsgObj.sender.id
                    const profilePic = await client.getProfilePicFromServer(getQuoted)
                    const username = quotedMsgObj.sender.name
                    const statuses = await client.getStatus(getQuoted)
                    const benet = _ban.includes(getQuoted) ? 'Yes' : 'No'
                    const adm = groupAdmins.includes(getQuoted) ? 'Yes' : 'No'
                    const premi = premium.checkPremiumUser(getQuoted, _premium) ? 'Yes' : 'No'
                    const { status } = statuses
                    if (profilePic === undefined) {
                        var pfp = errorImg
                    } else {
                        pfp = profilePic
                    }
                    await client.sendFileFromUrl(from, pfp, `${username}.jpg`, ind.profile(username, status, premi, benet, adm), id)
                } else {
                    const profilePic = await client.getProfilePicFromServer(sender.id)
                    const username = pushname
                    const statuses = await client.getStatus(sender.id)
                    const benet = isBanned ? 'Yes' : 'No'
                    const adm = isGroupAdmins ? 'Yes' : 'No'
                    const premi = isPremium ? 'Yes' : 'No'
                    const { status } = statuses
                    if (profilePic === undefined) {
                        var pfps = errorImg
                    } else {
                        pfps = profilePic
                    }
                    await client.sendFileFromUrl(from, pfps, `${username}.jpg`, ind.profile(username, status, premi, benet, adm), id)
                }
            break

            // Sticker
            case prefix+'stikernobg':
            case prefix+'stickernobg':
            case prefix+'snobg':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    await client.sendImageAsSticker(from, mediaData, { author: authorWm, pack: packWm, removebg: true, keepScale: true })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)                
                    /*const q = await uploadImages(mediaData, `stickernobg.${sender.id}`)
                    misc.stickernobg(q)
                        .then(async ({ result }) => {
                            await client.sendStickerfromUrl(from, result.image, null, { author: authorWm, pack: packWm })
                            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                        })
                        .catch(async (err) => {
                            console.error(err)
                            await client.reply(from, 'Error!', id)
                        })*/
                } else {
                    await client.reply('Kirim gambar dengan caption *#stikernobg* atau reply gambar yang sudah dikirim dengan *!stikernobg*')
                }
            break
            case prefix+'stickerwm':
            case prefix+'stcwm':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isPremium) return await client.reply(from, ind.notPremium(), id)
                if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const packname = q.substring(0, q.indexOf('|') - 1)
                    const author = q.substring(q.lastIndexOf('|') + 2)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64, { author: author, pack: packname })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'stickermeme':
            case prefix+'stcmeme':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const top = q.substring(0, q.indexOf('|') - 1)
                    const topp = top.replace('', '_').replace('\n','%5Cn').replace('?', '~q').replace('%', '~p').replace('#', '~h').replace('/', '~s')
                    const bottom = q.substring(q.lastIndexOf('|') + 2)
                    const bottomm = bottom.replace('', '_').replace('\n','%5Cn').replace('?', '~q').replace('%', '~p').replace('#', '~h').replace('/', '~s')
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const getUrl = await uploadImages(mediaData, `meme.${sender.id}`)
                    const create = `https://api.memegen.link/images/custom/${topp}/${bottomm}.png?background=${getUrl}`
                    await client.sendStickerfromUrl(from, create, null, { author: authorWm, pack: packWm, keepScale: true })
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'takestick':
            case prefix+'take':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q.includes('|')) return await client.reply(from, ind.wrongFormat(), id)
                if (quotedMsg && quotedMsg.type == 'sticker') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const mediaDataTake = await decryptMedia(quotedMsg)
                    const packname = q.substring(0, q.indexOf('|') - 1)
                    const author = q.substring(q.lastIndexOf('|') + 2)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaDataTake.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64, { author: author, pack: packname })
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'stickercrop':
            case prefix+'stikercrop':
            case prefix+'scrop':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await client.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64, { author: authorWm, pack: packWm })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'sticker':
            case prefix+'stiker':
            case prefix+'s':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isMedia && isImage || isQuotedImage) {
                    await client.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64, { author: authorWm, pack: packWm, keepScale: true })
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                } else {
                    await client.reply('Kirim gambar dengan caption !sticker atau reply gambar yang sudah dikirim dengan !sticker')
                }
            break
            case prefix+'stickergif':
            case prefix+'stikergif':
            case prefix+'sgif':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (isMedia && isVideo || isGif || isQuotedVideo || isQuotedGif) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    try {
                        const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedVideo || isQuotedGif ? quotedMsg.mimetype : mimetype
                    const videoBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendMp4AsSticker(from, videoBase64, null, { stickerMetadata: true, author: authorWm, pack: packWm, keepScale: true, fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', crop: false, loop: 0 })
                            .then(() => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                            })
                    } catch (err) {
                        console.error(err)
                        await client.reply(from, ind.videoLimit(), id)
                    }
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'ttg':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!q) return await client.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.reply(from, ind.wait(), id)
                await client.sendStickerfromUrl(from, `https://api.vhtear.com/textxgif?text=${q}&apikey=${config.vhtear}`, null, { author: authorWm, pack: packWm })
                    .then(() => console.log('Success creating GIF!'))
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    })
            break
            case prefix+'stickertoimg':
            case prefix+'stikertoimg':
            case prefix+'stoimg':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (isQuotedSticker) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    try {
                        const mediaData = await decryptMedia(quotedMsg, uaOverride)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendFile(from, imageBase64, 'sticker.jpg', '', id)
                    } catch (err) {
                        console.error(err)
                        await client.reply(from, 'Error!', id)
                    }
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'emojisticker':
            case prefix+'emojistiker':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (args.length !== 1) return client.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const emoji = emojiUnicode(args[0])
                await client.reply(from, ind.wait(), id)
                console.log('Creating emoji code for =>', emoji)
                await client.sendStickerfromUrl(from, `https://api.vhtear.com/emojitopng?code=${emoji}&apikey=${config.vhtear}`, null, { author: authorWm, pack: packWm })
                    .then(async () => {
                        await client.reply(from, ind.ok(), id)
                        console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                    })
                    .catch(async (err) => {
                        console.error(err)
                        await client.reply(from, 'Emoji not supported!', id)
                    })
            break

            // Openai command
            case prefix+'openai':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                // if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (ar[0] === 'enable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    if (isGroupMsg) {
                        if (isOpenAiOnGroup) return await client.reply(from, ind.openaiAlready(), id)
                        if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                        _openaig.push(groupId)
                        fs.writeFileSync('./database/group/openai.json', JSON.stringify(_openaig))
                        await client.reply(from, ind.openaiOn(), id)
                    } 
                    if (!isGroupMsg) {
                        if (isOpenAiOn) return await client.reply(from, ind.openaiAlready(), id)
                        _openaiu.push(sender.id)
                        fs.writeFileSync('./database/user/openai.json', JSON.stringify(_openaiu))
                        await client.reply(from, ind.openaiOnU(), id)
                    }
                } else if (ar[0] === 'disable') {
                    if (isGroupMsg) {
                        _openaig.splice(groupId, 1)
                        fs.writeFileSync('./database/group/openai.json', JSON.stringify(_openaig))
                        await client.reply(from, ind.openaiOff(), id)
                    } 
                    if (!isGroupMsg) {
                        if (!isOpenAiOn) return await client.reply(from, ind.openaiOff(), id)
                        _openaiu.splice(sender.id, 1)
                        fs.writeFileSync('./database/user/openai.json', JSON.stringify(_openaiu))
                        await client.reply(from, ind.openaiOff(), id)
                    }
                } else if (ar[0] === 'reset') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    if (isGroupMsg) {
                        if (!isOpenAiOnGroup) return await client.reply(from, ind.notOpenai(), id)
                        if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                        await client.reply(from, ind.openaiReset(), id)
                        await client.clearChat(groupId)
                        await client.deleteChat(groupId)
                    } 
                    if (!isGroupMsg) {
                        if (!isOpenAiOn) return await client.reply(from, ind.notOpenai(), id)
                        await client.reply(from, ind.openaiReset(), id)
                        await client.clearChat(sender.id)
                        await client.deleteChat(sender.id)
                    }
                } else {
                    await client.reply(from, `Command ${prefix}openai salah!\n Silahkan ketik *${prefix}menu 1* untuk melihat menu openai!`, id)
                }
            break
            case prefix+'chat':
                if (isGroupMsg) {
                    try {
                    if (!isOpenAiOnGroup) return await client.reply(from, ind.notOpenai(), id)
                    if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                    if (!q) return await client.reply(from, ind.emptyMess(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                        
                    // send typing status openwa
                    await client.simulateTyping(from,true)

                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: prompt,
                        temperature: 0,
                        max_tokens: 2048,
                        top_p: 0.5,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                        // stop: ["4"],
                        });

                    let text = response.data.choices[0].text;
                    // send response
                    await client.reply(from, text, id)
                    } catch (err) {
                        await client.reply(from, `Maaf ${pushname}, bot tidak dapat menjawab pertanyaan anda. Silahkan tanyakan sesuatu yang lain.`, id)
                    }
                }
            break
            case prefix+'drawai':
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                if (isGroupMsg) {
                    try {
                        if (!isOpenAiOnGroup) return await client.reply(from, ind.notOpenai(), id)
                        if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                        if (!q) return await client.reply(from, ind.emptyMess(), id)
                        
                        // send typing status openwa
                        await client.reply(from, 'Tunggu sebentar kak, lagi bot gambarin nih hehe', id)
                        await client.simulateTyping(from,true)

                        const response = await openai.createImage({
                            prompt: prompt,
                            n: 1,
                            size: "1024x1024",
                        });

                        let image_url = response.data.data[0].url;
                        // send response
                        // await client.reply(from, image_url, id)
                        await client.sendFileFromUrl(from, image_url, 'image.jpg', 'Ini kak hasil gambar yang kamu minta, udah bot gambarin hehe', id)
                    } catch (error) {
                        await client.reply(from, 'Maaf kak, bot gabisa gambarin yang kamu minta, coba minta gambarin yang lain ya kak hehe', id)
                    }
                }
                if (!isGroupMsg) {
                    try {
                        if (!isOpenAiOn) return await client.reply(from, ind.notOpenai(), id)
                        if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                        if (!q) return await client.reply(from, ind.emptyMess(), id)
                        
                        // send typing status openwa
                        await client.reply(from, 'Tunggu sebentar kak, lagi bot gambarin nih hehe', id)
                        await client.simulateTyping(from,true)

                        const response = await openai.createImage({
                            prompt: prompt,
                            n: 1,
                            size: "1024x1024",
                        });

                        let image_url = response.data.data[0].url;
                        // send response
                        // await client.reply(from, image_url, id)
                        await client.sendFileFromUrl(from, image_url, 'image.jpg', 'Ini kak hasil gambar yang kamu minta, udah bot gambarin hehe', id)
                    } catch (error) {
                        await client.reply(from, 'Maaf kak, bot gabisa gambarin yang kamu minta, coba minta gambarin yang lain ya kak hehe', id)
                    }
                }
            break


            // Moderation command
            case prefix+'revoke':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return client.reply(from, ind.botNotAdmin(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.revokeGroupInviteLink(groupId)
                await client.sendTextWithMentions(from, `Group link revoked by @${sender.id.replace('@c.us', '')}`)
            break
            case prefix+'grouplink':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const gcLink = await client.getGroupInviteLink(groupId)
                await client.reply(from, gcLink, id)
            break
            case prefix+'mutegc':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return client.reply(from, ind.botNotAdmin(), id)
                if (ar[0] === 'enable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.setGroupToAdminsOnly(groupId, true)
                    await client.sendText(from, ind.gcMute())
                } else if (ar[0] === 'disable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.setGroupToAdminsOnly(groupId, false)
                    await client.sendText(from, ind.gcUnmute())
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'add':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (args.length !== 1) return await client.reply(from, ind.wrongFormat(), id)
                try {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.addParticipant(from, `${args[0]}@c.us`)
                    await client.sendText(from, '🎉 Welcome! 🎉')
                } catch (err) {
                    console.error(err)
                    await client.reply(from, 'Error!', id)
                }
            break
            case prefix+'kick':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length === 0) return await client.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.sendTextWithMentions(from, `Good bye~\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
                for (let i of mentionedJidList) {
                    if (groupAdmins.includes(i)) return await client.sendText(from, ind.wrongFormat())
                    await client.removeParticipant(groupId, i)
                }
            break
            case prefix+'promote':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return await client.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, ind.adminAlready(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.reply(from, ind.ok(), id)
            break
            case prefix+'demote':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (mentionedJidList.length !== 1) return await client.reply(from, ind.wrongFormat(), id)
                if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, ind.notAdmin(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.reply(from, ind.ok(), id)
            break
            case prefix+'leave':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                await client.sendText(from, 'Bye~ 👋')
                await client.leaveGroup(groupId)
            break
            case prefix+'admins':
            case prefix+'admin':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const groupAdm = await client.getGroupAdmins(groupId)
                const lastAdmin = daily.getLimit(sender.id, _daily)
                if (lastAdmin !== undefined && cd - (Date.now() - lastAdmin) > 0) {
                    const time = ms(cd - (Date.now() - lastAdmin))
                    await client.reply(from, ind.daily(time), id)
                } else if (isOwner) {
                    let txt = '╔══✪〘 *ADMINS* 〙✪══\n'
                    for (let i = 0; i < groupAdm.length; i++) {
                        txt += '╠➥'
                        txt += ` @${groupAdm[i].replace(/@c.us/g, '')}\n`
                    }
                    txt += `╚═〘 *Total : ${groupAdm.length}* 〙`
                    await client.sendTextWithMentions(from, txt)
                } else {
                    let txt = '╔══✪〘 *ADMINS* 〙✪══\n'
                    for (let i = 0; i < groupAdm.length; i++) {
                        txt += '╠➥'
                        txt += ` @${groupAdm[i].replace(/@c.us/g, '')}\n`
                    }
                    txt += `╚═〘 *Total : ${groupAdm.length}* 〙`
                    await client.sendTextWithMentions(from, txt)
                    daily.addLimit(sender.id, _daily)
                }
            break
            case prefix+'everyone':
            case prefix+'tagall':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                limit.addLimit(sender.id, _limit, isPremium, isOwner)
                const groupMem = await client.getGroupMembers(groupId)
                const lastEveryone = daily.getLimit(sender.id, _daily)
                if (lastEveryone !== undefined && cd - (Date.now() - lastEveryone) > 0) {
                    const time = ms(cd - (Date.now() - lastEveryone))
                    await client.reply(from, ind.daily(time), id)
                } else if (isOwner || isPremium) {
                    let txt = '╔══✪〘 *EVERYONE* 〙✪══\n'
                        for (let i = 0; i < groupMem.length; i++) {
                            txt += '╠➥'
                            txt += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                        }
                    txt += `╚═〘 *Total : ${groupMem.length}* 〙`
                    await client.sendTextWithMentions(from, txt)
                } else {
                    let txt = '╔══✪〘 *EVERYONE* 〙✪══\n'
                        for (let i = 0; i < groupMem.length; i++) {
                            txt += '╠➥'
                            txt += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                        }
                        txt += `╚═〘 *Total : ${groupMem.length}* 〙`
                    await client.sendTextWithMentions(from, txt)
                    daily.addLimit(sender.id, _daily)
                }
            break
            case prefix+'groupicon':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return client.reply(from, ind.botNotAdmin(), id)
                if (isMedia && isImage || isQuotedImage) {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    await client.reply(from, ind.wait(), id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.setGroupIcon(groupId, imageBase64)
                    await client.sendText(from, ind.ok())
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'antilink':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (ar[0] === 'enable') {
                    if (isDetectorOn) return await client.reply(from, ind.detectorOnAlready(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antilink.push(groupId)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await client.reply(from, ind.detectorOn(name, formattedTitle), id)
                } else if (ar[0] === 'disable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antilink.splice(groupId, 1)
                    fs.writeFileSync('./database/group/antilink.json', JSON.stringify(_antilink))
                    await client.reply(from, ind.detectorOff(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'welcome':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'enable') {
                    if (isWelcomeOn) return await client.reply(from, ind.welcomeOnAlready(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _welcome.push(groupId)
                    fs.writeFileSync('./database/group/welcome.json', JSON.stringify(_welcome))
                    await client.reply(from, ind.welcomeOn(), id)
                } else if (ar[0] === 'disable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _welcome.splice(groupId, 1)
                    fs.writeFileSync('./database/group/welcome.json', JSON.stringify(_welcome))
                    await client.reply(from, ind.welcomeOff(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'autosticker':
            case prefix+'autostiker':
            case prefix+'autostik':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'enable') {
                    if (isAutoStickerOn) return await client.reply(from, ind.autoStikOnAlready(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _autosticker.push(groupId)
                    fs.writeFileSync('./database/group/autosticker.json', JSON.stringify(_autosticker))
                    await client.reply(from, ind.autoStikOn(), id)
                } else if (ar[0] === 'disable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _autosticker.splice(groupId, 1)
                    fs.writeFileSync('./database/group/autosticker.json', JSON.stringify(_autosticker))
                    await client.reply(from, ind.autoStikOff(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'antinsfw':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (!isBotGroupAdmins) return await client.reply(from, ind.botNotAdmin(), id)
                if (ar[0] === 'enable') {
                    if (isDetectorOn) return await client.reply(from, ind.antiNsfwOnAlready(), id)
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antinsfw.push(groupId)
                    fs.writeFileSync('./database/group/antinsfw.json', JSON.stringify(_antinsfw))
                    await client.reply(from, ind.antiNsfwOn(name, formattedTitle), id)
                } else if (ar[0] === 'disable') {
                    if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await client.reply(from, ind.limit(), id)
                    limit.addLimit(sender.id, _limit, isPremium, isOwner)
                    _antinsfw.splice(groupId, 1)
                    fs.writeFileSync('./database/group/antinsfw.json', JSON.stringify(_antinsfw))
                    await client.reply(from, ind.antiNsfwOff(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break

            // Owner command
            case prefix+'block':
            case prefix+'blok':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (mentionedJidList.length !== 0) {
                    for (let blok of mentionedJidList) {
                        if (blok === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                        await client.contactBlock(blok)
                    }
                    await client.reply(from, ind.doneOwner(), id)
                } else if (args.length === 1) {
                    await client.contactBlock(args[0] + '@c.us')
                    await client.reply(from, ind.doneOwner(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'unblock':
            case prefix+'unblok':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (mentionedJidList.length !== 0) {
                    for (let blok of mentionedJidList) {
                        if (blok === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                        await client.contactUnblock(blok)
                    }
                    await client.reply(from, ind.doneOwner(), id)
                } else if (args.length === 1) {
                    await client.contactUnblock(args[0] + '@c.us')
                    await client.reply(from, ind.doneOwner(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'blocklist':
            case prefix+'bloklist':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                let hih = '*「 BLOCK LIST 」*\n\n'
                const blockNumber = await client.getBlockedIds()
                for (let i of blockNumber) {
                    hih += `➸ @${i.replace(/@c.us/g, '')}\n`
                }
                hih += `\n*Total : ${blockNumber.length}*`
                await client.sendTextWithMentions(from, hih)
            break
            case prefix+'bc':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (!q) return await client.reply(from, ind.emptyMess(), id)
                const chats = await client.getAllChatIds()
                for (let bcs of chats) {
                    let cvk = await client.getChatById(bcs)
                    if (!cvk.isReadOnly) await client.sendText(bcs, `${q}\n\n- DemsBot\n_Broadcasted message_`)
                }
                await client.reply(from, ind.doneOwner(), id)
            break
            case prefix+'clearall':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                const allChats = await client.getAllChats()
                for (let delChats of allChats) {
                    await client.deleteChat(delChats.id)
                }
                await client.reply(from, ind.doneOwner(), id)
            break
            case prefix+'leaveall':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (!q) return await client.reply(from, ind.emptyMess(), id)
                const allGroup = await client.getAllGroups()
                for (let gclist of allGroup) {
                    await client.sendText(gclist.contact.id, q)
                    await client.leaveGroup(gclist.contact.id)
                }
                await client.reply(from, ind.doneOwner())
            break
            case prefix+'getss':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                const ses = await client.getSnapshot()
                await client.sendFile(from, ses, 'session.png', ind.doneOwner())
            break
            case prefix+'ban':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (ar[0] === 'add') {
                    if (mentionedJidList.length !== 0) {
                        for (let benet of mentionedJidList) {
                            if (benet === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                            _ban.push(benet)
                            fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        }
                        await client.reply(from, ind.doneOwner(), id)
                    } else {
                        _ban.push(args[1] + '@c.us')
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await client.reply(from, ind.doneOwner(), id)
                    }
                } else if (ar[0] === 'del') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                        _ban.splice(mentionedJidList[0], 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await client.reply(from, ind.doneOwner(), id)
                    } else{
                        _ban.splice(args[1] + '@c.us', 1)
                        fs.writeFileSync('./database/bot/banned.json', JSON.stringify(_ban))
                        await client.reply(from, ind.doneOwner(), id)
                    }
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'eval':
            case prefix+'ev':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (!q) return await client.reply(from, ind.wrongFormat(), id)
                try {
                    let evaled = await eval(q)
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    await client.sendText(from, evaled)
                } catch (err) {
                    console.error(err)
                    await client.reply(from, err, id)
                }
            break
            case prefix+'shutdown':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                await client.sendText(from, 'Otsukaresama deshita~ 👋')
                    .then(async () => await client.kill())
                    .catch(() => new Error('Target closed.'))
            break
            case prefix+'premium':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (ar[0] === 'add') {
                    if (mentionedJidList.length !== 0) {
                        for (let prem of mentionedJidList) {
                            if (prem === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                            premium.addPremiumUser(prem, args[2], _premium)
                            await client.reply(from, `*── 「 PREMIUM ADDED 」 ──*\n\n➸ *ID*: ${prem}\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                        }
                    } else {
                        premium.addPremiumUser(args[1] + '@c.us', args[2], _premium)
                        await client.reply(from, `*── 「 PREMIUM ADDED 」 ──*\n\n➸ *ID*: ${args[1]}@c.us\n➸ *Expired*: ${ms(toMs(args[2])).days} day(s) ${ms(toMs(args[2])).hours} hour(s) ${ms(toMs(args[2])).minutes} minute(s)`, id)
                    }
                } else if (ar[0] === 'del') {
                    if (mentionedJidList.length !== 0) {
                        if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
                        _premium.splice(premium.getPremiumPosition(mentionedJidList[0], _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await client.reply(from, ind.doneOwner(), id)
                    } else {
                        _premium.splice(premium.getPremiumPosition(args[1] + '@c.us', _premium), 1)
                        fs.writeFileSync('./database/bot/premium.json', JSON.stringify(_premium))
                        await client.reply(from, ind.doneOwner(), id)
                    }
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'setstatus':
            case prefix+'setstats':
            case prefix+'setstat':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (!q) return await client.reply(from, ind.emptyMess(), id)
                await client.setMyStatus(q)
                await client.reply(from, ind.doneOwner(), id)
            break
            case prefix+'mute':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(pushname), id)
                if (!isGroupMsg) return await client.reply(from, ind.groupOnly(), id)
                if (!isGroupAdmins) return await client.reply(from, ind.adminOnly(), id)
                if (ar[0] === 'enable') {
                    if (isMute) return await client.reply(from, ind.muteChatOnAlready(), id)
                    _mute.push(groupId)
                    fs.writeFileSync('./database/bot/mute.json', JSON.stringify(_mute))
                    await client.reply(from, ind.muteChatOn(), id)
                } else if (ar[0] === 'disable') {
                    _mute.splice(groupId, 1)
                    fs.writeFileSync('./database/bot/mute.json', JSON.stringify(_mute))
                    await client.reply(from, ind.muteChatOff(), id)
                } else {
                    await client.reply(from, ind.wrongFormat(), id)
                }
            break
            case prefix+'setname':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                if (!q || q.length > 25) return await client.reply(from, ind.wrongFormat(), id)
                await client.setMyName(q)
                await client.reply(from, ind.nameChanged(q), id)
            break
            case prefix+'grouplist':
                if (!isRegistered) return await client.reply(from, ind.notRegistered(), id)
                const getGroups = await client.getAllGroups()
                let txtGc = '*── 「 GROUP LIST 」 ──*\n'
                for (let i = 0; i < getGroups.length; i++) {
                    txtGc += `\n\n❏ *Name*: ${getGroups[i].name}\n❏ *Unread messages*: ${getGroups[i].unreadCount} messages`
                }
                await client.sendText(from, txtGc)
            break
            case prefix+'reset':
                if (!isOwner) return await client.reply(from, ind.ownerOnly(), id)
                const reset = []
                _limit = reset
                console.log('Hang tight, it\'s time to reset usage limits...')
                fs.writeFileSync('./database/user/limit.json', JSON.stringify(_limit))
                await client.reply(from, ind.doneOwner(), id)
                console.log('Success!')
            break
            
            default:
                if (isCmd) {
                    await client.reply(from, ind.cmdNotFound(command), id)
                }
            break
        }
    } catch (err) {
        console.error(color('[ERROR]', 'red'), err)
    }
}
/********** END OF MESSAGE HANDLER **********/
