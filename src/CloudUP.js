// Copyright 2023 Efraim - Hamza - Ahmet
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

require('dotenv').config();
const {
    Client,
    Partials,
    Options,
    IntentsBitField
} = require('discord.js');
const { DefaultRestOptions, DefaultUserAgentAppendix } = require('@discordjs/rest');
const { version } = require('../package.json');
const fs = require('node:fs');
const path = require('node:path');
const dash = require('./app');
const { PrismaClient, Prisma } = require('@prisma/client');
const clc = require('cli-color');
const { CloudUP_Handler } = require('./utils/Clo_Handler');
const { prismawebhook, webhookErrors, webhookUsage_Commands } = require('./utils/Webhooks');
module.exports = class CloudUP extends Client {
    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers
            ],
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.Message,
                Partials.GuildMember
            ],
            allowedMentions: {
                parse: ['users'],
                repliedUser: true
            },
            sweepers: {
                ...Options.DefaultSweeperSettings, messages: { interval: 1000, lifetime: 300 }, threads: {
                    interval: 3600,
                    lifetime: 1600,
                },
                users: {
                    lifetime: 1800,
                    interval: 1400,
                    filter: () => user => user.bot && user.id !== process.env.CLIENT_ID
                }
            },
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings, MessageManager: 0, GuildMemberManager: {
                    maxSize: 10,
                    keepOverLimit: (member) => member.id === process.env.CLIENT_ID
                }
            }),
            closeTimeout: 1_000,
            failIfNotExists: true,
            rest: {
                ...DefaultRestOptions,
                userAgentAppendix: `discord.js/${version} ${DefaultUserAgentAppendix}`.trimEnd()
            },
            ws: {
                large_threshold: 50,
                version: 10
            }
        });
    }
    loadEvents() {
        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
    loadCommands() {
        const CLhandler = new CloudUP_Handler({
            folder: __dirname + "/commands/",
            globalCommandRefresh: true,
        });
        this.cl_handler = CLhandler;
    }

    async connect() {
        this.webhookErrors = webhookErrors;
        this.webhookUsage_Commands = webhookUsage_Commands;
        try {
            void await this.login(process.env.CLOUDUP_TOKEN);
            console.log(clc.green(`Discord API Giriş Yapıldı.`));
        } catch (error) {
            console.error('Bot giriş yaparken bir hata oluştu:', error);
            webhookErrors(this, error);
        }
    }

    async dashboard() {
        await dash;
    }
    async clientDB() {
        const prisma = new PrismaClient({
            log: ['error', 'warn', 'info',
                {
                    emit: 'event',
                    level: 'query',
                },
            ],
            errorFormat: 'colorless',
        });
        await prisma.$connect();
        this.database = prisma;
        this.prismaClient = Prisma;
        prisma.$on('query', (e) => {
            console.log('Query: ' + clc.cyanBright(e.query))
            console.log('Params: ' + clc.cyanBright(e.params))
            console.log('Duration: ' + clc.cyanBright(e.duration + 'ms'))
            prismawebhook(`\`\`\`${e.query} | ${e.duration}\`\`\``, `${e.params} - ${e.duration}ms`)
        });
        console.log(clc.green(`Prisma veritabanına bağlandı.`));
    }
}