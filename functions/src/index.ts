import * as functions from 'firebase-functions';
import * as messaging from 'firebase-messaging';
import * as nodemailer from 'nodemailer';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(
	'BOGbFzr0df6Ny5TKXxe0Q9FZqFiImd9mki3Uv6GMFOnT9ZcNrWhUdL_LSgYdkralD3EmsMQ1MADYfAhoheM_QJk'
);

const gmailEmail = 'daniel.chony@gmail.com';
const gmailPassword = 'Chony0666';
const mailTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailEmail,
		pass: gmailPassword
	}
});

const APP_NAME = 'Alacena';

exports.mail = functions.https.onRequest((req, res) => {
	const body = JSON.parse(req.body);
	if (body.name !== undefined && body.email !== undefined) {
		const mailOptions = {
			to: 'develop.apps.chony@gmail.com',
			subject: `${APP_NAME} message from ` + body.name,
			text:
				'\n\n' +
				body.name +
				'[' +
				body.email +
				'] says:\n\n' +
				body.message +
				'\n\n\n\nLogs:\n\n' +
				body.logs
		};
		mailTransport
			.sendMail(mailOptions)
			.then(() => {
				res.status(200);
				res.send('Message sent');
			})
			.catch(() => {
				res.status(400);
				res.send('Error sending message');
			});
	} else {
		console.log(req);
		console.error('no data');
	}
});

exports.notification = functions.https.onRequest((req, res) => {
	console.log('Sending notification');
	//const body = JSON.parse(req.body);
	const body = req.body;
	admin
		.database()
		.ref('/tokens/' + [body.UUID])
		.once('value', snapshot => {
			// Notification details.
			const payload = {
				notification: {
					title: 'Alacena Notification!',
					body: body.from + ' says: ' + body.message,
					icon: ''
				}
			};
			const tokens = Object.keys(snapshot.val());
			admin
				.messaging()
				.sendToDevice(tokens, payload)
				.then(response => {
					// For each message check if there was an error.
					const tokensToRemove = [];
					response.results.forEach((result, index) => {
						const error = result.error;
						if (error) {
							console.error(
								'Failure sending notification to',
								tokens[index],
								error
							);
							// Cleanup the tokens who are not registered anymore.
							if (
								error.code === 'messaging/invalid-registration-token' ||
								error.code === 'messaging/registration-token-not-registered'
							) {
								tokensToRemove.push(snapshot.ref.child(tokens[index]).remove());
							}
						} else {
							res.status(200);
							res.send(
								body.from + ' says: ' + body.message + ' to ' + snapshot.val()
							);
						}
					});
					console.log(tokensToRemove);
				})
				.catch(error => {
					res.status(400);
					res.send('Error sending notifications:' + JSON.stringify(error));
				});
		})
		.catch(error => {
			res.status(400);
			res.send('Error getting token:' + JSON.stringify(error));
		});
});

exports.contacts = functions.https.onRequest((req, res) => {
  	console.log('Getting App users');
    admin.auth().listUsers()
      .then(
        (listUsersResult) => {
          if(listUsersResult.users){
            res.status(200);
            res.send(listUsersResult.users);
          }else{
            res.status(400);
            res.send('No users found');
          }
        }
      )
      .catch(error => {
					res.status(400);
					res.send('Error sending notifications:' + JSON.stringify(error));
				}
      );
});
