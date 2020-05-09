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

            patients = patients.map(el => {
                
                el.timestamp = moment(el.timestamp || moment()).format('MM/DD/YYYY')

                return el;
            })

            state.raw_patient = patients || []

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
    }
})
