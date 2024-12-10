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

app.get('/reset-password', (req, res) => {
    const { token } = req.query;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Restablecer contraseña</title>
        </head>
        <body>
            <p>${userId}</>
            <h1>Restablecer contraseña</h1>
            <form action="/reset-password" method="POST">
                <input type="hidden" name="token" value="${token}" />
                <label for="newPassword">Nueva contraseña:</label>
                <input type="password" id="newPassword" name="newPassword" required />
                <button type="submit">Restablecer</button>
            </form>
        </body>
        </html>
    `);
});


app.listen(port, () => console.log('Servidor corriendo en ', port));
