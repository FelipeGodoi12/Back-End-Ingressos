require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/database')

connectDB()
//const ticketRoutes = require('./routes/ticketRoutes');


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
});
