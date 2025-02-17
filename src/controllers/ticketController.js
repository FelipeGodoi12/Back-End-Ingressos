const Ticket = require('../models/ticket')

const createTicket = async (req, res) => {
  try {
    const { name, price, stock } = req.body

    if (stock < 0) {
      return res.status(400).json({ message: 'A quantidade de ingressos deve ser maior ou igual a zero.' })
    }

    const newTicket = new Ticket({ name, price, stock, user: req.user.id })
    
    await newTicket.save()
    res.status(201).json({ message: 'Ticket criado com sucesso!', ticket: newTicket })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao criar ticket.', error })
  }
}

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, stock } = req.body

    if (stock < 0) {
      return res.status(400).json({ message: 'A quantidade de ingressos deve ser maior ou igual a zero.' })
    }

    const ticket = await Ticket.findByIdAndUpdate(id, { name, price, stock }, { new: true })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado.' })
    }

    res.status(200).json({ message: 'Ticket alterado com sucesso!', ticket })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alterar ticket.', error })
  }
}


const buyTicket = async (req, res) => {
  const { ticketId, quantity } = req.body 
  const userId = req.user.id 

  try {
    // Encontre o ticket no banco
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado.' })
    }

    //Verifica se ainda tem no estoque
    if (ticket.stock < quantity) {
      return res.status(400).json({ message: 'Estoque insuficiente para a quantidade solicitada.' })
    }

    //Atualiza o estoque do ticket
    ticket.stock -= quantity
    await ticket.save()

    res.status(200).json({ message: 'Compra realizada com sucesso!', ticket })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao realizar a compra.', error })
  }
}

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()  
    res.status(200).render('tickets', { tickets, title: 'Ingressos Disponíveis' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar ingressos.', error })
  }
}



module.exports = { createTicket, updateTicket, buyTicket, getTickets }
