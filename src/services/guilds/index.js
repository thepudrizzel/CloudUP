// Copyright 2023 Efraim - Hamza
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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const { DISCORD_API_URL } = require('../../utils/Constants');
const axios = require('axios');

function guildsFindService() {
    return axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bot ${process.env.CLOUDUP_TOKEN}`,
            'content-type': 'application/json'
        }
    });
}

async function userGuildFindService(id) {
    const user = await prisma.dashUser.findUnique({
        where: {
            id: id
        }
    });
    if (!user) throw new Error("User not found");
    return axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${user.accessToken}`,
        }
    });
}

async function getMutualGuildsService(id) {
    const data1 = await guildsFindService();
    const data2 = await userGuildFindService(id);

    const dataCheck = {
        guildsClient: data1.data, userGuilds: data2.data
    }
    const adminUserGuilds = dataCheck.userGuilds.filter(({
        permissions
    }) => (parseInt(permissions) & 0x8 === 0x8));
    return adminUserGuilds.filter((guild) => dataCheck.guildsClient.some((clientGuild) => clientGuild.id === guild.id));
}


module.exports = { guildsFindService, userGuildFindService, getMutualGuildsService }
