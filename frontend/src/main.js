import Vue from 'vue'
import AdminBar from './AdminBar.vue'
import DoctorBar from './DoctorBar.vue'
import UserBar from './UserBar.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false


let Bar;

let Storage = window.localStorage || 0;

let currentUser = {}

console.log(Storage)


currentUser = JSON.parse(localStorage.getItem('currentUser'))
if(currentUser != null){    
    if(currentUser.usertype == 'admin'){
        Bar = AdminBar;
    }else if(currentUser.usertype == 'doctor'){
        Bar = DoctorBar;
    }else{
        Bar = UserBar;
    }
}else{
    localStorage.setItem('currentUser', JSON.stringify({
        userid: '',
        password: '',
        usertype : ''
    }));
}




new Vue({
    router,
    store,
    vuetify,
    render: h => h(Bar),
    mounted() {
        
        console.log(currentUser)
        
        //this.$store.dispatch('fetchRawResourceTypes')
    }
}).$mount('#app')
