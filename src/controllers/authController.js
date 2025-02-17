const User = require('../models/user')
const jwt = require('jsonwebtoken')

const cadastroUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    //Verifica se já existe um usuário admin
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe.' })
    }

    //Verifica se é o primeiro usuário, se for, define como admin
    const countUsers = await User.countDocuments()
    const role = countUsers === 0 ? 'admin' : 'user'

    const newUser = new User({ username, email, password, role })
    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', token })
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error) 
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' })
    }

    // Aqui, você precisa incluir a role ao gerar o token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({ message: 'Login bem-sucedido!', token })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login.', error })
  }
}


module.exports = { cadastroUser, loginUser }
