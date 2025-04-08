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
    Router
} = require('express');
const passport = require('passport');

const router = Router();

router.get('/discord', passport.authenticate('discord'), (req, res) => {
    res.sendStatus(200)
});

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.send('Başarıyla giriş yaptınız.')
});

router.get('/status', (req, res) => {
    return req.user ? res.send(req.user) : res.status(401).send('Doğrulanmamış üye.');
});

module.exports = router;
