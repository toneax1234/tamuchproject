import Vue from 'vue'
import Vuex from 'vuex'
import * as moment from 'moment';

const baseURL = `http://localhost:3000/api`

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        raw_patient: [],
    },
    mutations: {

    },
    actions: {
      /*  async fetchpatientTypes({ state }) {

            const response = await fetch(`${baseURL}/patienttypes`)
            const patientTypes = await response.json()

            state.raw_resource_types = [{ id: 0, name: "Please Select Type" }].concat(patientTypes || [])

            return null;
        },*/

        async fetchpatient({ state }) {

            const response = await fetch(`${baseURL}/patients`)
            let patients = await response.json()

            state.raw_patient = patients || []

            console.log(state.raw_patient)

            return null;
        },
        async get({ state }, id) {

            const response = await fetch(`${baseURL}/patients/${id}`)
            let patient = await response.json()

            console.log(patient)

            return patient;
        },
        async create({ state }, new_patient) {


            const response = await fetch(`${baseURL}/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new_patient)
            })

            let newpatient = response.json()

            return newpatient
        },
        async delete({ state }, id) {

            const response = await fetch(`${baseURL}/patients/${id}`, {
                method: 'DELETE'
            })

            return Promise.resolve();
        },

        async update({ state }, { data }) {

            const response = await fetch(`${baseURL}/patients`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            let newpatient = response.json()
            
            return newpatient
        },
        async fetchUsers({ state }) {

            const response = await fetch(`${baseURL}/users`)
            let user = await response.json();
            let id;

            state.raw_user = user || []

            
            for(let i=0;i<user.length;i++){
                id = user[i].id
                const response2 = await fetch(`${baseURL}/is-user-enrolled/${id}`)
                let enrollStatus = await response2.json()
                user[i].enrollStatus =  enrollStatus
            }

           
            console.log(user)
            console.log(user.length)
            
            return null;
        },
        async fetchUser({ state } ) {

            let id = 'admin';
            const response = await fetch(`${baseURL}/users/${id}`)
            let user = await response.json()

            console.log(user)

            return user;
        },
        async checkEnrolledUser({ state } ) {

            let id = 'admin';

            const response2 = await fetch(`${baseURL}/is-user-enrolled/${id}`)
            let enrollStatus = await response2.json()

            console.log(enrollStatus)

            return enrollStatus;
        }

    }
})
