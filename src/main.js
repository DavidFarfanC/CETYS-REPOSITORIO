import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './services/firebase';

const app = createApp(App);

app
  .use(router)
  .use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
  })
  .mount('#app');
