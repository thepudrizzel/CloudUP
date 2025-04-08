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
const { getMutualGuildsService } = require("../../services/guilds");

async function guildController(req, res) {
    const dataUser = await prisma.dashUser.findUnique({
        where: {
            id: req.user.id
        }
    });
    const user = req.user || dataUser;
    try {
        const guilds = await getMutualGuildsService(user.id)
        res.send({ guilds });
    } catch (error) {
        console.log(error)
        res.sendStatus(400).send('Hata!')
    }
}

module.exports = { guildController };