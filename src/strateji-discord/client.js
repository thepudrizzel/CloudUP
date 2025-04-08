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

const passport = require('passport');
const { Strategy } = require('passport-discord');
const { PrismaClient } = require('@prisma/client');
var moment = require('moment');
const { Dashboard_prismawebhook } = require('../utils/Webhooks');
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const oldUser = await prisma.dashUser.findUnique({
            where: {
                id: id
            }
        });
        return oldUser ? done(null, oldUser) : done(null, null)
    } catch (error) {
        console.log(error);
        return done(error, null);
    }
});

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_CALLBACK_URL,
    scope: ['identify', 'email', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    async function main() {
        try {
            const newUser = await prisma.dashUser.upsert({
                create: {
                    userID: profile.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                update: {
                    userID: profile.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                where: {
                    userID: profile.id,
                }
            });
            var tarih = moment(newUser.createdAt);
            var tarih2 = moment(newUser.updatedAt);

            var tarihStr = tarih.locale('tr').format("dddd, Do MMMM YYYY, HH:mm:ss");
            var tarih2Str = tarih2.locale('tr').format("dddd, Do MMMM YYYY, HH:mm:ss");

            Dashboard_prismawebhook(`(<@${newUser.userID}> ${newUser.userID}). Dashboard'a erişim sağladı.\nDashboard Giriş Tarih: ${tarihStr}\nDashboard Giriş Güncelleme: ${tarih2Str}`, `Dashboard ID: ${newUser.id}`)
            return done(null, newUser);
        } catch (error) {
            console.log(error);
            return done(error, undefined);
        }
    }
    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
        });
}));