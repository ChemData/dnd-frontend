/*
Type Structure:

A StatBlock is an object which contains all the statistical details about a creature.

A Mobs consists of a StatBlock and a name. This is important because we want to be able to easily reuse an existing
StatBlock for a new monster (reskinning).

A MobSet consists an array of Mobs. These are generally thematically related Mobs that are used to assemble a group of
enemies for an encounter. E.g. goblin, hobgoblin, hobgoblin captain.

A MetaMobSet consists of a record of MobSets where the key is the name of the MobSet and the value is the relative
weight. This is used when deciding which MobSet to use for an encounter. The MetaMobSet of "forest" might lean heavily
toward bears, and wolves, with very few dinosaurs.
 */

import { z } from "zod";

const SizeSchema = z.enum(["tiny", "small", "medium", "large", "huge", "gargantuan"]);

const MonsterTypeSchema = z.enum([
  "aberration",
  "beast",
  "celestial",
  "construct",
  "dragon",
  "elemental",
  "fey",
  "fiend",
  "giant",
  "humanoid",
  "monstrosity",
  "ooze",
  "plant",
  "swarm",
  "undead",
]);

const ArmorSchema = z.object({
  amount: z.number(),
  type: z.string(),
});

const HitPointsSchema = z.object({
  average: z.number(),
  roll: z.string(),
});

const RollSchema = z.object({
  amount: z.number(),
  size: z.number(),
  fixed: z.number(),
});

const SpeedSchema = z.object({
  normal: z.number(),
  fly: z.number(),
  hover: z.number(),
  swim: z.number(),
  climb: z.number(),
  burrow: z.number(),
});

const AttributesSchema = z.object({
  str: z.number(),
  dex: z.number(),
  con: z.number(),
  int: z.number(),
  wis: z.number(),
  cha: z.number(),
});


const CRSchema = z.union([
  z.string().regex(/^[1-9]\d*$/), // Matches any positive integer
  z.enum(["0", "1/8", "1/4", "1/2"]),   // Matches the specific fractional values
]);

export type CR = z.infer<typeof CRSchema>;

const StatBlockSchema = z.object({
  name: z.string(),
  size: SizeSchema,
  type: MonsterTypeSchema,
  armor: ArmorSchema,
  hp: HitPointsSchema,
  speeds: SpeedSchema,
  cr: CRSchema,
  num_cr: z.number(),
  xp: z.number(),
});

export type StatBlock = z.infer<typeof StatBlockSchema>;

const MobSchema = z.object({
  reskin: z.string().optional(),
  statBlockId: z.string(),
});

export type MobType = z.infer<typeof MobSchema>;

export const StatBlocksSchema = z.record(StatBlockSchema);

export type StatBlocks = z.infer<typeof StatBlocksSchema>;

const MobSetSchema = z.object({
  name: z.string(),
  mobs: z.array(MobSchema),
  source: z.string(),
});

export type MobSet = z.infer<typeof MobSetSchema>;

export const MobSetsSchema = z.record(MobSetSchema);

const MetaMobSetSchema = z.object({
  name: z.string(),
  sets: z.record(z.string(), z.number()),
});

export type MetaMobSet = z.infer<typeof MetaMobSetSchema>;

export const MetaMobSetsSchema = z.record(MetaMobSetSchema);

export type MetaMobSets = z.infer<typeof MetaMobSetSchema>;
