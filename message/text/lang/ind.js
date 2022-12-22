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
    return `Bot tidak menerima panggilan. Karena kamu telah melanggar rules, maka kamu telah diblok!\n\nHarap hubungi owner: https://www.instagram.com/damara.sf/`
}

exports.ownerOnly = () => {
    return `Command ini khusus Owner!`
}

exports.doneOwner = () => {
    return `Sudah selesai, mas`
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

exports.openaiOnU = () => {
    return `OpenAI berhasil diaktifkan! \n\nSilahkan langsung berbicara dengan bot ini. Ketikan apa saja yang ingin kamu tanyakan.`
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
    return `Ups, kamu bukan user premium! Silakan hubungi owner untuk menjadi user premium.\nSilahkan ketik *${prefix}owner* untuk chat owner.`
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

Maaf, tetapi kamu telah mencapai limit menggunakan fitur ini. 
Tetapi tenang, fitur lain masih bisa kamu gunakan.

Silakan lakukan hal berikut:
❏ *_Tunggu hingga jam 00:00 WIB supaya limit terisi kembali_*
❏ *_Menjadi premium member, supaya unlimited limit. Ketik ${prefix}owner untuk membeli premium ^^_*
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
╔══✪〘 *MENU* 〙✪══
╠═══════════════
╠➸ *Nama*: ${pushname}
╠➸ *Premium*: ${premium}
╠═══════════════
╠
╠➸ *[1]* OpenAI ChatGPT
╠➸ *[2]* Bot
╠➸ *[3]* Misc
╠➸ *[4]* Sticker
╠➸ *[5]* Fun
╠➸ *[6]* Moderation
╠➸ *[7]* Owner
╠
╚═〘 *Jumlah User: ${jumlahUser}* 〙

Ketik *${prefix}menu* angka_index untuk membuka menu page yang dipilih.
Contoh : *${prefix}menu 1*

Catatan:
Perlakukan bot secara baik, mohon baca *${prefix}rules* terlebih dahulu.
Bot ini memiliki fitur anti spam command, jadi jangan spam command ya!
    `
}

exports.menuBot = () => {
    return `
*── 「 BOT 」 ──*

1. *${prefix}rules*
_Wajib baca._
Usage: *${prefix}rules*

2. *${prefix}menu*
_Menampilkan commands yang tersedia._
Usage: *${prefix}menu* angka_index

3. *${prefix}status*
_Menampilkan status bot._
Usage: *${prefix}status*

4. *${prefix}listblock*
_Cek nomor yang diblokir._
Usage: *${prefix}listblock*

5. *${prefix}ping*
_Cek speed bot._
Usage: *${prefix}ping*

6. *${prefix}delete*
_Hapus pesan dari bot._
Usage: Reply pesan yang dihapus dengan caption *${prefix}delete*.

7. *${prefix}report*
_Laporkan bug ke dev._
Usage: *${prefix}report* pesan

8. *${prefix}join*
_Join grup via link._
Usage: *${prefix}join* link_group

9. *${prefix}ownerbot*
_Mengirim kontak owner._
Usage: *${prefix}ownerbot*

10. *${prefix}getpic*
_Mengirim foto profil user._
Usage: *${prefix}getpic* @user/62812xxxxxxxx

11. *${prefix}premiumcheck*
_Cek masa aktif premium._
Usage: *${prefix}premiumcheck*

12. *${prefix}premiumlist*
_Cek list user premium._
Usage: *${prefix}premiumlist*

13. *${prefix}limit*
_Cek limit kamu._
Usage: *${prefix}limit*

_Index of [2]_
    `
}

exports.menuMisc = () => {
    return `
*── 「 MISC 」 ──*

1. *${prefix}afk*
_Set akun kamu ke mode AFK, aku akan mengirim pesan ke orang yang me-mention kamu._
Usage: *${prefix}afk* alasan. Kirim pesan ke grup untuk menonaktifkan mode AFK.

2. *${prefix}math*
Kalkulator.
* = Perkalian
+ = Pertambahan
- = Pengurangan
/ = Pembagian

Usage: *${prefix}math* 12*12

3. *${prefix}jadwalsholat*
_Mengetahui jadwal sholat di daerah kalian_
Usage: *${prefix}jadwalsholat* namadaerah

4. *${prefix}toxic*
_Random toxic._
Usage: *${prefix}toxic*

5. *${prefix}reminder*
Pengingat. 
*s* - detik
*m* - menit
*h* - jam
*d* - hari

Usage: *${prefix}reminder* 10s | pesan_pengingat

6. *${prefix}imagetourl*
_Upload gambar ke url._
Usage: Kirim gambar dengan caption *${prefix}imagetourl* atau reply gambar dengan caption *${prefix}imagetourl*.

7. *${prefix}react*
_Memberikan reaction berupa emoji._
Usage: Balas/reply pesan yang ingin kamu react\n\nContoh: ${prefix}react 😱

_Index of [3]_
    `
}

exports.menuSticker = () => {
    return `
*── 「 STICKER 」 ──*

1. *${prefix}sticker* , *${prefix}stiker* , *${prefix}s*
_Membuat stiker dari gambar yang dikirim atau di-reply._
Usage: Kirim gambar dengan caption *${prefix}sticker* atau reply gambar dengan caption *${prefix}sticker*.

2. *${prefix}stickercrop* , *${prefix}stikercrop* , *${prefix}scrop*
_Membuat stiker dari gambar yang dikirim atau di-reply dengan fitur crop._
Usage: Kirim gambar dengan caption *${prefix}stickercrop* atau reply gambar dengan caption *${prefix}stickercrop*.

3. *${prefix}stickernobg* , *${prefix}stikernobg* , *${prefix}snobg*
_Membuat stiker dari gambar yang dikirim atau di-reply dengan fitur remove background._
Usage: Kirim gambar dengan caption *${prefix}stickernobg* atau reply gambar dengan caption *${prefix}stickernobg*.

4. *${prefix}stickergif*
_Membuat stiker dari video MP4 atau GIF yang dikirim atau di-reply._
Usage: Kirim video/GIF dengan caption *${prefix}stickergif* atau reply video/GIF dengan caption *${prefix}stickergif*.

5. *${prefix}ttg*
_Membuat stiker text to GIF._
Usage: *${prefix}ttg* teks

6. *${prefix}stickertoimg*
_Konversi stiker ke foto._
Usage: Reply sticker dengan caption *${prefix}stickertoimg*.

7. *${prefix}stickerwm*
_Buat stiker dengan WM._
Usage: Kirim gambar dengan caption *${prefix}stickerwm* pack_name | author_name atau reply gambar dengan caption *${prefix}stickerwm* pack_name | author_name.

8. *${prefix}stickermeme*
_Buat sticker meme._
Usage: Kirim gambar dengan caption *${prefix}stickermeme* teks_atas | teks_bawah atau reply gambar dengan caption *${prefix}stickermeme* teks_atas | teks_bawah.

9. *${prefix}takestick*
_Merubah watermark sticker._
Usage: Reply stiker dengan caption *${prefix}takestick* pack_name | author_name

_Index of [4]_
    `
}

exports.menuFun = () => {
    return `
*── 「 FUN 」 ──*

1. *${prefix}dadu*
_Kocok dadu secara random._
Usage: *${prefix}dadu*

2. *${prefix}dogesticker* , *${prefix}doge*
_Membuat stiker doge._
Usage: *${prefix}dogesticker*

3. *${prefix}profile* , *${prefix}me*
_Menampilkan profile kamu._
Usage: *${prefix}me*

_Index of [5]_
    `
}

exports.menuModeration = () => {
    return `
*── 「 MODERATION 」 ──*

1. *${prefix}add*
_Menambah user ke dalam group._
Usage: *${prefix}add* 628xxxxxxxxxx

2. *${prefix}kick*
_Mengeluarkan member dari grup._
Usage: *${prefix}kick* @member1

3. *${prefix}promote*
_Promote member menjadi admin._
Usage: *${prefix}promote* @member1

4. *${prefix}demote*
_Demote member dari admin._
Usage: *${prefix}demote* @member1

5. *${prefix}leave*
_Bot akan meninggalkan grup._
Usage: *${prefix}leave*

6. *${prefix}everyone* , *${prefix}tagall*
_Mention semua member group._
Usage: *${prefix}everyone*

7. *${prefix}openai*
_Menyalakan/mematikan fitur OpenAI ChatGPT._
Usage: *${prefix}openai* enable/disable

8. *${prefix}groupicon*
_Mengganti icon grup._
Usage: Kirim gambar dengan caption *${prefix}groupicon* atau reply gambar dengan caption *${prefix}groupicon*.

9. *${prefix}antilink*
_Mematikan/menyalakan fitur anti-group link._
Usage: *${prefix}antilink* enable/disable

10. *${prefix}welcome*
_Mematikan/menyalakan fitur welcome di grup agar menyambut setiap kedatangan member._
Usage: *${prefix}welcome* enable/disable

11. *${prefix}autosticker*
_Mematikan/menyalakan fitur auto-stiker. Setiap foto yang dikirim akan selalu diubah ke stiker._
Usage: *${prefix}autostiker* enable/disable

12. *${prefix}antinsfw*
_Mematikan/menyalakan fitur anti-NSFW link._
Usage: *${prefix}antinsfw* enable/disable

13. *${prefix}mutegc*
_Set group hanya admin yang bisa mengirim pesan._
Usage: *${prefix}mutegc* enabled/disable

14. *${prefix}grouplink*
_Melihat invite link grup._
Usage: *${prefix}grouplink*

15. *${prefix}revoke*
_Revoke invite link grup._
Usage: *${prefix}revoke*

_Index of [6]_
    `
}

exports.menuOpenai = () => {
    return `
*── 「 OpenAI 」 ──*

Ini merupakan fitur OpenAI atau ChatGPT
Pada fitur ini kamu bisa berbicara dengan bot secara interaktif

Cara penggunaan:
- *${prefix}openai enable*
- *${prefix}chat* teks_kamu
Jika ingin menggambar:
- *${prefix}openai enable*
- *${prefix}chatimg* teks_kamu

*Berikut adalah beberapa fitur yang tersedia:*

1. *${prefix}openai enable*
_Mengaktifkan fitur OpenAI_
Usage: *${prefix}openai enable*

2. *${prefix}openai disable*
_Menonaktifkan fitur OpenAI_
Usage: *${prefix}openai disable*

3. *${prefix}chat*
_Berbicara dengan bot secara interaktif_
Usage: *${prefix}chat* teks_kamu

4. *${prefix}chatimg* atau *${prefix}drawai*
_Bot akan menggambarkan sesuatu, sesuai dengan yang kamu katakan_
Usage: *${prefix}chatimg* teks_kamu *${prefix}drawai* teks_kamu

5. *${prefix}openai reset*
_Reset thread apabila pembicaraan sudah tidak nyambung_
Usage: *${prefix}openai reset*

_Index of [1]_
    `
}

exports.menuOpenaiU = () => {
    return `
*── 「 OpenAI 」 ──*

Ini merupakan fitur OpenAI atau ChatGPT
Pada fitur ini kamu bisa berbicara dengan bot secara interaktif

1. *${prefix}openai enable*
_Mengaktifkan fitur OpenAI_
Usage: *${prefix}openai enable*

2. *${prefix}openai disable*
_Menonaktifkan fitur OpenAI_
Usage: *${prefix}openai disable*

3. *${prefix}chatimg* atau *${prefix}drawai*
_Bot akan menggambarkan sesuatu, sesuai dengan yang kamu katakan_
Usage: *${prefix}chatimg* teks_kamu atau *${prefix}drawai* teks_kamu

4. *${prefix}openai reset*
_Reset thread apabila pembicaraan sudah tidak nyambung_
Usage: *${prefix}openai reset*

Catatan : 
- Setelah mengaktifkan fitur OpenAI, kamu bisa langsung bertanya ke bot seperti chat ke orang biasa.
- Jika kamu ingin mengakhiri sesi chat, kamu bisa menggunakan perintah *${prefix}openai disable*.

_Index of [1]_
    `
}

exports.menuOwner = () => {
    return `
*── 「 OWNER 」 ──*

1. *${prefix}bc*
_Membuat broadcast._
Usage: *${prefix}bc* <teks> 

2. *${prefix}clearall*
_Menghapus semua chat di akun bot._
Usage: *${prefix}clearall*

3. *${prefix}getss*
_Mengambil screenshot sesi dari akun bot._
Usage: *${prefix}getss*

4. *${prefix}ban*
_Menambah/menghapus user yang diban._
Usage: *${prefix}ban* add/del @user/62812xxxxxxxx

5. *${prefix}leaveall*
_Keluar dari semua grup._
Usage: *${prefix}leaveall*

6. *${prefix}shutdown*
_Men-shutdown bot._
Usage: *${prefix}shutdown*

7. *${prefix}premium*
Menambah/menghapus user premium.
*s* - detik
*m* - menit
*h* - jam
*d* - hari

Usage: *${prefix}premium* add/del @user/62812xxxxxxxx 30d

8. *${prefix}setstatus*
_Mengganti status about me._
Usage: *${prefix}status* teks

9. *${prefix}serial*
_Cek pendaftaran akun via serial._
Usage: *${prefix}serial* serial_user

10. *${prefix}exif*
_Atur WM stiker bot._
Usage: *${prefix}exif* pack_name | author_name

11. *${prefix}mute*
_Mute bot di grup._
Usage: *${prefix}mute* enable/disable

12. *${prefix}setname*
_Mengganti username bot. Maksimal 25 huruf._
Usage: *${prefix}name* username_baru

13. *${prefix}block*
_Blok user._
Usage: *${prefix}block* @user/62812xxxxxxxx

14. *${prefix}unblock*
_Unblok user._
Usage: *${prefix}unblock* @user/62812xxxxxxxx

15. *${prefix}blocklist*
_Melihat daftar user yang diblokir._
Usage: *${prefix}blocklist*

_Index of [9]_
    `
}

exports.rules = () => {
    return `
*── 「 RULES 」 ──*

1. Dilarang spam bot.
Sanksi: *Blocked*

2. Dilarang menelfon bot.
Sanksi: *Blocked*

3. Dilarang menggunakan bot untuk hal-hal yang merugikan.
Sanksi: *Blocked*

4. Setiap pengguna memiliki limit dalam menggunakan fitur OpenAI.
Catatan: Silahkan cek limit kamu dengan cara ketik *${prefix}limit*.

5. Bot ini dilengkapi dengan fitur anti-spam.
Jika bot tidak merespon, silahkan tunggu beberapa saat.

6. Bot ini dilengkapi dengan fitur anti-nsfw atau anti 18+.
Jika kamu mengirimkan pesan yang mengandung kata-kata yang tidak pantas, maka bot tidak akan merespon.

Jika sudah membaca rules, silahkan ketik *${prefix}menu* atau *${prefix}help* untuk melihat menu.
    `
}
