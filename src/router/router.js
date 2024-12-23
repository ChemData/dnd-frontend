import {createRouter, createWebHashHistory} from "vue-router"
import Camping from "@/views/CampingView.vue";
import OrienteeringPage from "@/views/OrienteeringView.vue";
import Clock from "@/views/ClockView.vue";
import EncounterGenerator from "@/views/EncounterGeneratorView.vue";
import NPCGenerator from "@/views/NPCGeneratorView.vue";
import HexMap from "@/components/HexMap/HexMap.vue";
import MapView from "@/views/MapView.vue";
import MobSetView from "@/views/MobSetView.vue";
import MobMetaSetView from "@/views/MobMetaSetView.vue";
import DungeonView from "@/views/DungeonView.vue";

const routes = [
    {path: "/camping", component: Camping},
    {path: "/orienteering", component: OrienteeringPage},
    {path: "/clock", component: Clock},
    {path: "/encounter-gen", component: EncounterGenerator},
    {path: "/npc-gen", component: NPCGenerator},
    {path: "/hexmap", component: HexMap},
    {path: "/test", component: MapView},
    {path: "/mob-set-designer", component: MobSetView},
    {path: "/mob-meta-set-designer", component: MobMetaSetView},
    {path: "/dungeon-maker", component: DungeonView}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})