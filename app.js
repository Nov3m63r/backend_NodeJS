'use strict';
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//const port = 8081;
const port = 3000;

// // View engine setup
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');

// // Static folder
// app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.get('/quit', function(req,res) {
    res.send('closing..');
    app.close();
  });

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new request</p>
    <h3>Details</h3>
    <ul>  
      <li>Name: ${req.body.username}</li>
      <li>Contacts: ${req.body.contacts}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        // host: 'mail.YOURDOMAIN.com',
        // port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: 'njsmailer@gmail.com',
            pass: 'jsnodemail'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'Friday', // sender address
        to: 'njsmailer@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {
            msg: 'Email has been sent'
            //alert('Email has been sent');
        });
    });

});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }

    //let host = server.address().address;
    //console.log('Server is listening at http://%s:%s', host, port);
    console.log('Server is listening on', port);
});