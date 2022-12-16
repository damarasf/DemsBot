/* eslint-disable quotes */
const { prefix } = require('../../../config.json')

exports.wait = () => {
    return `Tunggu yaa... Sedang diproses~`
}

exports.ok = () => {
    return `Ok siap!`
}

exports.wrongFormat = () => {
    return `Perintah tidak ditemukan! Silahkan ketik *${prefix}menu* untuk melihat daftar perintah.`
}

exports.emptyMess = () => {
    return `Harap masukkan pesan yang ingin disampaikan!`
}

exports.cmdNotFound = (cmd) => {
    return `Perintah *${cmd}* tidak ditemukan! Silahkan ketik *${prefix}menu* untuk melihat daftar perintah.`
}

exports.blocked = (ownerNumber) => {
    return `Bot tidak menerima panggilan. Karena kamu telah melanggar rules, maka kamu telah diblok!\n\nHarap hubungi owner: wa.me/${ownerNumber.replace('@c.us', '')}`
}

exports.ownerOnly = () => {
    return `Command ini khusus Owner!`
}

exports.doneOwner = () => {
    return `Sudah selesai, Owner`
}

exports.groupOnly = () => {
    return `Command ini hanya bisa digunakan di dalam grup!`
}

exports.adminOnly = () => {
    return `Command ini hanya bisa digunakan oleh admin grup!`
}

exports.notOpenai = () => {
    return `OpenAI belum diaktifkan!\nSilahkan aktifkan terlebih dahulu dengan cara ketik *${prefix}openai enable*`
}

exports.openaiOn = () => {
    return `OpenAI berhasil diaktifkan!`
}

exports.openaiOff = () => {
    return `OpenAI berhasil dimatikan!`
}

exports.openaiAlready = () => {
    return `OpenAI sudah aktif sebelumnya!`
}

exports.openaiReset = () => {
    return `Thread OpenAI berhasil direset!`
}

exports.addedGroup = (chat) => {
    return `Halo, terima kasih telah mengundang saya ke grup *${chat.contact.name}*!\n\nUntuk melihat daftar perintah, silakan ketik *${prefix}menu*`
}

exports.nhFalse = () => {
    return `Kode tidak valid!`
}

exports.listBlock = (blockNumber) => {
    return `
*── 「 HALL OF SHAME 」 ──*

Total user diblokir: *${blockNumber.length}*\n
    `
}

exports.notPremium = () => {
    return `Ups, kamu bukan user premium! Silakan hubungi owner untuk menjadi user premium.`
}

exports.notAdmin = () => {
    return `Ups, kamu bukan admin!`
}

exports.adminAlready = () => {
    return `Tidak dapat mem-promote user yang merupakan admin!`
}

exports.botNotPremium = () => {
    return `Bot ini tidak mendukung command premium. Silakan hubungi pemilik bot ini.`
}

exports.botNotAdmin = () => {
    return `Jadikan bot sebagai admin terlebih dahulu!`
}

exports.notRegistered = () => {
    return `Sepertinya kamu belum terdaftar di database bot ini.\nSilakan ketik *${prefix}register*`
}

// exports.registered = (name, age, userId, time, serial) => {
//     return `
// *── 「 REGISTRATION 」 ──*
    
// Akun kamu telah terdaftar dengan data:
// ➸ *Nama*: ${name}
// ➸ *Umur*: ${age}
// ➸ *ID*: ${userId}
// ➸ *Waktu pendaftaran*: ${time}
// ➸ *Serial*: ${serial}

// Catatan:
// Jangan pernah menyebarkan data *serial* ke pada siapapun!

// Ketik *${prefix}rules* terlebih dahulu ya~
//     `
// }

// simple registration
exports.registered = (userId, time, serial) => {
    return `
*── 「 REGISTRATION 」 ──*
    
Akun kamu telah terdaftar dengan data:
➸ *ID*: ${userId}
➸ *Waktu pendaftaran*: ${time}

Catatan:
Mohon baca rules terlebih dahulu yaa~

Ketik *${prefix}rules* terlebih dahulu ya~
    `
}

