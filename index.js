/* eslint-disable no-unused-vars */
const { create, Client } = require('@open-wa/wa-automate')
const { color, options } = require('./tools')
const { ind, eng } = require('./message/text/lang/')
const { loader } = require('./function')
const { version, bugs } = require('./package.json')
const msgHandler = require('./message/index.js')
const figlet = require('figlet')
const canvas = require('discord-canvas')
const { ownerBot } = require('./config.json')
const fs = require('fs-extra')
const { groupLimit, memberLimit } = require('./database/bot/setting.json')
const express = require('express')
const app = express()
const cron = require('node-cron')
const exec = require('await-exec')
// const exec = require('child_process').exec

const start = (client = new Client()) => {
    console.log(color(figlet.textSync('Dems Bot', 'Standard'), 'cyan'))
    console.log(color('=> Database Files:', 'yellow'), color(loader.getAllDirFiles('./database').length), color('Library:', 'yellow'), color(loader.getAllDirFiles('./lib').length), color('Function:', 'yellow'), color(loader.getAllDirFiles('./function').length))
    console.log(color('=> Source code version:', 'yellow'), color(version))
    console.log(color('=> Bug? Error? Suggestion? Visit here:', 'yellow'), color(bugs.url))
    console.log(color('[client]'), color('clientBot is now online!', 'yellow'))
    console.log(color('[DEV]', 'cyan'), color('Use command', 'magenta'), color('!help', 'cyan'), color('to see the list of commands.', 'magenta'))

    // Creating a localhost
    app.get('/', (req, res) => res.status(200).send('client Client'))
    const PORT = process.env.PORT || 8080 || 5000 || 3000
    app.listen(PORT, () => {
        console.log(color('Localhost is running!', 'yellow'))
    })  

    // Uncomment code di bawah untuk mengaktifkan auto-update file changes. Tidak disarankan untuk long-time use.
    // Uncomment code below to activate auto-update file changes. Not recommended for long-time use.
    // loader.nocache('../message/index.js', (m) => console.log(color('[WATCH]', 'orange'), color(`=> '${m}'`, 'yellow'), 'file is updated!'))

    client.onStateChanged((state) => {
        console.log(color('[client]'), state)
        if (state === 'OPENING') return client.refresh().catch(e => {
            console.log("ERROR WHEN REFRESH >>>", e)
            exec('pm2 restart .')
        })
        if (state === 'UNPAIRED' || state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })

    client.onAddedToGroup(async (chat) => {
        const gc = await client.getAllGroups()
        console.log(color('[client]'), 'Added to a new group. Name:', color(chat.contact.name, 'yellow'), 'Total members:', color(chat.groupMetadata.participants.length, 'yellow'))
        if (chat.groupMetadata.participants.includes(ownerBot)) {
            await client.sendText(chat.id, ind.addedGroup(chat))
        } else if (gc.length > groupLimit) {
            await client.sendText(chat.id, `Max groups reached!\n\nCurrent status: ${gc.length}/${groupLimit}`)
            await client.deleteChat(chat.id)
            await client.leaveGroup(chat.id)
        } else if (chat.groupMetadata.participants.length < memberLimit) {
            await client.sendText(chat.id, `Need at least ${memberLimit} members in group!`)
            await client.deleteChat(chat.id)
            await client.leaveGroup(chat.id)
        } else {
            await client.sendText(chat.id, ind.addedGroup(chat))
        }
    })

    client.onMessage((message) => {
        // Uncomment code di bawah untuk mengaktifkan auto-delete cache pesan.
        // Uncomment code below to activate auto-delete message cache.
        
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 1000) {
                    console.log(color('[client]'), color(`Loaded message reach ${msg}, cuting message cache...`, 'yellow'))
                    client.cutMsgCache()
                    console.log(color('[client]'), color('Cache deleted!', 'yellow'))
                }
            })
        
        
        // Comment code msgHandler di bawah untuk mengaktifkan auto-update. Kemudian, uncomment code require di bawah msgHandler.
        // Comment code below to activate auto-update. Then, uncomment require code below msgHandler.
        msgHandler(client, message)
        // require('./message/index.js')(client, message)
    })

    client.onIncomingCall(async (callData) => {
        await client.sendText(callData.peerJid, ind.blocked(ownerBot))
        await client.contactBlock(callData.peerJid)
        console.log(color('[BLOCK]', 'red'), color(`${callData.peerJid} has been blocked.`, 'yellow'))
    })
    
    // Clear Chat Every 12 Hours
    cron.schedule('0 0 */12 * * *', () => {
        	async function start() {
            const cronallChat = await client.getAllChats()
            for (let getdchat of cronallChat) {
                if (getdchat.isGroup == true){
                console.log(color('[client]'), 'Clear Chat Group', 'yellow')
               await client.clearChat(getdchat.id)
                } else {
                await client.deleteChat(getdchat.id)
                }
            }
            console.log(color('[client]'), 'Success Clear All Chat!', 'yellow')
            }
        start();
        })

    client.onGlobalParticipantsChanged(async (event) => {
        const _welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'))
        const isWelcome = _welcome.includes(event.chat)
        const gcChat = await client.getChatById(event.chat)
        const pcChat = await client.getContact(event.who)
        let { pushname, verifiedName, formattedName } = pcChat
        pushname = pushname || verifiedName || formattedName
        const { name, groupMetadata } = gcChat
        const botNumbers = await client.getHostNumber() + '@c.us'
        try {
            if (event.action === 'add' && event.who !== botNumbers && isWelcome) {
                const pic = await client.getProfilePicFromServer(event.who)
                if (pic === `ERROR: 401` || pic === 'ERROR: 404') {
                    var picx = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                } else {
                    picx = pic
                }
                const welcomer = await new canvas.Welcome()
                    .setUsername(pushname)
                    .setDiscriminator(event.who.substring(6, 10))
                    .setMemberCount(groupMetadata.participants.length)
                    .setGuildName(name)
                    .setAvatar(picx)
                    .setColor('border', '#00100C')
                    .setColor('username-box', '#00100C')
                    .setColor('discriminator-box', '#00100C')
                    .setColor('message-box', '#00100C')
                    .setColor('title', '#00FFFF')
                    .setBackground('https://www.photohdx.com/images/2016/05/red-blurry-background.jpg')
                    .toAttachment()
                const base64 = `data:image/png;base64,${welcomer.toBuffer().toString('base64')}`
                await client.sendFile(event.chat, base64, 'welcome.png', `Welcome ${pushname}!`)
            } else if (event.action === 'remove' && event.who !== botNumbers && isWelcome) {
                const pic = await client.getProfilePicFromServer(event.who)
                if (pic === `ERROR: 401` || pic === 'ERROR: 404') {
                    var picxs = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
                } else {
                    picxs = pic
                }
                const bye = await new canvas.Goodbye()
                    .setUsername(pushname)
                    .setDiscriminator(event.who.substring(6, 10))
                    .setMemberCount(groupMetadata.participants.length)
                    .setGuildName(name)
                    .setAvatar(picxs)
                    .setColor('border', '#00100C')
                    .setColor('username-box', '#00100C')
                    .setColor('discriminator-box', '#00100C')
                    .setColor('message-box', '#00100C')
                    .setColor('title', '#00FFFF')
                    .setBackground('https://www.photohdx.com/images/2016/05/red-blurry-background.jpg')
                    .toAttachment()
                const base64 = `data:image/png;base64,${bye.toBuffer().toString('base64')}`
                await client.sendFile(event.chat, base64, 'welcome.png', `Bye ${pushname}, we will miss you~`)
            }
        } catch (err) {
            console.error(err)
        }
    })

    // jika bot diinvite ke dalam group yang berisi anggota lebih dari 60 orang maka bot akan keluar dari group tersebut
    client.onAddedToGroup(async (chat) => {
        const totalMem = chat.groupMetadata.participants.length
        if (totalMem >= 60) {
            await client.sendText(chat.id, ind.groupLimit(totalMem))
            await client.leaveGroup(chat.id)
            await client.deleteChat(chat.id)
        } else {
            await client.sendText(chat.id, ind.addedGroup(chat.contact.name))
        }
    })

    // bot akan restart ketika sudah 5 jam berjalan (untuk menghindari memory leak) dengan cron job
    cron.schedule('0 0 */5 * * *', () => {
        client.forceRefocus()
    })

}

create(options(start))
    .then((client) => start(client))
    .catch((err) => console.error(err))
