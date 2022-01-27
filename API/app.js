const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config()
const usuarios = require('./routes/usuarioRoute')



//inicia o express
const app = express()


//middleware
app.use(express.json())


//routes
app.use('/usuario', usuarios)

//port
const port = 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, console.log(`servidor rodando na porta ${port}...`))
    } catch(error){
        console.log(error)
    }
}

start()