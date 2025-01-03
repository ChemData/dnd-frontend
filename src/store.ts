import { reactive } from "vue";
import { HexGridView } from "../dataStructures";

export const view = reactive(defaultView(20));

function defaultView(side_length: number): HexGridView {
  return {
    offset_x: side_length,
    offset_y: (3 ** 0.5 / 2) * side_length,
    scale: side_length,
    show_terrain: true,
    show_coordinates: false,
    player_view: false,
    show_settlements: true,
    show_settlement_names: true,
    show_roads: true,
    show_rivers: true,
  };
}
