'use strict';
const express = require('express');
const utils = require('./utils.js');
const chainRouter = express.Router();

const STATUS_SUCCESS = 200;
const STATUS_CLIENT_ERROR = 400;
const STATUS_SERVER_ERROR = 500;

//  USER Management Errors
const USER_NOT_ENROLLED = 1000;
const INVALID_HEADER = 1001;

const Profile = require('../chaincode/nodejs/libs/profile');


//  application specific errors
const SUCCESS = 0;
const ORDER_NOT_FOUND = 2000;

async function submitTx(request, txName, ...args) {
    try {
        //  check header; get username and pwd from request
        //  does NOT verify auth credentials
        //await getUsernamePassword(request);
        return utils.setUserContext('admin', 'adminpw').then((contract) => {
            // Insert txName as args[0]
            args.unshift(txName);   
            args.unshift(contract);
    
            // .apply applies the list entries as parameters to the called function
            return utils.submitTx.apply("unused", args)
                .then(buffer => {
                    return buffer;
                }, error => {
                    return Promise.reject(error);
                });
        }, error => {
            return Promise.reject(error);
        });
    }
    catch (error) {
        return Promise.reject(error);
    }
}


chainRouter.route('/patients').post(function (request, response) {
    submitTx(request, 'addPatient', JSON.stringify(request.body))
        .then((result) => {
            // process response
            console.log('\nProcess addPatient transaction.');
            let profile = Profile.fromBuffer(result);
            console.log(`profile ${profile.profileId} : age = ${profile.price}, state = ${profile.currentProfileState}`);
           // let order = Order.fromBuffer(result);
           // console.log(`order ${order.orderId} : price = ${order.price}, quantity = ${order.quantity}, producer = ${order.producerId}, consumer = ${order.retailerId}, trackingInfo = ${order.trackingInfo}, state = ${order.currentOrderState}`);
            
            response.send(profile).status(SUCCESS);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem placing the profile."));
        });
});




chainRouter.route('/patients').get(function (request, response) {
    submitTx(request, 'queryAllPatients', '')
        .then((queryPatientResponse) => {
            //  response is already a string;  not a buffer
            let patients = queryPatientResponse;
            response.send(patients).status(STATUS_SUCCESS);
            
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem getting the list of patients."));
        });
});  //  process route orders/

chainRouter.route('/patients').patch(function (request, response) {
    submitTx(request, 'updatePatient', JSON.stringify(request.body))
        .then((result) => {
            // process response
            console.log('\nProcess addPatient transaction.');
            let profile = Profile.fromBuffer(result);
            console.log(`profile ${profile.profileId} : age = ${profile.price}, state = ${profile.currentProfileState}`);
           // let order = Order.fromBuffer(result);
           // console.log(`order ${order.orderId} : price = ${order.price}, quantity = ${order.quantity}, producer = ${order.producerId}, consumer = ${order.retailerId}, trackingInfo = ${order.trackingInfo}, state = ${order.currentOrderState}`);
            
            response.send(profile).status(SUCCESS);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem placing the profile."));
        });
});



chainRouter.route('/patients/:id').get(function (request, response) {
    submitTx(request, 'queryPatient', request.params.id)
        .then((queryPatientResponse) => {
            // process response
            let profile = Profile.fromBuffer(queryPatientResponse);
            console.log(`profile ${profile.profileId} : age = ${profile.age}, state = ${profile.currentProfileState}`);
            response.send(profile).status(STATUS_SUCCESS);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, ORDER_NOT_FOUND,
                'Profile id, ' + request.params.id +
                ' does not exist or the user does not have access to profile details at this time.'));
        });
});

chainRouter.route('/patients/:id').delete(function (request, response) {
    submitTx(request, 'deletePatient', request.params.id)
        .then((deletePatientResponse) => {
            // process response
            console.log('Process DeletePatient transaction.');
            console.log('Transaction complete.');
            response.send(deletePatientResponse).status(STATUS_SUCCESS);;
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem in deleting order, " + request.params.id));
        });
});

module.exports = chainRouter;