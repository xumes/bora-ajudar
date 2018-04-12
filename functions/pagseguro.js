const request = require('request-promise')
const parse = require('xml2js').parseString

const token = '9484D56F6016425F9C4E7F6E9C593CAB'
const email = 'reginaldosantos.br@gmail.com'
const pagseguro = 'https://ws.pagseguro.uol.com.br/v2/checkout'
const sandbox = 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout'

const pagseguroUrlFinaliza = 'https://pagseguro.uol.com.br/v2/checkout/payment.html?code='
const sandboxUrlFinaliza = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code='
const checkoutCode = ''

// request({
//     uri: pagseguro,
//     method: 'POST',
//     form: {
//         token: token,
//         email: email,
//         currency: 'BRL',
//         itemId1: 'campanha1',
//         itemDescription1: 'Doação',
//         itemAmount1: '3.00',
//         itemQuantity1: 1
//     },
//     headers: {
//         'Content-Type': 'application/x-www-urlencoded; charset=UTF-8'
//     }
// })
//     .then(data => {
//         parse((data), (err, json) => {
//             if (err) {
//                 console.log('Deu ruim', err)
//             }
//             console.log(json)
//             checkoutCode = json.checkout.code[0]
//         })
//     })

const notificationCode = '' 
const consultaNotificacao = 'https://ws.pagseguro.uol.com.br/v3/transactions/notifications'
request(
    `${consultaNotificacao}${notificationCode}?token='${token}'&email='${email}'`
)
.then( notificationXML => {
    parse(notificationXML, (err, transactionJson) => {
        const transaction = transactionJson.transaction
       
        const transacao = {
            transaction: transaction,
            status: transaction.status[0],
            valor :  transaction.grossAmount[0],
            valorLiquido :  transaction.netAmount[0],
            doador :  transaction.sender[0],
            endereco :  transaction.shipping[0],
            dataTransacao :  transaction.date[0],
            campanha: transaction.items[0].item[0].id[0]
        }
        console.log(transactionJson.transaction)
    })
})