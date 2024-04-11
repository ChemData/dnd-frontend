import './assets/main.css'

import { createApp } from 'vue'
import Camping from './components/Camping.vue'
import Clock from './components/Clock.vue'
import EncounterGenerator from "./components/EncounterGenerator.vue";
import NPCGenerator from "./components/NPCGenerator.vue";
import HexMap from "./components/HexMap.vue"
import OrienteeringPage from "@/components/OrienteeringPage.vue";
import App from './components/Home.vue'
import {createWebHashHistory, createRouter} from "vue-router";
import '../assets/main.scss';

const routes = [
    {path: "/camping", component: Camping},
    {path: "/orienteering", component: OrienteeringPage},
    {path: "/clock", component: Clock},
    {path: "/encounter_gen", component: EncounterGenerator},
    {path: "/npc_gen", component: NPCGenerator},
    {path: "/hexmap", component: HexMap},
]

const router = createRouter({history: createWebHashHistory(), routes})

const app = createApp(App)
app.use(router)
app.mount("#app")
