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

const { ModalEventHandler, Register_Modal } = require("../utils/HelpButtonModal/register_modalButton");
const { silMesaji } = require('../utils/Message_Timer');
const clc = require('cli-color');
const { Events, PermissionFlagsBits } = require('discord.js');
const cooldowns = new Map();
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.inGuild()) { return; }
        if (interaction.isChatInputCommand()) {
            const client = interaction.client;
            if (!interaction.guild.members.me.permissions.has([
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.SendMessages
            ])) {
                return interaction.reply({
                    content: `## ${client.user} | ${client.user.username}\nSunucuda kullanılmak için yeterli yetki yok lütfen;\n- **Uygulama Komutlarını Kullan**\n- **Rolleri Yönet**\n- **Takma Adları Yönet**\n- **Kanalları Görüntüle**\n- **Mesaj Geçmişini Oku**\n- **Mesaj Gönder**\nRolüne lütfen yetkileri tanımlayın.\n**Dipnot:** Yönetici dışında, yukarıda'ki yetkiler açık olsa dahi yeterli olur.`,
                    ephemeral: true
                });
            } else {
                let CL_commands = client.cl_handler.getCommand(interaction.commandName);
                if (!CL_commands) return;

                const cooldownTime = CL_commands.cooldown * 1000 || 5000;
                const authorId = interaction.user.id;
                if (cooldowns.has(authorId)) {
                    const expirationTime = cooldowns.get(authorId) + cooldownTime;

                    if (Date.now() < expirationTime) {
                        const timeLeft = (expirationTime - Date.now()) / 1000;
                        const expiredTimestamp = Math.round(expirationTime / 1000);
                        const sendtime = await interaction.reply({ content: `> \`${CL_commands.name}\` komutu tekrar kullanmadan önce: <t:${expiredTimestamp}:R>. bitmesini bekle. :nerd:`, ephemeral: true });
                        silMesaji(sendtime, timeLeft * 1000);
                        return;
                    }
                }

                cooldowns.set(authorId, Date.now());
                setTimeout(() => cooldowns.delete(authorId), cooldownTime);
                try {
                    CL_commands.run(client, interaction);
                    client.webhookUsage_Commands(interaction, `- ${interaction.user} - ${interaction.user.id}\n- \`${CL_commands.name}\` komutunu kullandı.\n- Sunucu: ${interaction.guild?.name}\n- Kullanıcı Sayısı: ${interaction.guild?.memberCount}`)
                } catch (error) {
                    interaction.client.webhookErrors(client, error);
                    console.error(clc.red(error));
                    await interaction.reply({ content: '## Komut işlenirken bir hata oluştu.', ephemeral: true });
                }
            }
        }
        if (interaction.isModalSubmit()) {
            await ModalEventHandler(interaction, Register_Modal());
        }
    },
};