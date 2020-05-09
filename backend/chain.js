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
            console.log(contract);    
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

chainRouter.route('/test2').post(function (request, response) {
    console.log(JSON.stringify(request.body))
    response.status(STATUS_SUCCESS);
});

chainRouter.route('/test').get(function (request, response) {
    /*
    submitTx(request, 'addPatient', JSON.stringify(request.body))
        .then((result) => {
            // process response
            console.log('\nProcess orderProduct transaction.');
            let order = Order.fromBuffer(result);
            console.log(`order ${order.orderId} : price = ${order.price}, quantity = ${order.quantity}, producer = ${order.producerId}, consumer = ${order.retailerId}, trackingInfo = ${order.trackingInfo}, state = ${order.currentOrderState}`);
            response.status(STATUS_SUCCESS);
            response.send(order);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem placing the order."));
        });*/
    console.log('YEAHHHHHHHHHHHHHHHHHHHHHHHH')
    response.status(STATUS_SUCCESS);
});

chainRouter.route('/patients').post(function (request, response) {
    submitTx(request, 'addPatient', JSON.stringify(request.body))
        .then((result) => {
            // process response
            console.log('\nProcess addPatient transaction.');
            let profile = Profile.fromBuffer(result);
            console.log(`profile ${profile.profileId} : age = ${profile.price}, state = ${profile.currentProfileState}`);
           // let order = Order.fromBuffer(result);
           // console.log(`order ${order.orderId} : price = ${order.price}, quantity = ${order.quantity}, producer = ${order.producerId}, consumer = ${order.retailerId}, trackingInfo = ${order.trackingInfo}, state = ${order.currentOrderState}`);
            response.status(STATUS_SUCCESS);
            response.send(profile);
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
            console.log(patients);
            response.status(STATUS_SUCCESS);
            response.send(patients);
            
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem getting the list of patients."));
        });
});  //  process route orders/

chainRouter.route('/patients/:id').delete(function (request, response) {
    submitTx(request, 'deletePatient', request.params.id)
        .then((deletePatientResponse) => {
            // process response
            console.log('Process DeletePatient transaction.');
            console.log('Transaction complete.');
            response.status(STATUS_SUCCESS);
            response.send(deletePatientResponse);
        }, (error) => {
            response.status(STATUS_SERVER_ERROR);
            response.send(utils.prepareErrorResponse(error, STATUS_SERVER_ERROR,
                "There was a problem in deleting order, " + request.params.id));
        });
});

module.exports = chainRouter;