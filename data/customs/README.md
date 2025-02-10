## Customs Directory

This is the place where all the custom data is stored in text files


### Pokedex entry samples
The pokedex number should always be an negative number and above 999

To add a whole new pokemon 
```
"zerapium": {
		"num": -1000, // always negative and above 999
		"forme": "",
		"baseForme": "Alien",
		"baseSpecies": "Zerapium", // if this pokemon is a mega, dynamax or a regional form of an existing pokemon then add name of that existing pokemon otherwise leave blank
		"name": "Zerapium", // name
		"types": ["Ghost", "Dark"], // types, only 2
		"gender": "N", 
		"baseStats": { "hp": 100, "atk": 150, "def": 100, "spa": 150, "spd": 100, "spe": 150 },
		"abilities": { "0": "Levitate" },
		"heightm": 1.5,
		"weightkg": 61,
		"color": "White",
		"eggGroups": ["Undiscovered"],
		"gen": 5,
	},
```

To add a normal evolution to an existing pokemon
```
"zerapium": {
		"num": -1000, // always negative and above 999; 
		"forme": "",
		"baseForme": "Alien",
		"baseSpecies": "Zerapium", // if this pokemon is a mega, dynamax or a regional form of an existing pokemon then add name of that existing pokemon otherwise leave blank
		"name": "Zerapium", // name
		"types": ["Ghost", "Dark"], // types, only 2
		"gender": "N", 
		"baseStats": { "hp": 100, "atk": 150, "def": 100, "spa": 150, "spd": 100, "spe": 150 },
		"abilities": { "0": "Levitate" },
		"heightm": 1.5,
		"weightkg": 61,
		"color": "White",
		"eggGroups": ["Undiscovered"],
		"gen": 5,
		"prevo": "Shuckle", // prevolution name
		"evoType": "trade" // in what way a pokemon evolve into this pokemon
	},
```

To add a mega evolution 
```
"lucariomegax": {
		"num": -1000, // always negative and above 999
		"forme": "",
		"baseForme": "Alien",
		"baseSpecies": "Zerapium", // if this pokemon is a mega, dynamax or a regional form of an existing pokemon then add name of that existing pokemon otherwise leave blank
		"name": "Zerapium", // name
		"types": ["Ghost", "Dark"], // types, only 2
		"gender": "N", 
		"baseStats": { "hp": 100, "atk": 150, "def": 100, "spa": 150, "spd": 100, "spe": 150 },
		"abilities": { "0": "Levitate" },
		"heightm": 1.5,
		"weightkg": 61,
		"color": "White",
		"eggGroups": ["Undiscovered"],
		"gen": 5,
		"prevo": "Shuckle", // prevolution name
		"evoType": "trade" // in what way a pokemon evolve into this pokemon
	},
```

#### A sample items entry
To add mega stones
```	
abomasite: {
		name: "Abomasite",
		spritenum: 575,
		megaStone: "Abomasnow-Mega",
		megaEvolves: "Abomasnow",
		itemUser: ["Abomasnow"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 674,
		gen: 6,
		isNonstandard: "Past",
	},
```