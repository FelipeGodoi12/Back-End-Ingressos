const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const ticketController = require('../controllers/ticketController')
const { authenticate, authorizeAdmin, getUserHistory } = require('../middlewares/authMiddleware') 


//Rotas front end

//Página inicial
router.get('/', (req, res) => {
    const token = req.query.token || 'Token não encontrado';
    res.render('index', { title: 'Página Inicial', token: token });
});

//Rota com os eventos com ingressos disponíveis
router.get('/ingressos', ticketController.getTickets);

//Rotas de cadastro e login (back-end)
router.get('/cadastro', (req, res) => {
    res.render('cadastro', { title: 'Cadastro' });
});
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });  
});

//Rotas back-end

//Rotas de cadastro e login (back-end)
router.post('/login', authController.loginUser)
router.post('/cadastro', authController.cadastroUser)

//Rotas para comprar tickets e acessar histórico
router.post('/tickets/buy', authenticate, ticketController.buyTicket)
router.get('/tickets/history', authenticate, getUserHistory, (req, res) => {
    res.status(200).json({ message: 'Histórico de compras:', tickets: req.userHistory });
});

//Rotas gerenciamento dos tickets (admins)
router.post('/tickets/create', authenticate, authorizeAdmin, ticketController.createTicket)
router.put('/tickets/update/:id', authenticate, authorizeAdmin, ticketController.updateTicket)

module.exports = router
