import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Vue from 'vue';
import App from './App.vue';
import store from './store';

library.add(faStar, faPencilAlt, farStar);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
