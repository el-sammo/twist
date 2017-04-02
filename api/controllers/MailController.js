/**
 * MailController
 *
 * @description :: Server-side logic for managing Mails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
var Promise = require('bluebird');

var env = sails.config.environment;

// temporary debug code
env = 'production';

module.exports = {
	sendNotifyToOperator: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
//			var email = '3072676486@vtext.com, 3072581099@vtext.com, 3073151672@vtext.com';
			var email = '3072676486@vtext.com';
			sendMail(email, 'Reservation Placed!', 'placed', customerId);
		}
	},

	sendFailToOperator: function(req, res) {
		if(env && env === 'production') {
			var email = 'sam.barrett@gmail.com';
			var orderId = 'order_id_not_passed';
			if(req.params.id) {
				orderId = req.params.id;
			}
			sendMail(email, 'Payment Failed!', 'failed', orderId);
		}
	},

	sendUpdateToCustomer: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			promise.then(function(customer) {
				var customer = customer[0];
				var email = customer.phone + '@vtext.com';
				sendMail(email, 'On the Way!', 'update', customer);
			});
		}
	},

	sendConfirmationToCustomer: function(req, res) {
console.log('sendConfirmationToCustomer() called');
		if(env && env === 'production') {
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			return promise.then(function(customer) {
				var customer = customer[0];
				return sendMail(customer.email, 'Thanks for Joining Fantasy Horse Daily!', 'signup', customer).then(function(sendMailResponse) {
console.log(' ');
console.log('sendMailResponse:');
console.log(sendMailResponse);
// TODO: not properly returning to caller
					return sendMailResponse;
				});
			});
		}
	},

	sendFeedbackToManagement: function(req, res) {
		if(env && env === 'production') {
			var feedbackId = req.params.id;
			var email = 'sam.barrett@gmail.com';
			sendMail(email, 'Feedback Received!', 'feedback', feedbackId);
		}
	},

	sendOrderToCustomer: function(req, res) {
		if(env && env === 'production') {
			var customerId = req.params.id;
	
			promise = Customers.find(customerId);
	
			promise.then(function(customer) {
				var customer = customer[0];
				sendMail(customer.email, 'Thanks for Reserving!', 'order', customer);
			});
		}
	},

	sendToApplicant: function(req, res) {
		if(env && env === 'production') {
			var applicantId = req.params.id;
	
			promise = Applicants.find(applicantId);
	
			promise.then(function(applicant) {
				var applicant = applicant[0];
				sendMail(applicant.email, 'Thanks for Applying!', 'apply', applicant);
			});
		}
	}
};

function sendMail(email, subject, template, data) {
console.log('sendMail() called');
	var p = Promise.defer();

	var transporter = nodemailer.createTransport(directTransport());

	var mailOptions = {
			from: 'Fantasy Horse Daily <info@fantasyhorsedaily.com>',
			to: email,
			subject: subject,
			text: '',
			html: ''
		};

	if(template === 'apply') {
		mailOptions = {
			from: 'Grub2You <info@grub2you.com>',
			to: email,
			subject: subject,
			text: 'Thanks for applying for the role of '+data.position+', '+data.fName+'.  A Grub2You team member will contact you soon!',
			html: 'Thanks for applying for the role of <b>'+data.position+'</b>, '+data.fName+'.  A Grub2You team member will contact you soon!'
		};
	}

	if(template === 'placed') {
		mailOptions = {
			from: 'Grub2You <info@grub2you.com>',
			to: email,
			subject: subject,
			text: 'A new order has been placed!'
		};
	}

	if(template === 'order') {
		mailOptions = {
			from: 'Grub2You <info@grub2you.com>',
			to: email,
			subject: subject,
			text: 'Thanks for ordering with Grub2You!, '+data.fName+'.  A Grub2You team member will deliver your order very soon!',
			html: 'Thanks for ordering with <b>Grub2You</b>, '+data.fName+'.  A Grub2You team member will deliver your order very soon!'
		};
	}

	if(template === 'feedback') {
		mailOptions = {
			from: 'Grub2You <info@grub2you.com>',
			to: email,
			subject: subject,
			text: 'Feedback has been received: '+data,
			html: 'Feedback has been received. <a href="http://grub2you.com:3001/#/feedback/'+data+'">Click here to review the feedback</a>.'
		};
	}

	if(template === 'signup') {
		mailOptions = {
			from: 'Fantasy Horse Daily <info@fantasyhorsedaily.com>',
			to: email,
			subject: subject,
			text: (
				'Thanks for joining Fantasy Horse Daily, '+data.fName+'.  We\'re glad you found us!'
			),
			html: (
				'Thanks for joining <b>Fantasy Horse Daily</b>, '+data.fName+'.  We\'re glad you ' +
				'found us!'
			),
		};
	}

	if(template === 'update') {
		mailOptions = {
			from: 'Grub2You <info@grub2you.com>',
			to: email,
			subject: subject,
			text: 'Your order has been collected from the restaurant and is on the way!'
		};
	}

	if(template === 'failed') {
		mailOptions = {
			from: 'Tickets Tycoon <info@ticketstycoon.com>',
			to: email,
			subject: subject,
			text: 'Payment for the following order failed:  '+data
		};
	}

	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log('mailFail:');
			console.log(err);
			return p.reject(err);
		}

		console.log(template+' message sent');
		p.resolve(info);
	});

	return p.promise;
}

