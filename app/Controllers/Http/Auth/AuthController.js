'use strict'

class AuthController {
    async register({req, res}) {}

    async login({req, res, auth}) {}
    
    async refresh({req, res, auth}) {}

    async logout({req, res, auth}) {}
}

module.exports = AuthController
