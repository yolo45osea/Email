const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Configurar CORS para permitir todo
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRATION = '1h';

app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text, userId } = req.body;

        const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        const resetLink = `https://email-logu.onrender.com/reset-password?token=${token}`;

        emailText = `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`;

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "transferaeropuerto0@gmail.com",
            pass: "ovax yhtj mdev nkig",
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailOptions = {
            from: 'transferaeropuerto0@gmail.com',
            to,
            subject,
            text: emailText
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado', info });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

const bcrypt = require('bcryptjs');

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Obtener usuarios desde la nube
    const { data: users } = await axios.get(USERS_URL);

    // Buscar al usuario por ID
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;

    // Enviar los datos actualizados a la nube (suponiendo que la API permite POST/PUT)
    await axios.put(USERS_URL, users); // Asegúrate de que tu endpoint soporte PUT

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
});


app.listen(port, () => console.log('Servidor corriendo en ', port));
