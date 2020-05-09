'use strict';
const { Contract, Context} = require('fabric-contract-api');
const shim = require('fabric-shim');
const Profile = require('./profile.js');
const ProfileStates = require('./profile.js').profileStates;
const EVENT_TYPE = "bcpocevent";


class ProfilechainContext extends Context {
    constructor() {
        super();
    }
}

class ProfileContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.chainnet.contract');
    }

    createContext() {
        return new ProfilechainContext();
    }

    async init(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the profilecontract contract');
        return shim.success(Buffer.from("init chaincode success"));
    }

    /*async queryPatient(ctx,patientId) {
   
    let dataAsBytes = await ctx.stub.getState(patientId); 
    if (!dataAsBytes || dataAsBytes.toString().length <= 0) {
      throw new Error('patient with this Id does not exist: ');
       }
      let data=JSON.parse(dataAsBytes.toString());
      
      return JSON.stringify(data);
     }*/

    async addPatient(ctx,args) {

       // let userType = await this.getCurrentUserType(ctx);
        console.log("addPatinet executed");

        const profile_details = JSON.parse(args);
        const profileId = profile_details.profileId;

        console.log("incoming asset fields: " + JSON.stringify(profile_details));
   
        let profile =  Profile.createInstance(profileId);
       // profile.profileId = profile_details.profileId;
        profile.age = profile_details.age.toString();
        //profile.price = profile_details.price.toString();
       // profile.quantity = profile_details.quantity.toString();
       // profile.producerId = profile_details.producerId;
       // profile.retailerId = profile_details.retailerId;
       // profile.modifiedBy = await this.getCurrentUserId(ctx);
        profile.currentProfileState = ProfileStates.PROFILE_CREATED;
      //  profile.trackingInfo = '';

        if(parseInt(profile.age) <= 0){
          return shim.error("Age can't be negative !!");
        }

        const event_obj = profile;
        event_obj.event_type = "createProfile";


        await ctx.stub.putState(profileId, profile.toBuffer());
        console.log('profile data added To the ledger Succesfully..');


        try {
            await ctx.stub.setEvent(EVENT_TYPE, event_obj.toBuffer());
        }
        catch (error) {
            console.log("Error in sending event");
        }
        finally {
            console.log("Attempted to send event = ", profile);
        }


        return profile.toBuffer();
    }

   async deleteatient(ctx,patientId) {
   

    if(patientId === null){
        return shim.error("Incorrect number of arguments. Expecting Id");
    }
    await ctx.stub.deleteState(patientId); 
    console.log('patient data deleted from the ledger Succesfully..');
    return shim.success(Buffer.from("success"));
    
    }

    async updatePatient(ctx,patientId,name,age,weight){
        if(patientId || name || age || weight === NULL){
            return shim.error("Incorrect number of arguments. Expecting Id, Name, Age , Weight");
        }
        
        await ctx.stub.putState(patientId,Buffer.from(JSON.stringify(patientData))); 
        console.log('patient data added To the ledger Succesfully..');

        return shim.success(Buffer.from("success"));
    }

    async queryAllPatients(ctx) {
        console.info('============= queryAllPatients ===========');

       // let userId = await this.getCurrentUserId(ctx);
       // let userType = await this.getCurrentUserType(ctx);

        //  For adding filters in query, usage: {"selector":{"producerId":"farm1"}}
        let queryString = {
            "selector": {}  //  no filter;  return all orders
        }

        // Access control done using query strings
       /* switch (userType) {

            case "admin":
            case "regulator": {
                queryString = {
                    "selector": {}  //  no filter;  return all orders
                }
                break;
            }
            case "producer": {
                queryString = {
                    "selector": {
                        "producerId": userId
                    }
                }
                break;
            }
            case "shipper": {
                queryString = {
                    "selector": {
                        "shipperId": userId
                    }
                }
                break;
            }
            case "retailer": {
                queryString = {
                    "selector": {
                        "retailerId": userId
                    }
                }
                break;
            }
            case "customer": {
                throw new Error(`${userId} does not have access to this transaction`);
            }
            default: {
                return [];
            }
        }*/

        console.log("In queryAllPatients: queryString = ");
        console.log(queryString);
        // Get all orders that meet queryString criteria
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const allPatients = [];

        // Iterate through them and build an array of JSON objects
        while (true) {
            const patient = await iterator.next();
            if (patient.value && patient.value.value.toString()) {
                console.log(patient.value.value.toString('utf8'));

                let Record;

                try {
                    Record = JSON.parse(patient.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = patient.value.value.toString('utf8');
                }

                // Add to array of patients
                allPatients.push(Record);
            }

            if (patient.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allPatients);
                return allPatients;
            }
        }
    }

    async deletePatient(ctx, profileId) {

        console.info('============= deletePatient ===========');
        if (profileId.length < 1) {
            throw new Error('Profile Id required as input')
        }
        console.log("profileId = " + profileId);

        // Retrieve the current profile using key provided
        var profileAsBytes = await ctx.stub.getState(profileId);

        if (!profileAsBytes || profileAsBytes.length === 0) {
            throw new Error(`Error Message from deletePatient: Patient with profileId = ${profileId} does not exist.`);
        }

        // Access Control: This transaction should only be invoked by designated originating Retailer or Producer
        var patient = Profile.deserialize(profileAsBytes);
       /* let userId = await this.getCurrentUserId(ctx);

        if ((userId != "admin") // admin only has access as a precaution.
            && (userId != patient.retailerId) // This transaction should only be invoked by Producer or Retailer of patient
            && (userId != patient.producerId))
            throw new Error(`${userId} does not have access to delete patient ${profileId}`);*/

        await ctx.stub.deleteState(profileId); //remove the patient from chaincode state
    }

   /* async getCurrentUserType(ctx) {

        let userid = await this.getCurrentUserId(ctx);

        //  check user id;  if admin, return type = admin;
        //  else return value set for attribute "type" in certificate;
        if (userid == "admin") {
            return userid;
        }
        return ctx.clientIdentity.getAttributeValue("usertype");
    }*/
}

module.exports= ProfileContract;