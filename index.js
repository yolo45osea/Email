const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const port = 3000;

const USERS_URL = 'https://usuarios-1-hwrj.onrender.com/choferes'

// Configurar CORS para permitir todo
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';
const JWT_EXPIRATION = '1h';

app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text, userId } = req.body;


        //emailText = `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`;

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
            text
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado', info });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/*const bcrypt = require('bcryptjs');

app.get('/reset-password', (req, res) => {
  const { token } = req.query;
  const decoded = jwt.verify(token, JWT_SECRET);
  const userId = decoded.userId;

  const emailFormHTML = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Restablecer contraseña</title>
      </head>
      <body>
          <p>${userId}</p>
          <h1>Restablecer contraseña</h1>
          <form id="myForm">
              <input type="hidden" name="token" value="${token}" />
              <label for="newPassword">Nueva contraseña:</label>
              <input type="password" id="newPassword" name="newPassword" required />
              <button type="submit">Restablecer</button>
          </form>

          <script>
              document.getElementById('myForm').addEventListener('submit', function(event) {
                event.preventDefault();  // Evita que el formulario se envíe de manera tradicional

                const pass = document.getElementById('newPassword').value;
                const token = document.querySelector('input[name="token"]').value;

                // Envía la nueva contraseña al backend para actualizar el usuario
                fetch('/update-password', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token, newPassword: pass })
                })
                .then(response => response.json())
                .then(data => {
                  console.log('Éxito:', data);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
              });
          </script>
      </body>
      </html>
  `;

  res.send(emailFormHTML);
});

app.post('/update-password', (req, res) => {
  const { token, newPassword } = req.body;
  const decoded = jwt.verify(token, JWT_SECRET);
  const userId = decoded.userId;

  // Aquí debes actualizar la contraseña en tu base de datos
  // Este es un ejemplo simple, adaptado a tu estructura de base de datos
  User.findById(userId, (err, user) => {
      if (err || !user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      user.password = newPassword;  // Actualiza la contraseña
      user.save((err) => {
          if (err) {
              return res.status(500).json({ message: 'Error al actualizar la contraseña' });
          }
          res.json({ message: 'Contraseña actualizada con éxito' });
      });
  });
});*/


app.listen(port, () => console.log('Servidor corriendo en ', port));
