require('dotenv').config()
const express = require("express")
const nodemail = require("nodemailer")
const app = express()
const QRCode = require('qrcode')
const {
    createCanvas,
    loadImage
} = require('canvas')
const canvas = createCanvas(300, 300)

const port = 3000

app.get("/", (req, res) => res.send("Hello World"));

async function qrCode(text) {
    return await QRCode.toCanvas(canvas, text, function (err, string) {
        if (err) throw err
    })
}

qrCode("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

app.get("/send", async (req, res) => {

    const transporter = nodemail.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const emailText = {
        from: process.env.EMAIL_USER,
        to: "vinibilk4@gmail.com",
        subject: "Teste",
        attachDataUrls: true,
        html: '<img src="' + canvas.toDataURL() + '" />'
    }

    await transporter.sendMail(emailText, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("E-mail Enviado")
            console.log(info);
        }
    })
    res.send('<img src="' + canvas.toDataURL() + '" />')
})

app.listen(port, () => console.log(`Running on port ${port}`))