const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const express = require('express');

const app = express();
admin.initializeApp();

app.post('/', async (req, res) => {
    let token = req.body.token;
    let title = req.body.title;
    let message = req.body.message;

    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'POST');

    const tokensArr = [];
    const allTokens = await admin.firestore().collection('tokens').get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            tokensArr.push(doc.data().token);
        })
    });

    let payload = {
        notification: {
            title: title,
            body: message,
            image: 'http://ivtm.modestocabralweb.com/logo.png'
        }
    };

    try {
        let response = await admin.messaging().sendToDevice(tokensArr, payload);
        return res.json(response);
    } catch(err) {
        return res.json(err).status(500);
    }

});

exports.notifications = functions.https.onRequest(app);
