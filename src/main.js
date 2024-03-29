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
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

import vSelect from 'vue-select';
import App from './App.vue';
import router from './router';
import store from './store';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faCog, faCheck, faTimes,
  faEye, faEyeSlash);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
