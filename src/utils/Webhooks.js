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

const { EmbedBuilder, WebhookClient } = require('discord.js');

async function prismawebhook(content, title) {
    if (!process.env.PrismaWebhookURL) return;
    const channel = new WebhookClient({ url: process.env.PrismaWebhookURL });
    try {
        const embed = new EmbedBuilder()
            .setTitle(`Kaynak: ${title ? title : 'Bilinmiyor'}`)
            .setDescription('### ' + content)
            .setColor("White")
            .setFooter({
                text: 'CloudUP Prisma Database'
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error('Mesaj gönderilemiyor Webhook errors: ', error);
    }
};

async function Dashboard_prismawebhook(content, title) {
    if (!process.env.DashboardPrismaWebhookURL) return;
    const channel = new WebhookClient({ url: process.env.DashboardPrismaWebhookURL });
    try {
        const embed = new EmbedBuilder()
            .setTitle(`Kaynak: ${title ? title : 'Bilinmiyor'}`)
            .setDescription('### ' + content)
            .setColor("Fuchsia")
            .setFooter({
                text: 'CloudUP LOGIN|RELOGIN'
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error('Mesaj gönderilemiyor Webhook errors: ', error);
    }
};

async function webhookErrors(client, content) {
    if (!process.env.Errorswebhook) return;
    const channel = new WebhookClient({ url: process.env.Errorswebhook });
    try {
        const embed = new EmbedBuilder()
            .setTitle("HATA")
            .setDescription('### ' + content)
            .setColor("Red")
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ size: 512, format: 'png', dynamic: true }),
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error('Mesaj gönderilemiyor Webhook errors: ', error);
    }
};

async function webhookUsage_Commands(interaction, content) {
    if (!process.env.webhookUsage_Commands) return;
    const channel = new WebhookClient({ url: process.env.webhookUsage_Commands });
    try {
        const embed = new EmbedBuilder()
            .setTitle("Komut Kullanım.")
            .setDescription(content)
            .setColor("Orange")
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL({ size: 512, format: 'png', dynamic: true }),
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.error('Mesaj gönderilemiyor Webhook errors: ', error);
    }
};

module.exports = {
    prismawebhook, Dashboard_prismawebhook, webhookErrors, webhookUsage_Commands
}
