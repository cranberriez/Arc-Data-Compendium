import { Workbench } from "@/types/items/workbench";
import { Egg, Swords, Shirt, Syringe, Bomb, Wrench as UtilWrench, Droplets } from "lucide-react";

export const workbenchesData: Workbench[] = [
	{
		id: "wb_scrappy",
		name: "Scrappy",
		type: "workbench",
		description: "The chicken brings you stuff!",
		icon: Egg,
		baseTier: 1,
		tiers: [
			{
				tier: 1,
				requiredItems: [],
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "dog_collar",
						count: 1,
					},
					{
						itemId: "torn_blanket",
						count: 1,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "lemon",
						count: 5,
					},
					{
						itemId: "apricot",
						count: 5,
					},
				],
			},
			{
				tier: 4,
				requiredItems: [
					{
						itemId: "prickly_pear",
						count: 8,
					},
					{
						itemId: "olives",
						count: 8,
					},
					{
						itemId: "cat_bed",
						count: 1,
					},
				],
			},
			{
				tier: 5,
				requiredItems: [
					{
						itemId: "apricot",
						count: 12,
					},
					{
						itemId: "mushroom",
						count: 12,
					},
					{
						itemId: "very_comfortable_pillow",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_basic",
		name: "Basic Workbench",
		type: "workbench",
		description: "A basic workbench with general purpose crafting",
		icon: Egg,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [],
				raidsRequired: 2,
			},
		],
	},
	{
		id: "wb_weapon",
		name: "Weapon Bench",
		type: "workbench",
		description: "Craft and upgrade weapons",
		icon: Swords,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "rubber_parts",
						count: 30,
					},
					{
						itemId: "metal_parts",
						count: 20,
					},
				],
				raidsRequired: 3,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "wasp_driver",
						count: 8,
					},
					{
						itemId: "rusted_tools",
						count: 3,
					},
					{
						itemId: "mechanical_components",
						count: 3,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "rusted_gear",
						count: 5,
					},
					{
						itemId: "advanced_mechanical_components",
						count: 3,
					},
					{
						itemId: "sentinel_core",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_equipment",
		name: "Equipment Bench",
		type: "workbench",
		description: "Craft and upgrade equipment",
		icon: Shirt,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "fabric",
						count: 40,
					},
					{
						itemId: "plastic_parts",
						count: 30,
					},
				],
				raidsRequired: 3,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "tick_pod",
						count: 8,
					},
					{
						itemId: "power_cables",
						count: 3,
					},
					{
						itemId: "electrical_components",
						count: 3,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "industrial_battery",
						count: 5,
					},
					{
						itemId: "advanced_electrical_components",
						count: 3,
					},
					{
						itemId: "rollbot_part",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_med_station",
		name: "Med Station",
		type: "workbench",
		description: "Craft medical supplies and upgrades",
		icon: Syringe,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "fabric",
						count: 50,
					},
					{
						itemId: "arc_alloys",
						count: 6,
					},
				],
				raidsRequired: 6,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "syringe",
						count: 8,
					},
					{
						itemId: "antiseptic",
						count: 5,
					},
					{
						itemId: "snitch_scanner",
						count: 3,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "antiseptic",
						count: 10,
					},
					{
						itemId: "rusted_shut_medical_kit",
						count: 5,
					},
					{
						itemId: "bastion_part",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_explosives",
		name: "Explosives Bench",
		type: "workbench",
		description: "Craft explosives and related items",
		icon: Bomb,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "rubber_parts",
						count: 50,
					},
					{
						itemId: "arc_alloys",
						count: 6,
					},
				],
				raidsRequired: 6,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "fireball_burner",
						count: 8,
					},
					{
						itemId: "synthesized_fuel",
						count: 5,
					},
					{
						itemId: "explosive_mixture",
						count: 5,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "explosive_mixture",
						count: 10,
					},
					{
						itemId: "laboratory_reagents",
						count: 5,
					},
					{
						itemId: "rocketeer_part",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_utility",
		name: "Utility Bench",
		type: "workbench",
		description: "Craft utility items and tools",
		icon: UtilWrench,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "plastic_parts",
						count: 50,
					},
					{
						itemId: "arc_alloys",
						count: 6,
					},
				],
				raidsRequired: 6,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "wires",
						count: 16,
					},
					{
						itemId: "hornet_driver",
						count: 6,
					},
					{
						itemId: "electrical_components",
						count: 3,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "fried_motherboard",
						count: 5,
					},
					{
						itemId: "advanced_electrical_components",
						count: 3,
					},
					{
						itemId: "bison_driver",
						count: 3,
					},
				],
			},
		],
	},
	{
		id: "wb_refiner",
		name: "Refiner",
		type: "workbench",
		description: "Refine and process materials",
		icon: Droplets,
		baseTier: 0,
		tiers: [
			{
				tier: 1,
				requiredItems: [
					{
						itemId: "metal_parts",
						count: 75,
					},
					{
						itemId: "arc_motion_core",
						count: 3,
					},
				],
				raidsRequired: 10,
			},
			{
				tier: 2,
				requiredItems: [
					{
						itemId: "fireball_burner",
						count: 10,
					},
					{
						itemId: "arc_circuitry",
						count: 8,
					},

					{
						itemId: "toaster",
						count: 3,
					},
				],
			},
			{
				tier: 3,
				requiredItems: [
					{
						itemId: "arc_motion_core",
						count: 20,
					},
					{
						itemId: "motor",
						count: 5,
					},
					{
						itemId: "queen_part",
						count: 1,
					},
				],
			},
		],
	},
];
