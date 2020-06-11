'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {
    async register({request, response}) {
        const trx = await Database.beginTransaction()
        try {
            const { username, name, email, password } = request.all()
            const user = await User.create({username, name, email, password}, trx)
            const userRole = await Role.findBy('slug', 'admin')
            await user.roles().attach([userRole.id], null, trx)
            await trx.commit()
            return response.status(201).send({ data: user })
        } catch(err) {
            await trx.rollback()
            return response.status(400).send({
                message: 'Erro ao realizar cadastro',
                error: err.message
            })
        }
    }

    async login({request, response, auth}) {
        const { email, password } = request.all()
        let data = await auth.withRefreshToken().attempt(email, password)
        return response.send( data )
    }
    
    async refresh({request, response, auth}) {
        var refresh_token = request.input('refresh_token')

        if(!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        const user = await auth.newRefreshToken().generateForRefreshToken(refresh_token)

        return response.send({ data: user })
    }

    async logout({request, response, auth}) {
        let refresh_token = request.input('refresh_token')

        if(!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        await auth.authenticator('jwt').revokeTokens([refresh_token], true)

        return response.status(204).send({})
    }
}

module.exports = AuthController
