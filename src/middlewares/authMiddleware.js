const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Ticket = require('../models/ticket')  


const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded 
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' })
  }
}

//Middleware para verificar se o usuário é admin
const authorizeAdmin = (req, res, next) => {
  console.log('User:', req.user) 

  if (!req.user || req.user.role !== 'admin') {
    console.log('Acesso negado. Requer privilégios de administrador.') 
    return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' })
  }

  next()
}

const getUserHistory = async (req, res) => {
  try {
    //Usando o método aggregate para agrupar os tickets comprados pelo usuário e contar quantos de cada tipo foram comprados
    const ticketsBought = await Ticket.aggregate([
      { $match: { user: req.user.id } },  //Filtra os tickets comprados pelo usuário logado
      { $group: {  //Agrupa os tickets por id, contando a quantidade de cada tipo comprado
        _id: "$_id",
        name: { $first: "$name" },
        price: { $first: "$price" },
        stock: { $first: "$stock" },
        quantityBought: { $sum: 1 } //Conta quantos tickets desse tipo foram comprados
      }},
      { $sort: { name: 1 } }  //Ordena os tickets pelo nome (opcional)
    ])

    if (ticketsBought.length === 0) {
      return res.status(404).json({ message: 'Nenhuma compra encontrada.' })
    }

    res.status(200).json({ message: 'Histórico de compras:', tickets: ticketsBought })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar histórico de compras.', error })
  }
}


module.exports = { authenticate, authorizeAdmin, getUserHistory }
