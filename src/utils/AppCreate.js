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

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const routes = require('../routes');
require('../strateji-discord/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

function CreateApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true
    }));

    app.use(session({
        secret: 'CC12:121AC.A980SC.C21_SDCX1Z*',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60 * 24 * 7
        },
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', routes)
    return app;
}

module.exports.server = CreateApp;