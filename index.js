const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

    const emailFormHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Restablecer contraseña</title>
        </head>
        <body>
            <p>${userId}</p>
            <h1>Restablecer contraseña</h1>
            <form id="resetPasswordForm">
                <input type="hidden" name="token" value="${token}" />
                <label for="newPassword">Nueva contraseña:</label>
                <input type="password" id="newPassword" name="newPassword" required />
                <button type="submit">Restablecer</button>
            </form>

            <script>
                document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
                    event.preventDefault(); // Prevenir el envío normal del formulario
                
                    const token = document.querySelector('[name="token"]').value;
                    const newPassword = document.getElementById('newPassword').value;
                
                    const data = { token, newPassword };
                
                    try {
                        const response = await fetch('/reset-password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });
                
                        if (response.ok) {
                            alert('Contraseña restablecida con éxito');
                        } else {
                            const errorData = await response.text(); // Usamos text() para obtener la respuesta como texto
                            try {
                                const jsonErrorData = JSON.parse(errorData); // Intentamos parsear como JSON
                                alert(`Error: ${jsonErrorData.message}`);
                            } catch (jsonError) {
                                alert(`Error: ${errorData}`); // Si no es JSON, mostramos el mensaje como texto
                            }
                        }
                    } catch (error) {
                        console.error('Error al enviar la solicitud:', error);
                        alert('Ocurrió un error al procesar la solicitud');
                    }
                });
            </script>
        </body>
        </html>
    `;

    res.send(emailFormHTML);
});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token) {
        return res.status(400).send('Token no proporcionado');
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const { data: users } = await axios.get(USERS_URL);

        // Buscar al usuario por ID
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        users[userIndex].password = newPassword;

        await axios.put(USERS_URL, users);

        // Actualizar la contraseña del usuario en la base de datos (simulado aquí)
        console.log(`Actualizando la contraseña para el usuario con ID ${userId}`);
        // Aquí debes hacer la lógica de actualización en tu base de datos

        // Responder al cliente
        res.send('Contraseña restablecida con éxito');
    } catch (error) {
        console.error(error);
        res.status(400).send('Token inválido o expirado');
    }
});


app.listen(port, () => console.log('Servidor corriendo en ', port));
