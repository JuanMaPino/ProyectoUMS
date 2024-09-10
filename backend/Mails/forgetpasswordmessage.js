const transporter = require("../Middleware/mailconfig");
const sendCode = async (usuario, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: usuario.email,
        subject: 'Código de Verificación - Recuperación de Contraseña',
        html: `
        <div>
            <p>Hola <strong>${usuario.usuario}</strong>,</p>
            <p>Has solicitado recuperar tu contraseña. Por favor, usa el siguiente código de verificación para continuar con el proceso:</p>
            <h2 style="text-align: center;">${verificationCode}</h2>
            <p>Este código es válido por 30 minutos. Si no has solicitado este código, por favor ignora este correo.</p>
            <p>Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.</p>
            <p><strong>¡Gracias por tu preferencia!</strong></p>
            <p><img src="https://res.cloudinary.com/doliz92a2/image/upload/v1724357330/lb45qhachcufmm9rd2wq.png"  alt="Logo" style="width:150px;height:auto;"/></p>
        </div>
        `,
        headers: {
            'X-Priority': '1 (Highest)',
            'X-MSMail-Priority': 'High',
            'Importance': 'High'
        }
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Código de verificación enviado a ${usuario.email}`);
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error.message);
    }
};

module.exports = { sendCode };