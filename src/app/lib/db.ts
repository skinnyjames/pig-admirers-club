import dotenv from 'dotenv'
import {IMain, IDatabase} from 'pg-promise'
import pgPromise from 'pg-promise'
dotenv.config()

const pgp:IMain = pgPromise()
const url: string = process.env['DATABASE_URL']
const db:IDatabase<any> = pgp(url)

export = db