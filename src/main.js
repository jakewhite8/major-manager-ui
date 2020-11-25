import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

import App from './App.vue';
import router from './router';
import store from './store';
import titleComponent from './components/WebsiteTitle.vue';
import vSelect from 'vue-select';


library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faCog);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('vue-title', titleComponent);
Vue.component('v-select', vSelect);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
