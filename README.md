## Installation

* npm
```sh
npm install npm@latest -g
```

1. Clone the repo
```sh
git clone https://github.com/damarasf/DemsBot.git
```
2. Install NPM packages
```sh
npm install
```
3. Copy config_example.json file
```sh
cp config_example.json config.json
```
4. Enter your API keys and your custom prompt in config.json file
```JS
"OPENAI_API_KEY": "your api key"
```
* API keys from OpenAI at https://openai.com.



## Usage

1. Run the bot:
```sh
npm run start
```
2. Open WhatsApp on your phone, select 'WhatsApp Web' from the settings menu, then scan the provided QR code.
3. Choose from the list of recent chats which you would like to activate the bot for. Use space key to select.
4. Sit back and watch the bot respond automatically to incoming messages from your selected contacts.

### Disclaimer
I fix the isues from Whatbot https://github.com/theshanergy/whatbot/issues/7
And i fix the openai bug