exports.registeredAlready = () => {
    return `Kamu sudah mendaftar sebelumnya.`
}

exports.received = (pushname) => {
    return `Halo ${pushname}!\nTerima kasih telah melapor, laporanmu akan kami segera terima.`
}

exports.daily = (time) => {
    return `Maaf, tetapi kamu telah mencapai limit menggunakan command ini.\nSilakan tunggu *${time.hours}* jam *${time.minutes}* menit *${time.seconds}* detik lagi.`
}

exports.profile = (username, status, premi, benet, adm) => {
    return `
*── 「 USER INFO」 ──*

➸ *Name*: ${username}
➸ *Status*: ${status}
➸ *Premium*: ${premi}
➸ *Banned*: ${benet}
➸ *Admin*: ${adm}
    `
}

exports.detectorOn = (name, formattedTitle) => {
    return `
*── 「 ANTI GROUP LINK 」 ──*

Perhatian untuk penghuni grup *${(name || formattedTitle)}*
Grup ini memiliki anti-group link detector, apabila ada salah satu member mengirim group link di sini maka dia akan ter-kick secara otomatis.

Sekian terima kasih.
- Admin *${(name || formattedTitle)}*
    `
}

exports.detectorOff = () => {
    return `Fitur anti-group link berhasil *dinonaktifkan*!`
}

exports.detectorOnAlready = () => {
    return `Fitur anti-group link telah diaktifkan sebelumnya.`
}

exports.antiNsfwOn = (name, formattedTitle) => {
    return `
*── 「 ANTI NSFW LINK 」 ──*

Perhatian untuk penghuni grup *${(name || formattedTitle)}*
Grup ini memiliki anti-NSFW link detector, apabila ada salah satu member mengirim link NSFW/porn di sini maka dia akan ter-kick secara otomatis.

Sekian terima kasih.
- Admin *${(name || formattedTitle)}*
    `
}

exports.antiNsfwOff = () => {
    return `Fitur anti-NSFW link berhasil *dinonaktifkan*!`
}

exports.antiNsfwOnAlready = () => {
    return `Fitur anti-NSFW link telah diaktifkan sebelumnya.`
}

exports.linkDetected = () => {
    return `
*── 「 ANTI GROUP LINK 」 ──*

Kamu mengirim link group chat!
Maaf tapi kami harus mengeluarkan mu...
    `
}

exports.welcome = (event) => {
    return `Selamat datang @${event.who.replace('@c.us', '')}!\n\nSemoga betah terus di grup kami ya~`
}

exports.welcomeOn = () => {
    return `Fitur welcome berhasil *diaktifkan*!`
}

exports.welcomeOff = () => {
    return `Fitur welcome berhasil *dinonaktifkan*!`
}

exports.welcomeOnAlready = () => {
    return `Fitur welcome telah diaktifkan sebelumnya.`
}

exports.minimalDb = () => {
    return `Perlu setidaknya *10* user yang memiliki level di database!`
}

exports.autoStikOn = () => {
    return `Fitur auto-stiker berhasil *diaktifkan*!`
}

exports.autoStikOff = () => {
    return `Fitur auto-stiker berhasil *dinonaktifkan*!`
}

exports.autoStikOnAlready = () => {
    return `Fitur auto-stiker telah diaktifkan sebelumnya.`
}

exports.afkOn = (pushname, reason) => {
    return `
*── 「 AFK MODE 」 ──*
    
Fitur AFK berhasil *diaktifkan*!
➸ *Username*: ${pushname}
➸ *Alasan*: ${reason}
    `
}

exports.afkOnAlready = () => {
    return `Fitur AFK telah diaktifkan sebelumnya.`
}

