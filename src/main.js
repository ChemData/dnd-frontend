import './assets/main.css'

import { createApp } from 'vue'
import App from './views/HomeView.vue'
import '../assets/main.scss';
import {createPinia} from "pinia";
import {router} from "@/router/router";


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount("#app")
