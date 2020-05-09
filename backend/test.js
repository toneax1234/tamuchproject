/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, User, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml')

// capture network variables from config.json
const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var appAdmin = config.appAdmin;
var appAdminSecret = config.appAdminSecret;
var userName = config.userName;
var orgMSPID = config.orgMSPID;
var caName = config.caName;
var gatewayDiscovery = config.gatewayDiscovery;
var wallet;
var bLocalHost;
var contract = null;
var network;
var gateway;

const EVENT_TYPE = "bcpocevent";  //  HLFabric EVENT

const SUCCESS = 0;
const utils = {};


const filePath = path.join(process.cwd(), './connection.yaml');
let fileContents = fs.readFileSync(filePath, 'utf8');
let connectionFile = yaml.safeLoad(fileContents);
//console.log(connectionFile)

//utils.connectGatewayFromConfig = async () => {
async function connectGateway() {
    console.log(">>>connectGatewayFromConfig:  ");

    // A gateway defines the peers used to access Fabric networks
    gateway = new Gateway();
    try {

        //console.log(caName)
        // Create a new CA client for interacting with the CA.
        const caURL = "http://0.0.0.0:7054"
       // console.log(caURL)
        const ca = new FabricCAServices(caURL);
       // console.log(caName)
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = new FileSystemWallet(walletPath);

        // Check to see if we've already enrolled the admin user.
        /*const adminExists = await wallet.exists(userName);
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }*/

        // Enroll the admin user, and import the new identity into the wallet.

       // const enrollment = await ca.enroll({ enrollmentID: appAdmin, enrollmentSecret: appAdminSecret });
       // const identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
       // wallet.import(userName, identity);
        console.log('msg: Successfully enrolled admin user ' + userName + ' and imported it into the wallet');


        //gateway connect
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionFile, { wallet: wallet, identity: userName, discovery: gatewayDiscovery });


        console.log('Use network channel: ' + config.channel_name);
        network = await gateway.getNetwork(config.channel_name);

        console.log('Use Contract : ' +config.smart_contract_name+  ' smart contract')
        contract = await network.getContract(config.smart_contract_name);

        
        const client = gateway.getClient();
        console.log('get client');

        var channel = client.getChannel(config.channel_name);
        console.log('get channel : ' + config.channel_name);

        
        var peers = channel.getChannelPeers();
        console.log('number of connected peers : ' + peers.length);

        if (peers.length == 0) {
            throw new Error("Error after call to channel.getChannelPeers(): Channel has no peers !");
        }

        console.log("Connecting to event hub..." + peers[0].getName());
        //  Assuming that we want to connect to the first peer in the peers list
        var channel_event_hub = channel.getChannelEventHub(peers[0].getName());
    
        // to see the event payload, use 'true' in the call to channel_event_hub.connect(boolean)
        channel_event_hub.connect(true);
    
        let event_monitor = new Promise((resolve, reject) => {
            /*  Sample usage of registerChaincodeEvent
            registerChaincodeEvent ('chaincodename', 'regularExpressionForEventName',
                   callbackfunction(...) => {...},
                   callbackFunctionForErrorHandling (...) => {...},
                   // options:
                   {startBlock:23, endBlock:30, unregister: true, disconnect: true}
            */
            var regid = channel_event_hub.registerChaincodeEvent(config.smart_contract_name, EVENT_TYPE,
                (event, block_num, txnid, status) => {
                    // This callback will be called when there is a chaincode event name
                    // within a block that will match on the second parameter in the registration
                    // from the chaincode with the ID of the first parameter.
    
                    //let event_payload = JSON.parse(event.payload.toString());
    
                    console.log("Event payload: " + event.payload.toString());
                    console.log("\n------------------------------------");
                }, (err) => {
                    // this is the callback if something goes wrong with the event registration or processing
                    reject(new Error('There was a problem with the eventhub in registerTxEvent ::' + err));
                },
                { disconnect: false } //continue to listen and not disconnect when complete
            );
        }, (err) => {
            console.log("At creation of event_monitor: Error:" + err.toString());
            throw (err);
        });
    
        console.log('YEAHHHHHHHHHHHHHHHHHHHH');
        Promise.all([event_monitor]);

    } catch (error) {
        console.error('Error connecting to Fabric network. ' + error.toString());
        process.exit(1);
    }
}

async function regist() {
    var userid = 'test'
    var userpwd = 'testpwd'
    var usertype = 'tester'
    var adminIdentity = 'admin'
    const caURL = "http://0.0.0.0:7054"

    console.log("\n------------  utils.registerUser ---------------");
    console.log("\n userid: " + userid + ", pwd: " + userpwd + ", usertype: " + usertype)

    const gateway = new Gateway();

    // Connect to gateway as admin
    const walletPath = path.join(process.cwd(), 'wallet');
    wallet = new FileSystemWallet(walletPath);

    await gateway.connect(connectionFile, { wallet : wallet, identity: adminIdentity, discovery: { enabled: false, asLocalhost: bLocalHost } });

   // const orgs = ccp.organizations;
   // const CAs = ccp.certificateAuthorities;
   // const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
   // const caURL = CAs[fabricCAKey].url;
    const ca = new FabricCAServices(caURL, { trustedRoots: [], verify: false });

    var newUserDetails = {
        enrollmentID: userid,
        enrollmentSecret: userpwd,
        role: "client",
        //affiliation: orgMSPID,
        //profile: 'tls',
        attrs: [
            {
                "name": "usertype",
                "value": usertype,
                "ecert": true
            }],
        maxEnrollments: 5
    };

    //  Register is done using admin signing authority
    return ca.register(newUserDetails, gateway.getCurrentIdentity())
        .then(newPwd => {
            //  if a password was set in 'enrollmentSecret' field of newUserDetails,
            //  the same password is returned by "register".
            //  if a password was not set in 'enrollmentSecret' field of newUserDetails,
            //  then a generated password is returned by "register".
            console.log('\n Secret returned: ' + newPwd);
            return newPwd;
        }, error => {
            console.log('Error in register();  ERROR returned: ' + error.toString());
            return Promise.reject(error);
        });
}

async function enrollUser() {

    var userid = 'test'
    var userpwd = 'testpwd'
    var usertype = 'tester'
    var adminIdentity = 'admin'
    const caURL = "http://0.0.0.0:7054"
    var orgMSPID = 'org1'

    console.log("\n------------  utils.enrollUser -----------------");
    console.log("userid: " + userid + ", pwd: " + userpwd + ", usertype:" + usertype);

    // get certificate authority
    const walletPath = path.join(process.cwd(), 'wallet');
    wallet = new FileSystemWallet(walletPath);

    const ca = new FabricCAServices(caURL, { trustedRoots: [], verify: false });

    var newUserDetails = {
        enrollmentID: userid,
        enrollmentSecret: userpwd,
        attrs: [
            {
                "name": "usertype", // application role
                "value": usertype,
                "ecert": true
            }]
    };

    return ca.enroll(newUserDetails).then(enrollment => {
        //console.log("\n Successful enrollment; Data returned by enroll", enrollment.certificate);
        var identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
        return wallet.import(userid, identity).then(notused => {
            return console.log('msg: Successfully enrolled user, ' + userid + ' and imported into the wallet');
        }, error => {
            console.log("error in wallet.import\n" + error.toString());
            throw error;
        });
    }, error => {
        console.log("Error in enrollment " + error.toString());
        throw error;
    });
}

connectGateway();