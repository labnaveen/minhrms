require('dotenv').config()


export var DATABASE= process.env.DB_NAME as string
export var DB_PORT = Number(process.env.DB_PORT) 
export var DB_USER = process.env.DB_USER as string
export var DB_PASSWORD = process.env.DB_PASSWORD as string
export var DB_HOST = process.env.DB_HOST as string
export var PORT = process.env.SERVER_PORT as string
export var JWT_TOKEN = process.env.JWT_TOKEN as string
export var JWT_SECRET = process.env.JWT_SECRET as string
export var GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY as string