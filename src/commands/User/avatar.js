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
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = class avatar {
    constructor() {
        (this.cooldown = 1),
            (this.category = "User"),
            (this.name = "avatar"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("avatar")
                .setDescription("Kullanıcının veya kendinin avatarına bakarsın.")
                .setDMPermission(false))
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("Kullanıcı etiketlemelisin.")
                        .setRequired(false)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("gizli")
                        .setDescription("Gizli yapmak istersen True, gizli yapmak istemiyorsan False yapabilirsin!")
                );
    }

    async run(client, interaction) {
        const users = interaction.options.getMember("user") || interaction.user;
        const username = users.user?.username || interaction.user?.username;
        const Color = "Random";
        const gizli = interaction.options.getBoolean("gizli");
        let avatarURL = users.displayAvatarURL({ size: 1024, dynamic: true });
        let avatarURL2 = users.displayAvatarURL({ size: 2048, dynamic: true });
        let avatarURL3 = users.displayAvatarURL({ size: 4096, dynamic: true });
        const PNG = users.displayAvatarURL({
            size: 1024,
        }).replace('webp', 'png').replace('gif', 'png');

        const JPEG = users.displayAvatarURL({
            size: 1024,

        }).replace('webp', 'jpeg').replace('gif', 'jpeg');

        const PNGS = new ButtonBuilder()
            .setURL(PNG)
            .setLabel("PNG")
            .setStyle(ButtonStyle.Link);

        const JPGS = new ButtonBuilder()
            .setURL(JPEG)
            .setLabel("JPG")
            .setStyle(ButtonStyle.Link);

        const URL = new ActionRowBuilder().addComponents(PNGS, JPGS);

        const binyirmidört = new ButtonBuilder()
            .setURL(avatarURL)
            .setLabel("1024")
            .setStyle(ButtonStyle.Link);

        const ikibinkırksekiz = new ButtonBuilder()
            .setURL(avatarURL2)
            .setLabel("2048")
            .setStyle(ButtonStyle.Link);

        const dörtk = new ButtonBuilder()
            .setURL(avatarURL3)
            .setLabel("4096")
            .setStyle(ButtonStyle.Link);

        const URL2 = new ActionRowBuilder().addComponents(
            binyirmidört,
            ikibinkırksekiz,
            dörtk
        );

        if ("https://cdn.discordapp.com/embed/avatars/0.png" === avatarURL) {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({
                content: `Profil Fotoğrafı Bulunamadı.`,
                ephemeral: true,
            });
            return;
        }

        if (gizli) {
            await interaction.deferReply({ ephemeral: true });
            const avatarmenu = new EmbedBuilder()
                .setColor(Color)
                .setURL(avatarURL)
                .setTitle(`${username}`)
                .setImage(avatarURL)
                .setFooter({
                    text: `Komutu kullanan: ${interaction.user.username}\n©️ ${interaction.client.user.username
                        } ${new Date().getFullYear()}`,
                    iconURL: interaction.user.AvatarURL,
                })
                .setTimestamp();
            await interaction.editReply({
                embeds: [avatarmenu],
                components: [URL2, URL],
                ephemeral: true,
            });
        } else {
            await interaction.deferReply({ ephemeral: false });
            const avatarmenu = new EmbedBuilder()
                .setColor(Color)
                .setURL(avatarURL)
                .setTitle(`${username}`)
                .setImage(avatarURL)
                .setFooter({
                    text: `Komutu kullanan: ${interaction.user.username}\n©️ ${interaction.client.user.username
                        } ${new Date().getFullYear()}`,
                    iconURL: interaction.user.AvatarURL,
                })
                .setTimestamp();
            await interaction.editReply({
                embeds: [avatarmenu],
                components: [URL2, URL],
                ephemeral: false,
            });
        }
    }
};
