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

            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))
            

            const response = await fetch(`${baseURL}/patients`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
            })
            
            let patients = await response.json()



            state.raw_patient = patients || []

            console.log('fetch patient')

            return null;
        },
        async get({ state }, id) {
            
            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))

            const response = await fetch(`${baseURL}/patients/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
            })
            let patient = await response.json()

            console.log(patient)

            return patient;
        },
        async create({ state }, new_patient) {

            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))

          
            const response = await fetch(`${baseURL}/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
                body: JSON.stringify(new_patient)
            })

            let newpatient = response.json()

            return newpatient
        },
        async delete({ state }, id) {

            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))

            const response = await fetch(`${baseURL}/patients/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
            })

            return Promise.resolve();
        },

        async update({ state }, { data }) {

            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))

            const response = await fetch(`${baseURL}/patients`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
                body: JSON.stringify(data)
            })

            let newpatient = response.json()
            
            return newpatient
        },
        async fetchUsers({ state }) {

            let currentUser = await JSON.parse(localStorage.getItem('currentUser'))

            const response = await fetch(`${baseURL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
            })
            let user = await response.json();
            let id;

            state.raw_user = user || []
            
            for(let i=0;i<user.length;i++){
                id = user[i].id
                const response2 = await fetch(`${baseURL}/is-user-enrolled/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `${currentUser.userid}:${currentUser.password}`
                    },
                })
                let enrollStatus = await response2.json()
                user[i].enrollStatus =  enrollStatus
            }
            
            return null;
        },
        async fetchUser({ state } ) {

            let id = 'admin';
            const response = await fetch(`${baseURL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${currentUser.userid}:${currentUser.password}`
                },
            })
            let user = await response.json()

            console.log(user)

            return user;
        },
        async register({ state } , registerData) {

            console.log(registerData)

            const response = await fetch(`${baseURL}/register-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })


            return null;
        },
        async enroll({ state } , enrollData) {

            const response = await fetch(`${baseURL}/enroll-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enrollData)
            })

            return null;
        },
        async regisenroll({ state } , registerData) {

            

            const response = await fetch(`${baseURL}/register-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })

            const response2 = await fetch(`${baseURL}/enroll-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })
            
            return null;
        },
        async login({ state } , loginData) {

            let login;

            const response = await fetch(`${baseURL}/enroll-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `${loginData.userid}:${loginData.password}`
                },
                body: JSON.stringify(loginData)
            }).then((result) => {
                console.log(result.status);
                // process response
               if(result.status == 200){
                   login = true
                   return login;
               }else{
                   login = false
                   return login
               }
            }, (error) => {
                return null
            });

            return login;
        }
        

    }
})