exports.afkMentioned = (getReason, getTime) => {
    return `
*── 「 AFK MODE 」 ──*

Sssttt! Orangnya lagi AFK, jangan diganggu!
➸ *Alasan*: ${getReason}
➸ *Sejak*: ${getTime}
    `
}

exports.afkDone = (pushname) => {
    return `*${pushname}* telah kembali dari AFK! Selamat datang kembali~`
}

exports.gcMute = () => {
    return `
*── 「 MUTED 」 ──*
    
Hanya admin yang dapat mengirim pesan ke grup ini.
    `
}

exports.gcUnmute = () => {
    return `
*── 「 UNMUTED 」 ──*

Sekarang semua anggota dapat mengirim chat di grup ini.
    `
}

exports.notNum = (q) => {
    return `"${q}", bukan angka!`
}

// exports.registeredFound = (name, age, time, serial, userId) => {
//     return `
// *── 「 REGISTERED 」 ──* 

// Akun ditemukan!
// ➸ *Nama*: ${name}
// ➸ *Umur*: ${age}
// ➸ *ID*: ${userId}
// ➸ *Waktu pendaftaran*: ${time}
// ➸ *Serial*: ${serial}
//     `
// }

// simple registered
exports.registeredFound = (time, serial, userId) => {
    return `
*── 「 REGISTERED 」 ──* 

Akun ditemukan!
➸ *ID*: ${userId}
➸ *Waktu pendaftaran*: ${time}
➸ *Serial*: ${serial}
    `
}

exports.registeredNotFound = (serial) => {
    return `Akun dengan serial: *${serial}* tidak ditemukan!`
}

exports.pcOnly = () => {
    return `Command ini hanya bisa digunakan di dalam private chat saja!`
}

exports.linkNsfw = () => {
    return `
*── 「 ANTI NSFW LINK 」 ──*

Kamu telah mengirim link NSFW!
Maaf, tapi aku harus mengeluarkan mu...
    `
}

exports.ageOld = () => {
    return `Kamu terlalu tua untuk menggunakan fitur ini! Mohon kembali ke masa muda anda agar bisa menggunakannya.`
}

exports.fakeLink = () => {
    return `Ups, link ini terlihat mencurigakan. Demi keamanan grup, aku harus mengeluarkan mu...\n`
}

exports.muteChatOn = () => {
    return `Berhasil *mute* bot pada grup ini!`
}

exports.muteChatOff = () => {
    return `Berhasil *unmute* bot pada grup ini!`
}

exports.muteChatOnAlready = () => {
    return `Mute telah diaktifkan di grup ini sebelumnya!`
}

exports.limit = () => {
    return `
*── 「 LIMIT 」 ──*

Limit penggunaan kamu telah habis! Silakan lakukan hal berikut:
❏ *_Tunggu hingga jam 00:00 WIB_*
❏ *_Menjadi premium member, supaya unlimited limit_*
    `
}

exports.reminderOn = (messRemind, parsedTime, sender) => {
    return `
*── 「 REMINDER 」 ──*
    
Reminder berhasil diaktifkan!
➸ *Pesan*: ${messRemind}
➸ *Durasi*: ${parsedTime.hours} jam ${parsedTime.minutes} menit ${parsedTime.seconds} detik
➸ *Untuk*: @${sender.id.replace('@c.us', '')}
    `
}

exports.reminderAlert = (messRemind, sender) => {
    return `
*── 「 REMINDER 」 ──*

⏰ @${sender.id.replace('@c.us', '')} ⏰
➸ *Pesan*: ${messRemind}`
}

exports.nameChanged = (q) => {
    return `Username berhasil diubah ke *${q}*`
}

