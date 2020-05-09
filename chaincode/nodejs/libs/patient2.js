'use strict';
const { Contract, Context} = require('fabric-contract-api');
const shim = require('fabric-shim');

class patients extends Contract {

   async queryPatient(ctx,patientId) {
   
    let dataAsBytes = await ctx.stub.getState(patientId); 
    if (!dataAsBytes || dataAsBytes.toString().length <= 0) {
      throw new Error('patient with this Id does not exist: ');
       }
      let data=JSON.parse(dataAsBytes.toString());
      
      return JSON.stringify(data);
     }

   async addPatient(ctx,patientId,name,age,weight) {
   
    let patientData={
       name:name,
       age:age,
       weight:weight
       };

    if(patientData.name <= 0){
        return shim.error("Incorrect number of arguments. Expecting Id, Name, Age , Weight");
    }

    if(patientData.age <= 0){
        return shim.error("Incorrect number of arguments. Expecting Id, Name, Age , Weight");
    }

    if(patientData.weight<= 0){
        return shim.error("Incorrect number of arguments. Expecting Id, Name, Age , Weight");
    }

    await ctx.stub.putState(patientId,Buffer.from(JSON.stringify(patientData))); 
    console.log('patient data added To the ledger Succesfully..');

    return shim.success(Buffer.from("success"));
    
  }

   async deletePatient(ctx,patientId) {
   

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
}

module.exports=patients;