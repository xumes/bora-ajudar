const functions = require('firebase-functions');
const admin = require('firebase-admin')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
// admin.initializeApp(functions.config().firease) //start firebase on our app
admin.initializeApp()

const request = require('request-promise')
const parse = require('xml2js').parseString

const token = '9484D56F6016425F9C4E7F6E9C593CAB'
const email = 'reginaldosantos.br@gmail.com'
const pagseguro = 'https://ws.pagseguro.uol.com.br/v2/checkout'
const sandbox = 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout'

const pagseguroUrlFinaliza = 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code='
const sandboxUrlFinaliza = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code='
let checkoutCode = ''



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

app.get('/', (req, res) => {
    res.send('Backend server')
})

app.post('/donate', (req, res) => {
    const valor = req.body.valor
    request({
        uri: pagseguro,
        method: 'POST',
        form: {
            token: token,
            email: email,
            currency: 'BRL',
            itemId1: req.body.campanha,
            itemDescription1: 'Doação',
            itemAmount1: valor,
            itemQuantity1: 1
        },
        headers: {
            'Content-Type': 'application/x-www-urlencoded; charset=UTF-8'
        }
    })
        .then(data => {
            parse((data), (err, json) => {
                if (err) {
                    console.log('Deu ruim', err)
                }
                console.log(json)
                checkoutCode = json.checkout.code[0]
                res.send({
                    url: `${pagseguroUrlFinaliza}${checkoutCode}`
                })
            })
        })
})

app.post('/webhook', (req, res) => {
    const notificationCode = req.body.notificationCode
    const consultaNotificacao = 'https://ws.pagseguro.uol.com.br/v3/transactions/notifications'
    request(
        `${consultaNotificacao}${notificationCode}?token='${token}'&email='${email}'`
    )
        .then(notificationXML => {
            parse(notificationXML, (err, transactionJson) => {
                const transaction = transactionJson.transaction

                const transacao = {
                    transaction: transaction,
                    code: transaction.code[0],
                    status: transaction.status[0],
                    valor: transaction.grossAmount[0],
                    valorLiquido: transaction.netAmount[0],
                    doador: transaction.sender[0],
                    endereco: transaction.shipping[0],
                    dataTransacao: transaction.date[0],
                    campanha: transaction.items[0].item[0].id[0]
                }

                //atualizando a campanha com os valores recebidos
                admin
                    .database()
                    .ref('/campanhas/' + transacao.campanha)
                    .once('value')
                    .then(value => {
                        console.log(value.val())
                        const campanhaAtual = value.val()
                        const doado = parseFloat(campanhaAtual.doado) + parseFloat(transacao.valor)
                        console.log('valor doado', doado)
                        campanhaAtual.doado = doado.toFixed(2)
                        admin
                            .database()
                            .ref('/campanhas/' + campanha)
                            .set(campanhaAtual)
                            .then(() => {
                                res.send('ok')
                            })
                    })

                //gravando a transação
                admin
                    .database()
                    .ref('/transaction/' + transacao.code)
                    .set(transacao)
                    .then(() => {

                    })
            })
        })
})

exports.api = functions.https.onRequest(app)