exports.menu = (jumlahUser, pushname, premium) => {
    return `
*── 「 MENU 」 ──*

======================
➸ *Nama*: ${pushname}
➸ *Premium*: ${premium}
======================

Total User: *${jumlahUser}*

Berikut adalah menu yang tersedia:

*[1]* OpenAI ChatGPT
*[2]* Bot
*[3]* Misc
*[4]* Sticker
*[5]* Fun
*[6]* Moderation
*[7]* Owner

Ketik *${prefix}menu* angka_index untuk membuka menu page yang dipilih.

Catatan:
Perlakukan bot secara baik, mohon baca *${prefix}rules* terlebih dahulu.
Bot ini memiliki fitur anti spam command, jadi jangan spam command ya!
    `
}

exports.menuBot = () => {
    return `
*── 「 BOT 」 ──*

1. *${prefix}rules*
Wajib baca.

Usage: *${prefix}rules*

2. *${prefix}menu*
Menampilkan commands yang tersedia.

Usage: *${prefix}menu* angka_index

3. *${prefix}status*
Menampilkan status bot.

Usage: *${prefix}status*

4. *${prefix}listblock*
Cek nomor yang diblokir.

Usage: *${prefix}listblock*

5. *${prefix}ping*
Cek speed bot.

Usage: *${prefix}ping*

6. *${prefix}delete*
Hapus pesan dari bot.

Usage: Reply pesan yang dihapus dengan caption *${prefix}delete*.

7. *${prefix}report*
Laporkan bug ke dev.

Usage: *${prefix}report* pesan

8. *${prefix}join*
Join grup via link.

Usage: *${prefix}join* link_group

9. *${prefix}ownerbot*
Mengirim kontak owner.

Usage: *${prefix}ownerbot*

10. *${prefix}getpic*
Mengirim foto profil user.

Usage: *${prefix}getpic* @user/62812xxxxxxxx

11. *${prefix}premiumcheck*
Cek masa aktif premium.

Usage: *${prefix}premiumcheck*

12. *${prefix}premiumlist*
Cek list user premium.

Usage: *${prefix}premiumlist*

13. *${prefix}limit*
Cek limit kamu.

Usage: *${prefix}limit*

_Index of [2]_
    `
}

exports.menuMisc = () => {
    return `
*── 「 MISC 」 ──*

1. *${prefix}afk*
Set akun kamu ke mode AFK, aku akan mengirim pesan ke orang yang me-mention kamu.

Usage: *${prefix}afk* alasan. Kirim pesan ke grup untuk menonaktifkan mode AFK.

2. *${prefix}math*
Kalkulator.
* = Perkalian
+ = Pertambahan
- = Pengurangan
/ = Pembagian

Usage: *${prefix}math* 12*12

3. *${prefix}jadwalsholat*
Mengetahui jadwal sholat di daerah kalian
 
Usage: *${prefix}jadwalsholat* namadaerah

4. *${prefix}mutual*
Dapatkan kontak WA random.

Usage: *${prefix}mutual*

5. *${prefix}toxic*
Random toxic.

Usage: *${prefix}toxic*

6. *${prefix}reminder*
Pengingat. 
*s* - detik
*m* - menit
*h* - jam
*d* - hari

Usage: *${prefix}reminder* 10s | pesan_pengingat

7. *${prefix}imagetourl*
Image uploader.

Usage: Kirim gambar dengan caption *${prefix}imagetourl* atau reply gambar dengan caption *${prefix}imagetourl*.

8. *${prefix}react*
Memberikan reaction berupa emoji.

Usage: Balas/reply pesan yang ingin kamu react\n\nContoh: ${prefix}react 😱

_Index of [3]_
    `
}

