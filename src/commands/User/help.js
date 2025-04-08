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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const path = require('path');
const { Register_Modal, RegisterShow_Model } = require("../../utils/HelpButtonModal/register_modalButton");
module.exports = class help {
    constructor() {
        (this.cooldown = 10),
            (this.category = "User"),
            (this.name = "menu"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("menu")
                .setDescription("CloudUP ile kullanabileceğin komutlara erişebilirsin.")
                .setDMPermission(false));
    }

    async run(client, interaction) {
        let currentPage = 0;
        let Help_MenuMessage;
        const pages = [
            {
                color: 2895667,
                title: `Hoş Geldin ${interaction.user.username}!`,
                description: `${interaction.client.user} Komutlarına erişmek için aşağıda ki butonlara basabilirsin!\nSadece eğik çizgi ( \`/\` ) ile çalışmaktadır.\n- Komutların kurulumlarını sadece [siteden](${process.env.DASHBOARD_URL}) yapabilirsin.`,
                url: "https://discord.gg/ckEz8Yw",
                fields: [
                    { name: `Kayıt Komutları Nerede?`, value: `Kayıt komutlarına bakabilmek için "Kayıt" diye bir button hazırladık oradan bakabilirsiniz.`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: true },
                    { name: `\u200B`, value: `İleri ve geri butonları kullanabileceğin komutlara bakabilirsin.` }
                ],
                footer: {
                    text: `©️ ${interaction.client.user.username} ${new Date().getFullYear()}`, iconURL: interaction.client.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString(),
            },
            {
                color: 2895667,
                title: `Kayıt Komutları ${interaction.user.username}!`,
                description: `Kayıt kullanabilmek için aşağıdaki kurulum butonlarını tamamlanması gerekiyor.`,
                url: "https://discord.gg/ckEz8Yw",
                fields: [
                    { name: `Kullanıcı kayıt edersin.`, value: `/k`, inline: true },
                    { name: `Kullanıcıyı kayıtsıza atarsın.`, value: `/kayıtsız`, inline: true },
                    { name: `Kullanıcının ismini değiştirirsin.`, value: `/isim`, inline: true },
                    { name: `Tag'ı görürürsünüz.`, value: `/tag`, inline: false }
                ],
                footer: {
                    text: `©️ ${interaction.client.user.username} ${new Date().getFullYear()}`, iconURL: interaction.client.user.displayAvatarURL()
                },
                timestamp: new Date().toISOString(),
                components: [Register_Modal()]
            },
        ];

        const skip = new ButtonBuilder()
            .setCustomId('help_skip')
            .setLabel('İLERİ')
            .setDisabled(currentPage === pages.length - 1)
            .setStyle(ButtonStyle.Secondary);

        const back = new ButtonBuilder()
            .setCustomId('help_back')
            .setLabel('GERİ')
            .setDisabled(currentPage === 0)
            .setStyle(ButtonStyle.Secondary);

        const support = new ButtonBuilder()
            .setURL('https://discord.gg/ckEz8Yw')
            .setLabel('Destek')
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
            .addComponents(back, skip, support);

        Help_MenuMessage = await interaction.reply({ embeds: [pages[currentPage]], components: [row], ephemeral: true, fetchReply: true });

        const collectorFilter = i => i.user.id === interaction.user.id;
        const button = Help_MenuMessage.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, /*time: 10000*/ });
        button.on("collect", async (buttons) => {
            const components = [row];
            if (buttons.customId === 'help_skip' && currentPage < pages.length - 1) {
                currentPage++;
            } else if (buttons.customId === 'help_back' && currentPage > 0) {
                currentPage--;
            }
            if (buttons.customId === "rgROLE_modal_0") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || !interaction.guild.ownerId) {
                    const assets = path.resolve("src/assets/yonetici_zorunlu.gif")
                    const Perm = new AttachmentBuilder(assets);
                    return interaction.editReply({
                        content: `Kurulum için;\nLütfen "Yönetici" iznine sahip ol ya da sunucu sahibi olman gerek.`,
                        files: [Perm],
                        embeds: [],
                        components: [],
                        ephemeral: true,
                    });
                } else {
                    RegisterShow_Model(buttons, createEmbed(pages[currentPage]));
                    return;
                }
            }

            if (currentPage === 0) {
                row.components[0].setDisabled(true);
            } else {
                row.components[0].setDisabled(false);
            }

            if (currentPage === pages.length - 1) {
                row.components[1].setDisabled(true);
            } else {
                row.components[1].setDisabled(false);
            }

            if (currentPage === 1) {
                components.push(Register_Modal());
            }

            await buttons.update({
                embeds: [createEmbed(pages[currentPage])],
                components
            });
            return;
        });

        /* button.on("end", () => {
             row.components[0].setDisabled(true);
             row.components[1].setDisabled(true);
             interaction.deleteReply();
             return;
         });*/

        function createEmbed(page) {
            return {
                title: page?.title,
                description: page?.description,
                url: page?.url,
                fields: page?.fields,
                footer: page?.footer,
                timestamp: page?.timestamp,
                color: page?.color,
            };
        }
    }
};
