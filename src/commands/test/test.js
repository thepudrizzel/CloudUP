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

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = class test {
    constructor() {
        (this.cooldown = 10),
            (this.category = "test"),
            (this.name = "test"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("test")
                .setDescription("Test komutu")
                .setDMPermission(false));
    }

    async run(client, interaction) {
        await interaction.reply(this.name + " çalışıyor");
    }
};