exports.menuSticker = () => {
    return `
*── 「 STICKER 」 ──*

1. *${prefix}sticker* , *${prefix}stiker* , *${prefix}s*
Membuat stiker dari gambar yang dikirim atau di-reply.

Usage: Kirim gambar dengan caption *${prefix}sticker* atau reply gambar dengan caption *${prefix}sticker*.

2. *${prefix}stickercrop* , *${prefix}stikercrop* , *${prefix}scrop*
Membuat stiker dari gambar yang dikirim atau di-reply dengan fitur crop.

Usage: Kirim gambar dengan caption *${prefix}stickercrop* atau reply gambar dengan caption *${prefix}stickercrop*.

3. *${prefix}stickernobg* , *${prefix}stikernobg* , *${prefix}snobg*
Membuat stiker dari gambar yang dikirim atau di-reply dengan fitur remove background.

Usage: Kirim gambar dengan caption *${prefix}stickernobg* atau reply gambar dengan caption *${prefix}stickernobg*.

4. *${prefix}stickergif*
Membuat stiker dari video MP4 atau GIF yang dikirim atau di-reply.

Usage: Kirim video/GIF dengan caption *${prefix}stickergif* atau reply video/GIF dengan caption *${prefix}stickergif*.

5. *${prefix}ttg*
Membuat stiker text to GIF.

Usage: *${prefix}ttg* teks

6. *${prefix}stickertoimg*
Konversi stiker ke foto.

Usage: Reply sticker dengan caption *${prefix}stickertoimg*.

7. *${prefix}emojisticker*
Konversi emoji ke stiker.

Usage: *${prefix}emojisticker* emoji

8. *${prefix}stickerwm*
Buat stiker dengan WM.

Usage: Kirim gambar dengan caption *${prefix}stickerwm* pack_name | author_name atau reply gambar dengan caption *${prefix}stickerwm* pack_name | author_name.

9. *${prefix}stickermeme*
Buat sticker meme.

Usage: Kirim gambar dengan caption *${prefix}stickermeme* teks_atas | teks_bawah atau reply gambar dengan caption *${prefix}stickermeme* teks_atas | teks_bawah.

10. *${prefix}takestick*
Merubah watermark sticker.

Usage: Reply stiker dengan caption *${prefix}takestick* pack_name | author_name

_Index of [4]_
    `
}

exports.menuFun = () => {
    return `
*── 「 FUN 」 ──*

1. *${prefix}dadu*
Kocok dadu secara random.

Usage: *${prefix}dadu*

2. *${prefix}dogesticker* , *${prefix}doge*
Membuat stiker doge.

Usage: *${prefix}dogesticker*

3. *${prefix}profile* , *${prefix}me*
Menampilkan profile kamu.

Usage: *${prefix}me*

_Index of [5]_
    `
}

exports.menuModeration = () => {
    return `
*── 「 MODERATION 」 ──*

1. *${prefix}add*
Menambah user ke dalam group.

Usage: *${prefix}add* 628xxxxxxxxxx

2. *${prefix}kick*
Mengeluarkan member dari grup.

Usage: *${prefix}kick* @member1

3. *${prefix}promote*
Promote member menjadi admin.

Usage: *${prefix}promote* @member1

4. *${prefix}demote*
Demote member dari admin.

Usage: *${prefix}demote* @member1

5. *${prefix}leave*
Bot akan meninggalkan grup.

Usage: *${prefix}leave*

6. *${prefix}everyone*
Mention semua member group.

Usage: *${prefix}everyone*

7. *${prefix}openai*
Menyalakan/mematikan fitur OpenAI ChatGPT.

Usage: *${prefix}openai* enable/disable

8. *${prefix}groupicon*
Mengganti icon grup.

Usage: Kirim gambar dengan caption *${prefix}groupicon* atau reply gambar dengan caption *${prefix}groupicon*.

9. *${prefix}antilink*
Mematikan/menyalakan fitur anti-group link.

Usage: *${prefix}antilink* enable/disable

10. *${prefix}welcome*
Mematikan/menyalakan fitur welcome di grup agar menyambut setiap kedatangan member.

Usage: *${prefix}welcome* enable/disable

11. *${prefix}autosticker*
Mematikan/menyalakan fitur auto-stiker. Setiap foto yang dikirim akan selalu diubah ke stiker.

Usage: *${prefix}autostiker* enable/disable

12. *${prefix}antinsfw*
Mematikan/menyalakan fitur anti-NSFW link.

Usage: *${prefix}antinsfw* enable/disable

13. *${prefix}mutegc*
Set group hanya admin yang bisa mengirim pesan.

Usage: *${prefix}mutegc* enabled/disable

14. *${prefix}grouplink*
Melihat invite link grup.

Usage: *${prefix}grouplink*

15. *${prefix}revoke*
Revoke invite link grup.

Usage: *${prefix}revoke*

_Index of [6]_
    `
}

