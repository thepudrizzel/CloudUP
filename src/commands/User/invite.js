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

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = class Invite {
  constructor() {
    (this.cooldown = 10),
      (this.category = "user"),
      (this.name = "invite"),
      (this.slashCommand = new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Botu davet edersiniz.")
        .setDMPermission(false));
  }

  async run(client, interaction) {
    const tamyetki = new ButtonBuilder()
      .setURL(process.env.DASHBOARD_DAVETURL)
      .setLabel("Tam Yetki Davet")
      .setStyle(ButtonStyle.Link);

    const yarıyetki = new ButtonBuilder()
      .setURL(process.env.DASHBOARD_DAVETURL)
      .setLabel("Yarı Yetki Davet")
      .setStyle(ButtonStyle.Link);

    const desteksw = new ButtonBuilder()
      .setURL(process.env.DASHBOARD_DAVETURL)
      .setLabel("Destek Sunucusu")
      .setStyle(ButtonStyle.Link);

    /* const premium = new ButtonBuilder()
       .setURL(process.env.DASHBOARD_DAVETURL)
       .setLabel("CloudUP Premium")
       .setStyle(ButtonStyle.Link);*/

    const buttonlar = new ActionRowBuilder().addComponents(
      tamyetki,
      yarıyetki,
      desteksw,
      //premium
    );

    await interaction.reply({ content: `● "${client.user}" **Rolünü en yukarıya koyarak kullanınız.**`, components: [buttonlar], ephemeral: true });
  }
};