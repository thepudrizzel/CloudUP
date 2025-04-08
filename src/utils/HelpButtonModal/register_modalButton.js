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

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
    Register_Modal: function () {
        const ROLE = new ButtonBuilder()
            .setCustomId('rgROLE_modal_0')
            .setLabel('Rol Kurulum')
            .setStyle(ButtonStyle.Success);

        /* const CHANNEL = new ButtonBuilder()
             .setCustomId('rgCHANNEL_modal_1')
             .setLabel('Kanal Kurulum')
             .setStyle(ButtonStyle.Success);
 
         const AGE_REQ = new ButtonBuilder()
             .setCustomId('rgAGE_modal_2')
             .setLabel('Isim Yaş Kurulum')
             .setStyle(ButtonStyle.Success);
 
         const GUILD_TAG = new ButtonBuilder()
             .setCustomId('rgTAG_modal_3')
             .setLabel('Simge Kurulum')
             .setStyle(ButtonStyle.Success);*/

        const Register_row = new ActionRowBuilder()
            .addComponents(ROLE);
        return Register_row;
    },
    RegisterShow_Model: async function (buttons, embed) {
        const ROLE_MODEL = new ModalBuilder()
            .setCustomId('rgRole_model')
            .setTitle('Kayıt için rol ayarları');

        const Erkek_Role = new TextInputBuilder()
            .setCustomId("ErkekRole_Model")
            .setLabel(`Erkek rol`)
            .setPlaceholder('Rol adı yada Rol id')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const Kadin_Role = new TextInputBuilder()
            .setCustomId("KadinRole_Model")
            .setLabel(`Kadın rol`)
            .setPlaceholder('Rol adı yada Rol id')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const Kayitsiz_Role = new TextInputBuilder()
            .setCustomId("KayitsizRole_Model")
            .setLabel(`Kayıtsız rol`)
            .setPlaceholder('Rol adı yada Rol id')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const Yetkili_Role = new TextInputBuilder()
            .setCustomId("YetkiliRole_Model")
            .setLabel(`Yetkili rol`)
            .setPlaceholder('Rol adı yada Rol id')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const erkek = new ActionRowBuilder().addComponents(Erkek_Role);
        const kadin = new ActionRowBuilder().addComponents(Kadin_Role);
        const kayitsiz = new ActionRowBuilder().addComponents(Kayitsiz_Role);
        const yetkili = new ActionRowBuilder().addComponents(Yetkili_Role);
        ROLE_MODEL.addComponents(erkek, kadin, kayitsiz, yetkili);
        await buttons.showModal(ROLE_MODEL);
        return ROLE_MODEL;
    },
    ModalEventHandler: async function (interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'rgRole_model') {
                const disableButton = new ButtonBuilder()
                    .setCustomId('rgModal_disable_button')
                    .setLabel('Kayit rolleri ayarlandı.')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Danger);

                const disabledRow = new ActionRowBuilder().addComponents(disableButton);
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply({
                    content: "İşlem tamam!",
                    components: [disabledRow]
                }).catch(console.error);
                return;
            }
        }
    }
}
