const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;

// Configurar CORS para permitir todo
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

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
            from: 'benj.romeroc@duocuc.cl',
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

app.listen(port, () => console.log('Servidor corriendo en ', port));
