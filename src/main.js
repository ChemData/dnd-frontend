import './assets/main.css'

import { createApp } from 'vue'
import Camping from './components/Camping.vue'
import Clock from './components/Clock.vue'
import EncounterGenerator from "./components/EncounterGenerator.vue";
import App from './components/Home.vue'
import {createWebHashHistory, createRouter} from "vue-router";

const routes = [
    {path: "/camping", component:Camping},
    {path: "/clock", component:Clock},
    {path: "/encounter_gen", component: EncounterGenerator}
]

const router = createRouter({history: createWebHashHistory(), routes})

const app = createApp(App)
app.use(router)
app.mount("#app")
