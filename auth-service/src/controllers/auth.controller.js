const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Por ahora usamos un array en memoria, luego conectamos PostgreSQL
const users = [];

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const exists = users.find(u => u.email === email);
    if (exists)
      return res.status(400).json({ error: 'El email ya está registrado' });

    // Nunca guardamos la contraseña en texto plano
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };

    users.push(user);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_temporal',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_temporal',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const me = (req, res) => {
  // Este endpoint lo protegeremos con middleware JWT en el siguiente paso
  res.json({ message: 'Endpoint protegido — próximo paso' });
};

module.exports = { register, login, me };