exports.menuOpenai = () => {
    return `
*── 「 OpenAI 」 ──*

Ini merupakan fitur OpenAI atau ChatGPT
Pada fitur ini kamu bisa berbicara dengan bot secara interaktif

1. *${prefix}openai enable*
Mengaktifkan fitur OpenAI

Usage: *${prefix}openai enable*

2. *${prefix}openai disable*
Menonaktifkan fitur OpenAI

Usage: *${prefix}openai disable*

3. *${prefix}chat*
Berbicara dengan bot secara interaktif

Usage: *${prefix}chat* teks_kamu

4. *${prefix}chatimg*
Menggambarkan sesuatu dengan bot secara interaktif sesuai dengan teks yang kamu kirim

Usage: *${prefix}chatimg* teks_kamu

5. *${prefix}openai reset*
Reset thread apabila pembicaraan sudah tidak nyambung

Usage: *${prefix}openai reset*

_Index of [1]_
    `
}

exports.menuOwner = () => {
    return `
*── 「 OWNER 」 ──*

1. *${prefix}bc*
Membuat broadcast.

Usage: *${prefix}bc* <teks> 

2. *${prefix}clearall*
Menghapus semua chat di akun bot.

Usage: *${prefix}clearall*

3. *${prefix}getss*
Mengambil screenshot sesi dari akun bot.

Usage: *${prefix}getss*

4. *${prefix}ban*
Menambah/menghapus user yang diban.

Usage: *${prefix}ban* add/del @user/62812xxxxxxxx

5. *${prefix}leaveall*
Keluar dari semua grup.

Usage: *${prefix}leaveall*

6. *${prefix}shutdown*
Men-shutdown bot.

Usage: *${prefix}shutdown*

7. *${prefix}premium*
Menambah/menghapus user premium.
*s* - detik
*m* - menit
*h* - jam
*d* - hari

Usage: *${prefix}premium* add/del @user/62812xxxxxxxx 30d

8. *${prefix}setstatus*
Mengganti status about me.
Aliases: *setstats setstat*
Usage: *${prefix}status* teks

9. *${prefix}serial*
Cek pendaftaran akun via serial.

Usage: *${prefix}serial* serial_user

10. *${prefix}exif*
Atur WM stiker bot.

Usage: *${prefix}exif* pack_name | author_name

11. *${prefix}mute*
Mute bot di grup.

Usage: *${prefix}mute* enable/disable

12. *${prefix}setname*
Mengganti username bot. Maksimal 25 huruf.

Usage: *${prefix}name* username_baru

13. *${prefix}block*
Blok user.
Aliases: *blok*
Usage: *${prefix}block* @user/62812xxxxxxxx

14. *${prefix}unblock*
Unblok user.
Aliases: *unblok*
Usage: *${prefix}unblock* @user/62812xxxxxxxx

15. *${prefix}blocklist*
Melihat daftar user yang diblokir.

Usage: *${prefix}blocklist*

_Index of [9]_
    `
}

exports.rules = () => {
    return `
*── 「 RULES 」 ──*

1. Dilarang spam bot.
Sanksi: *Banned*

2. Dilarang menelfon bot.
Sanksi: *Blocked*

3. Dilarang menggunakan bot untuk hal-hal yang merugikan.
Sanksi: *Banned*

Jika sudah membaca rules, silahkan ketik *${prefix}menu* atau *${prefix}help* untuk melihat menu.
    `
}
