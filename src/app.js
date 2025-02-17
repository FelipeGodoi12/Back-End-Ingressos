const express = require('express')
const mustacheExpress = require('mustache-express')
const path = require('path')
const router = require('./routes/routes')  

const app = express()

//Configuração do Mustache 
app.engine('mustache', mustacheExpress())
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

module.exports = app
