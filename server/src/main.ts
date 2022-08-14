import express, { Application } from 'express'
import cors from 'cors'
import { z } from 'zod'
import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'

interface User {
    name: string | null
    id: number  
}

const users: User[] = []

function getUsers(): User[] {
    return users 
}

const app: Application = express()

app.use(express.json())
app.use(cors({}))

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})

const apiRouter = trpc.router()
    .query('', {
        async resolve(req) {
            return 'trpc route'
        }
    })
    .query('getUsers', {
        input: z.undefined(),
        async resolve(req) {
            return getUsers()
        }
    })
    .mutation('createUser', {
        input: z.object({ name: z.string().nullable() }),
        async resolve(req) {
            const name = req.input?.name
            users.push({ name, id: Date.now() })
            console.log(users.length, 'user length')
            return getUsers()
        }
    })

app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext
}))

app.use('/', trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext
}))

app.listen(5000, () => {
    console.log('Server listening on port 5000')
})

createHTTPHandler({
    router: apiRouter,
    createContext: () => null
})

export type ApiRouter = typeof apiRouter