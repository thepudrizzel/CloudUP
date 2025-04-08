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

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel
} = require("discord.js");
module.exports = class test {
    constructor() {
        (this.cooldown = 10),
            (this.category = "User"),
            (this.name = "server-info"),
            (this.slashCommand = new SlashCommandBuilder()
                .setName("server-info")
                .setDescription("Server İnfo"));
    }

    async run(client, interaction) {
    
                const { guild } = interaction;
                const {
                    members,
                    channels,
                    emojis,
                    roles,
                    stickers
                } = guild;
                
                const sortedRoles  = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
                const userRoles    = sortedRoles.filter(role => !role.managed);
                const managedRoles = sortedRoles.filter(role => role.managed);
                const botCount     = members.cache.filter(member => member.user.bot).size;
        
                const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
                    let totalLength = 0;
                    const result = [];
        
                    for (const role of roles) {
                        const roleString = `<@&${role.id}>`;
        
                        if (roleString.length + totalLength > maxFieldLength)
                            break;
        
                        totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
                        result.push(roleString);
                    }
        
                    return result.length;
                }
        
                const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
                const toPascalCase = (string, separator = false) => {
                    const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
                    return separator ? splitPascal(pascal, separator) : pascal;
                };
        
                const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
                
                const totalChannels = getChannelTypeSize([
                    ChannelType.GuildText,
                    ChannelType.GuildNews,
                    ChannelType.GuildVoice,
                    ChannelType.GuildStageVoice,
                    ChannelType.GuildForum,
                    ChannelType.GuildPublicThread,
                    ChannelType.GuildPrivateThread,
                    ChannelType.GuildNewsThread,
                    ChannelType.GuildCategory
                ]);
        
                interaction.reply({ embeds: [
                    new EmbedBuilder()
                        .setColor(members.me.roles.highest.hexColor)
                        .setTitle(`${guild.name} Adlı Sunucunun Bilgileri`)
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                        .setImage(guild.bannerURL({ size: 1024 }))
                        .addFields(
                            { name: "Tanım", value: `📝 ${guild.description || "Bulunmuyor."}` },
                            {
                                name: "General",
                                value: [
                                    `📜 **Kuruluş** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                                    `💳 **ID** ${guild.id}`,
                                    `👑 **Kurucu** <@${guild.ownerId}>`,
                                    `🌍 **Dil** ${new Intl.DisplayNames(["en"], { type: "language" }).of(guild.preferredLocale)}`,
                                    `💻 **Özel URL** ${guild.vanityURLCode || "Bulunmuyor."}`,
                                ].join("\n")
                            },
                            { name: "Özellikler", value: guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "Bulunmuyor.", inline: true },
                            {
                                name: "Koruma",
                                value: [
                                    `👀 **Filtreler** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], " ")}`,
                                    `🔞 **NSFW Seviyesi** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                                    `🔒 **Doğrulama Düzeyi** ${splitPascal(GuildVerificationLevel[guild.verificationLevel], " ")}`
                                ].join("\n"),
                                inline: true
                            },
                            {
                                name: `Üyeler (${guild.memberCount})`,
                                value: [
                                    `👨‍👩‍👧‍👦 **Üyeler** ${guild.memberCount - botCount}`,
                                    `🤖 **Botlar** ${botCount}`
                                ].join("\n"),
                                inline: true
                            },
                            { name: `Kullanıcının Rolü (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "Bulunmuyor."}`},
                            { name: `Yönetici Rolü (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "Bulunmuyor."}`},
                            {
                                name: `Kanal, Alt Başlık & Kategori (${totalChannels})`,
                                value: [
                                    `💬 **Yazı** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                                    `🎙 **Ses** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                                    `🧵 **Alt Başlık** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                                    `📑 **Kategori** ${getChannelTypeSize([ChannelType.GuildCategory])}`
                                ].join("\n"),
                                inline: true
                            },
                            {
                                name: `Emojiler & Stickerlar (${emojis.cache.size + stickers.cache.size})`,
                                value: [
                                    `📺 **Animasyon** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                                    `🗿 **Sticker** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                                    `🏷 **Çıkartma** ${stickers.cache.size}`
                                ].join("\n"),
                                inline: true
                            },
                            { 
                                name: "Nitro",
                                value: [
                                    `📈 **Aşama** ${guild.premiumTier || "Bulunmuyor."}`,
                                    `💪🏻 **Takviye** ${guild.premiumSubscriptionCount}`,
                                    `💎 **Takviyeciler** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                                    `🏋🏻‍♀️ **Toplam Takviyeciler** ${guild.members.cache.filter(member => member.premiumSince).size}`
                                ].join("\n"),
                                inline: true
                            },
                            { name: "Afiş", value: guild.bannerURL() ? "** **" : "Bulunmuyor." }
                        )
                ], ephemeral: false });
    }
};