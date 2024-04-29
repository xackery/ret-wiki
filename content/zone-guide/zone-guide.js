let areWizardPortsEnabled = true;
let areDruidPortsEnabled = true;
let areGuildLobbyPortsEnabled = true;
let isGuildLobbyAAEnabled = true;
let currentExpansion = 19;

class World {
  constructor() {
    this.adjacencyList = {};
    this.fullNames = {};
    this.notes = {};
  }

  addZone(shortName, fullName, minExpansion = -1, maxExpansion = -1) {
    if (minExpansion != -1 && minExpansion >= currentExpansion) {
      return;
    }
    if (maxExpansion != -1 && maxExpansion < currentExpansion) {
      return;
    }
    if (!this.adjacencyList[shortName]) {
      this.adjacencyList[shortName] = [];
      this.fullNames[shortName] = fullName;
    }
  }

  addZoneLine(source, destination, weight, note = '') {
    let src = this.adjacencyList[source];
    if (!src) {
      console.log('source not found', source);
      return;
    }
    this.adjacencyList[source].push({ node: destination, weight, note });
    let notes = this.notes[source + destination];
    if (notes == undefined) {
      this.notes[source + destination] = note;
    }
  }

  addBiZoneLine(source, destination, weight = 1, note = '') {
    let src = this.adjacencyList[source];
    if (!src) {
      console.log('source not found', source);
      return;
    }
    let dest = this.adjacencyList[destination];
    if (!dest) {
      console.log('destination not found', destination);
      return;
    }
    this.adjacencyList[source].push({ node: destination, weight, note });
    this.adjacencyList[destination].push({ node: source, weight, note });
    this.notes[source + destination] = note;
    this.notes[destination + source] = note;
  }

  findShortestPath(start, end) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let shortestPath = []; // Stores the shortest path
    let smallest;

    // Initial state setup
    for (let node in this.adjacencyList) {
      if (node === start) {
        distances[node] = 0;
        nodes.enqueue(node, 0);
      } else {
        distances[node] = Infinity;
        nodes.enqueue(node, Infinity);
      }
      previous[node] = null;
    }

    // Main algorithm loop
    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue().val;

      if (smallest === end) {
        // We have reached the destination
        // Construct the path by backtracking from the end
        while (previous[smallest]) {
          shortestPath.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }

      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          let nextNode = this.adjacencyList[smallest][neighbor];

          let note = this.notes[smallest + nextNode.node];
          if (note == 'use wizard port to' && !areWizardPortsEnabled) {
            continue;
          }

          if (note == 'use druid port to' && !areDruidPortsEnabled) {
            continue;
          }

          if (note.includes('stone to zone') && !areGuildLobbyPortsEnabled) {
            continue;
          }

          if (note == 'use lobby AA to' && !isGuildLobbyAAEnabled) {
            continue;
          }



          // Calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            // Updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            // Updating previous - How we got to next neighbor
            previous[nextNeighbor] = smallest;
            // Enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }

    return shortestPath.concat(smallest).reverse();
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  isEmpty() {
    return this.values.length === 0;
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

const w = new World();
w.addZone("qeynos", "South Qeynos", 0); // Classic
w.addZone("qeynos2", "North Qeynos", 0); // Classic
w.addZone("qrg", "Surefall Glade", 0); // Classic
w.addZone("qeytoqrg", "Qeynos Hills", 0); // Classic
w.addZone("highkeep", "HighKeep", 0); // Classic
w.addZone("freportn", "North Freeport", 0); // Classic
w.addZone("freportw", "West Freeport", 0); // Classic
w.addZone("freporte", "East Freeport", 0); // Classic
w.addZone("runnyeye", "Clan RunnyEye", 0); // Classic
w.addZone("qey2hh1", "West Karana", 0); // Classic
w.addZone("northkarana", "North Karana", 0); // Classic
w.addZone("southkarana", "South Karana", 0); // Classic
w.addZone("eastkarana", "East Karana", 0); // Classic
w.addZone("beholder", "Gorge of King Xorbb", 0); // Classic
w.addZone("blackburrow", "BlackBurrow", 0); // Classic
w.addZone("paw", "Infected Paw", 0); // Classic
w.addZone("rivervale", "Rivervale", 0); // Classic
w.addZone("kithicor", "Kithicor Forest (A), 0"); // Classic
w.addZone("commons", "West Commonlands", 0); // Classic
w.addZone("ecommons", "East Commonlands", 0); // Classic
w.addZone("erudnint", "Erudin Palace", 0); // Classic
w.addZone("erudnext", "Erudin", 0); // Classic
w.addZone("nektulos", "Nektulos Forest", 0); // Classic
w.addZone("cshome", "Sunset Home", 0); // Classic
w.addZone("lavastorm", "Lavastorm Mountains", 0); // Classic
w.addZone("nektropos", "Nektropos", 0); // Classic
w.addZone("halas", "Halas", 0); // Classic
w.addZone("everfrost", "Everfrost Peaks", 0); // Classic
w.addZone("soldunga", "Solusek's Eye", 0); // Classic
w.addZone("soldungb", "Nagafen's Lair", 0); // Classic
w.addZone("misty", "Misty Thicket", 0); // Classic
w.addZone("nro", "North Ro", 0); // Classic
w.addZone("sro",  "South Ro", 0); // Classic
w.addZone("befallen", "Befallen", 0); // Classic
w.addZone("oasis", "Oasis of Marr", 0); // Classic
w.addZone("tox", "Toxxulia Forest", 0); // Classic
w.addZone("hole", "The Ruins of Old Paineel", 0); // Classic
w.addZone("neriaka", "Neriak Foreign Quarter", 0); // Classic
w.addZone("neriakb", "Neriak Commons", 0); // Classic
w.addZone("neriakc", "Neriak Third Gate", 0); // Classic
w.addZone("neriakd", "Neriak Palace", 0); // Classic
w.addZone("najena", "Najena", 0); // Classic
w.addZone("qcat", "Qeynos Catacombs", 0); // Classic
w.addZone("innothule", "Innothule Swamp", 0); // Classic
w.addZone("feerrott", "The Feerrott", 0); // Classic
w.addZone("cazicthule", "Cazic-Thule", 0); // Classic
w.addZone("oggok", "Oggok", 0); // Classic
w.addZone("rathemtn", "Mountains of Rathe", 0); // Classic
w.addZone("lakerathe", "Lake Rathetear", 0); // Classic
w.addZone("grobb", "Grobb", 0); // Classic
w.addZone("aviak", "Aviak Village", 0); // Classic
w.addZone("gfaydark", "The Greater Faydark", 0); // Classic
w.addZone("akanon", "Ak'Anon", 0); // Classic
w.addZone("steamfont", "Steamfont Mountains", 0); // Classic
w.addZone("lfaydark", "The Lesser Faydark", 0); // Classic
w.addZone("crushbone", "Clan Crushbone", 0); // Classic
w.addZone("mistmoore", "Castle Mistmoore", 0); // Classic
w.addZone("kaladima", "North Kaladim", 0); // Classic
w.addZone("felwithea", "Felwithe", 0); // Classic
w.addZone("felwitheb", "FelwitheB", 0); // Classic
w.addZone("unrest", "Estate of Unrest", 0); // Classic
w.addZone("kedge", "Kedge Keep", 0); // Classic
w.addZone("guktop", "Upper Guk", 0); // Classic
w.addZone("gukbottom", "Lower Guk", 0); // Classic
w.addZone("kaladimb", "South Kaladim", 0); // Classic
w.addZone("butcher", "Butcherblock Mountains", 0); // Classic
w.addZone("oot", "Ocean of Tears", 0); // Classic
w.addZone("cauldron", "Dagnor's Cauldron", 0); // Classic
w.addZone("airplane", "Plane of Sky", 0); // Classic
w.addZone("fearplane", "Plane of Fear", 0); // Classic
w.addZone("permafrost", "Permafrost Keep", 0); // Classic
w.addZone("kerraridge", "Kerra Isle", 0); // Classic
w.addZone("paineel", "Paineel", 0); // Classic
//w.addZone("hateplane", "The Plane of Hate", 0); // Classic
w.addZone("arena", "The Arena", 0); // Classic
w.addZone("soltemple", "Temple of Solusek Ro", 0); // Classic
w.addZone("erudsxing", "Erud's Crossing", 0); // Classic
w.addZone("stonebrunt", "Stonebrunt Mountains", 0); // Classic
w.addZone("warrens", "The Warrens", 0); // Classic
w.addZone("erudsxing2", "Marauder's Mire", 0); // Classic
w.addZone("bazaar", "The Bazaar", 0); // Classic
//w.addZone("bazaar2", "The Bazaar (2), 0"); // Classic
//w.addZone("arena2", "The Arena", 0); // Classic
w.addZone("jaggedpine", "The Jaggedpine Forest", 0); // Classic
w.addZone("nedaria", "Nedaria's Landing", 0); // Classic
//w.addZone("tutorial", "Tutorial Zone", 0); // Classic
//w.addZone("load", "Loading (A), 0"); // Classic
//w.addZone("load2", "Loading (B), 0"); // Classic
w.addZone("hateplaneb", "The Plane of Hate", 0); // Classic
w.addZone("shadowrest", "Shadowrest", 0); // Classic
//w.addZone("clz", "Loading (C), 0"); // Classic
w.addZone("soldungc", "The Caverns of Exile", 0); // Classic
//w.addZone("barter", "The Barter Hall", 0); // Classic
//w.addZone("takishruins", "Ruins of Takish-Hiz", 0); // Classic
//w.addZone("freeporteast", "East Freeport", 11); // PoR
//w.addZone("freeportwest", "West Freeport", 11); // PoR
//w.addZone("freeportsewers", "Freeport Sewers", 11); // PoR
//w.addZone("northro", "North Ro (B), 11"); // PoR
//w.addZone("southro", "South Ro (B), 11"); // PoR
w.addZone("highpasshold", "Highpass Hold", 11); // PoR
w.addZone("steamfontmts", "Steamfont Mountains", 0); // Classic
w.addZone("dragonscalea", "Tinmizer's Wunderwerks", 0); // Classic
w.addZone("crafthalls", "Ngreth's Den", 0); // Classic
w.addZone("weddingchapel", "Wedding Chapel", 0); // Classic
w.addZone("weddingchapeldark", "Wedding Chapel", 0); // Classic
w.addZone("dragoncrypt", "Lair of the Fallen", 0); // Classic
w.addZone("arttest", "Art Testing Domain", 0); // Classic
w.addZone("fhalls", "The Forgotten Halls", 0); // Classic
w.addZone("apprentice", "Designer Apprentice", 0); // Classic

w.addZone("fieldofbone", "The Field of Bone", 1); // Kunark
w.addZone("warslikswood", "Warsliks Wood", 1); // Kunark
w.addZone("droga", "Temple of Droga", 1); // Kunark
w.addZone("cabwest", "West Cabilis", 1); // Kunark
w.addZone("swampofnohope", "Swamp of No Hope", 1); // Kunark
w.addZone("firiona", "Firiona Vie", 1); // Kunark
w.addZone("lakeofillomen", "Lake of Ill Omen", 1); // Kunark
w.addZone("dreadlands", "Dreadlands", 1); // Kunark
w.addZone("burningwood", "Burning Woods", 1); // Kunark
w.addZone("kaesora", "Kaesora", 1); // Kunark
w.addZone("sebilis", "Old Sebilis", 1); // Kunark
w.addZone("citymist", "City of Mist", 1); // Kunark
w.addZone("skyfire", "Skyfire Mountains", 1); // Kunark
w.addZone("frontiermtns", "Frontier Mountains", 1); // Kunark
w.addZone("overthere", "The Overthere", 1); // Kunark
w.addZone("emeraldjungle", "The Emerald Jungle", 1); // Kunark
w.addZone("trakanon", "Trakanon's Teeth", 1); // Kunark
w.addZone("timorous", "Timorous Deep", 1); // Kunark
w.addZone("kurn", "Kurn's Tower", 1); // Kunark
w.addZone("karnor", "Karnor's Castle", 1); // Kunark
w.addZone("chardok", "Chardok", 1); // Kunark
w.addZone("dalnir", "Dalnir", 1); // Kunark
w.addZone("charasis", "Howling Stones", 1); // Kunark
w.addZone("cabeast", "East Cabilis", 1); // Kunark
w.addZone("nurga", "Mines of Nurga", 1); // Kunark
w.addZone("veeshan", "Veeshan's Peak", 1); // Kunark
w.addZone("veksar", "Veksar", 1); // Kunark
w.addZone("chardokb", "The Halls of Betrayal", 1); // Kunark
w.addZone("iceclad", "Iceclad Ocean", 2); // Scars of Velious
w.addZone("frozenshadow", "Tower of Frozen Shadow", 2); // Scars of Velious
w.addZone("velketor", "Velketor's Labyrinth", 2); // Scars of Velious
w.addZone("kael", "Kael Drakkal", 2); // Scars of Velious
w.addZone("skyshrine", "Skyshrine", 2); // Scars of Velious
w.addZone("thurgadina", "Thurgadin", 2); // Scars of Velious
w.addZone("eastwastes", "Eastern Wastes", 2); // Scars of Velious
w.addZone("cobaltscar", "Cobalt Scar", 2); // Scars of Velious
w.addZone("greatdivide", "Great Divide", 2); // Scars of Velious
w.addZone("wakening", "The Wakening Land", 2); // Scars of Velious
w.addZone("westwastes", "Western Wastes", 2); // Scars of Velious
w.addZone("crystal", "Crystal Caverns", 2); // Scars of Velious
w.addZone("necropolis", "Dragon Necropolis", 2); // Scars of Velious
w.addZone("templeveeshan", "Temple of Veeshan", 2); // Scars of Velious
w.addZone("sirens", "Siren's Grotto", 2); // Scars of Velious
w.addZone("mischiefplane", "Plane of Mischief", 2); // Scars of Velious
w.addZone("growthplane", "Plane of Growth", 2); // Scars of Velious
w.addZone("sleeper", "Sleeper's Tomb", 2); // Scars of Velious
w.addZone("thurgadinb", "Icewell Keep", 2); // Scars of Velious
w.addZone("shadowhaven", "Shadow Haven", 3); // Luclin
w.addZone("nexus", "The Nexus", 3); // Luclin
w.addZone("echo", "Echo Caverns", 3); // Luclin
w.addZone("acrylia", "Acrylia Caverns", 3); // Luclin
w.addZone("sharvahl", "Shar Vahl", 3); // Luclin
w.addZone("paludal", "Paludal Caverns", 3); // Luclin
w.addZone("fungusgrove", "Fungus Grove", 3); // Luclin
w.addZone("vexthal", "Vex Thal", 3); // Luclin
w.addZone("sseru", "Sanctus Seru", 3); // Luclin
w.addZone("katta", "Katta Castellum", 3); // Luclin
w.addZone("netherbian", "Netherbian Lair", 3); // Luclin
w.addZone("ssratemple", "Ssraeshza Temple", 3); // Luclin
w.addZone("griegsend", "Grieg's End", 3); // Luclin
w.addZone("thedeep", "The Deep", 3); // Luclin
w.addZone("shadeweaver", "Shadeweaver's Thicket", 3); // Luclin
w.addZone("hollowshade", "Hollowshade Moor", 3); // Luclin
w.addZone("grimling", "Grimling Forest", 3); // Luclin
w.addZone("mseru", "Marus Seru", 3); // Luclin
w.addZone("letalis", "Mons Letalis", 3); // Luclin
w.addZone("twilight", "The Twilight Sea", 3); // Luclin
w.addZone("thegrey", "The Grey", 3); // Luclin
w.addZone("tenebrous", "The Tenebrous Mountains", 3); // Luclin
w.addZone("maiden", "The Maiden's Eye", 3); // Luclin
w.addZone("dawnshroud", "Dawnshroud Peaks", 3); // Luclin
w.addZone("scarlet", "The Scarlet Desert", 3); // Luclin
w.addZone("umbral", "The Umbral Plains", 3); // Luclin
w.addZone("akheva", "Akheva Ruins", 3); // Luclin
w.addZone("poknowledge", "Plane of Knowledge", 4); // Planes of Power
w.addZone("codecay", "Ruins of Lxanvom", 4); // Planes of Power
w.addZone("pojustice", "Plane of Justice", 4); // Planes of Power
w.addZone("potranquility", "Plane of Tranquility", 4); // Planes of Power
w.addZone("ponightmare", "Plane of Nightmare", 4); // Planes of Power
w.addZone("podisease", "Plane of Disease", 4); // Planes of Power
w.addZone("poinnovation", "Plane of Innovation", 4); // Planes of Power
w.addZone("potorment", "Plane of Torment", 4); // Planes of Power
w.addZone("povalor", "Plane of Valor", 4); // Planes of Power
w.addZone("bothunder", "Torden, The Bastion of Thunder", 4); // Planes of Power
w.addZone("postorms", "Plane of Storms", 4); // Planes of Power
w.addZone("hohonora", "Halls of Honor", 4); // Planes of Power
w.addZone("solrotower", "Solusek Ro's Tower", 4); // Planes of Power
w.addZone("powar", "Plane of War", 4); // Planes of Power
w.addZone("potactics", "Drunder, Fortress of Zek", 4); // Planes of Power
w.addZone("poair", "Eryslai, the Kingdom of Wind", 4); // Planes of Power
w.addZone("powater", "Reef of Coirnav", 4); // Planes of Power
w.addZone("pofire", "Doomfire, The Burning Lands", 4); // Planes of Power
w.addZone("poeartha", "Vegarlson, The Earthen Badlands", 4); // Planes of Power
w.addZone("potimea", "Plane of Time (A), 4"); // Planes of Power
w.addZone("hohonorb", "Temple of Marr (A), 4"); // Planes of Power
w.addZone("nightmareb", "Lair of Terris Thule", 4); // Planes of Power
w.addZone("poearthb", "Stronghold of the Twelve", 4); // Planes of Power
w.addZone("potimeb", "Plane of Time (B), 4"); // Planes of Power
w.addZone("guildlobby", "The Guild Lobby", 4); // Planes of Power
w.addZone("gunthak", "Gulf of Gunthak", 5); // LoY
w.addZone("dulak", "Dulak's Harbor", 5); // LoY
w.addZone("torgiran", "Torgiran Mines", 5); // LoY
w.addZone("nadox", "Crypt of Nadox", 5); // LoY
w.addZone("hatesfury", "Hate's Fury, The Scorned Maiden", 5); // LoY
w.addZone("guka", "The Cauldron of Lost Souls", 6); // LDoN
w.addZone("ruja", "The Bloodied Quarries", 6); // LDoN
w.addZone("taka", "The Sunken Library", 6); // LDoN
w.addZone("mira", "The Silent Gallery", 6); // LDoN
w.addZone("mmca", "The Forlorn Caverns", 6); // LDoN
w.addZone("gukb", "The Drowning Crypt", 6); // LDoN
w.addZone("rujb", "The Halls of War", 6); // LDoN
w.addZone("takb", "The Shifting Tower", 6); // LDoN
w.addZone("mirb", "The Maw of the Menagerie", 6); // LDoN
w.addZone("mmcb", "The Dreary Grotto", 6); // LDoN
w.addZone("gukc", "The Ancient Aqueducts", 6); // LDoN
w.addZone("rujc", "The Wind Bridges", 6); // LDoN
w.addZone("takc", "The Fading Temple", 6); // LDoN
w.addZone("mirc", "The Spider Den", 6); // LDoN
w.addZone("mmcc", "The Asylum of Invoked Stone", 6); // LDoN
w.addZone("gukd", "The Mushroom Grove", 6); // LDoN
w.addZone("rujd", "The Gladiator Pits", 6); // LDoN
w.addZone("takd", "The Royal Observatory", 6); // LDoN
w.addZone("mird", "The Hushed Banquet", 6); // LDoN
w.addZone("mmcd", "The Chambers of Eternal Affliction", 6); // LDoN
w.addZone("guke", "The Foreboding Prison", 6); // LDoN
w.addZone("ruje", "The Drudge Hollows", 6); // LDoN
w.addZone("take", "The River of Recollection", 6); // LDoN
w.addZone("mire", "The Frosted Halls", 6); // LDoN
w.addZone("mmce", "The Sepulcher of the Damned", 6); // LDoN
w.addZone("gukf", "The Chapel of the Witnesses", 6); // LDoN
w.addZone("rujf", "The Fortified Lair of the Taskmasters", 6); // LDoN
w.addZone("takf", "The Sandfall Corridors", 6); // LDoN
w.addZone("mirf", "The Forgotten Wastes", 6); // LDoN
w.addZone("mmcf", "The Ritualistic Summoning Grounds", 6); // LDoN
w.addZone("gukg", "The Root Garden", 6); // LDoN
w.addZone("rujg", "The Hidden Vale", 6); // LDoN
w.addZone("takg", "The Balancing Chamber", 6); // LDoN
w.addZone("mirg", "The Heart of the Menagerie", 6); // LDoN
w.addZone("mmcg", "The Cesspits of Putrescence", 6); // LDoN
w.addZone("gukh", "The Accursed Sanctuary", 6); // LDoN
w.addZone("rujh", "The Blazing Forge", 6); // LDoN
w.addZone("takh", "The Sweeping Tides", 6); // LDoN
w.addZone("mirh", "The Morbid Laboratory", 6); // LDoN
w.addZone("mmch", "The Aisles of Blood", 6); // LDoN
w.addZone("ruji", "The Arena of Chance", 6); // LDoN
w.addZone("taki", "The Antiquated Palace", 6); // LDoN
w.addZone("miri", "The Theater of Imprisoned Horrors", 6); // LDoN
w.addZone("mmci", "The Halls of Sanguinary Rites", 6); // LDoN
w.addZone("rujj", "The Barracks of War", 6); // LDoN
w.addZone("takj", "The Prismatic Corridors", 6); // LDoN
w.addZone("mirj", "The Grand Library", 6); // LDoN
w.addZone("mmcj", "The Infernal Sanctuary", 6); // LDoN
w.addZone("abysmal", "Abysmal Sea", 7); // GoD
w.addZone("natimbi", "Natimbi, The Broken Shores", 7); // GoD
w.addZone("qinimi", "Qinimi, Court of Nihilia", 7); // GoD
w.addZone("riwwi", "Riwwi, Coliseum of Games", 7); // GoD
w.addZone("barindu", "Barindu, Hanging Gardens", 7); // GoD
w.addZone("ferubi", "Ferubi, Forgotten Temple of Taelosia", 7); // GoD
w.addZone("snpool", "Sewers of Nihilia, Pool of Sludge", 7); // GoD
w.addZone("snlair", "Sewers of Nihilia, Lair of Trapped Ones", 7); // GoD
w.addZone("snplant", "Sewers of Nihilia, Purifying Plant", 7); // GoD
w.addZone("sncrematory", "Sewers of Nihilia, the Crematory", 7); // GoD
w.addZone("tipt", "Tipt, Treacherous Crags", 7); // GoD
w.addZone("vxed", "Vxed, The Crumbling Caverns", 7); // GoD
w.addZone("yxtta", "Yxtta, Pulpit of Exiles", 7); // GoD
w.addZone("uqua", "Uqua, The Ocean God Chantry", 7); // GoD
w.addZone("kodtaz", "Kod'Taz, Broken Trial Grounds", 7); // GoD
w.addZone("ikkinz", "Ikkinz, Chambers of Destruction", 7); // GoD
w.addZone("qvic", "Qvic, Prayer Grounds of Calling", 7); // GoD
w.addZone("inktuta", "Inktu`Ta, The Unmasked Chapel", 7); // GoD
w.addZone("txevu", "Txevu, Lair of the Elite", 7); // GoD
w.addZone("tacvi", "Tacvi, Seat of the Slaver", 7); // GoD
w.addZone("qvibc", "Qvic, the Hidden Vault", 7); // GoD
w.addZone("wallofslaughter", "Wall of Slaughter", 8); // OoW
w.addZone("bloodfields", "The Bloodfields", 8); // OoW
w.addZone("draniksscar", "Dranik's Scar", 8); // OoW
w.addZone("causeway", "Nobles' Causeway", 8); // OoW
w.addZone("chambersa", "Muramite Proving Grounds (A)", 8); // OoW
w.addZone("chambersb", "Muramite Proving Grounds (B)", 8); // OoW
w.addZone("chambersc", "Muramite Proving Grounds (C)", 8); // OoW
w.addZone("chambersd", "Muramite Proving Grounds (D)", 8); // OoW
w.addZone("chamberse", "Muramite Proving Grounds (E)", 8); // OoW
w.addZone("chambersf", "Muramite Proving Grounds (F)", 8); // OoW
w.addZone("provinggrounds", "Muramite Proving Grounds", 8); // OoW
w.addZone("anguish", "Asylum of Anguish", 8); // OoW
w.addZone("dranikhollowsa", "Dranik's Hollows (A)", 8); // OoW
w.addZone("dranikhollowsb", "Dranik's Hollows (B)", 8); // OoW
w.addZone("dranikhollowsc", "Dranik's Hollows (C)", 8); // OoW
w.addZone("dranikhollowsd", "Dranik's Hollows (D)", 8); // OoW
w.addZone("dranikhollowse", "Dranik's Hollows (E)", 8); // OoW
w.addZone("dranikhollowsf", "Dranik's Hollows (F)", 8); // OoW
w.addZone("dranikhollowsg", "Dranik's Hollows (G)", 8); // OoW
w.addZone("dranikhollowsh", "Dranik's Hollows (H)", 8); // OoW
w.addZone("dranikhollowsi", "Dranik's Hollows (I)", 8); // OoW
w.addZone("dranikhollowsj", "Dranik's Hollows (J)", 8); // OoW
w.addZone("dranikcatacombsa", "Catacombs of Dranik (A)", 8); // OoW
w.addZone("dranikcatacombsb", "Catacombs of Dranik (B)", 8); // OoW
w.addZone("dranikcatacombsc", "Catacombs of Dranik (C)", 8); // OoW
w.addZone("draniksewersa", "Sewers of Dranik (A)", 8); // OoW
w.addZone("draniksewersb", "Sewers of Dranik (B)", 8); // OoW
w.addZone("draniksewersc", "Sewers of Dranik (C)", 8); // OoW
w.addZone("riftseekers", "Riftseekers' Sanctum", 8); // OoW
w.addZone("harbingers", "Harbingers' Spire", 8); // OoW
w.addZone("dranik", "The Ruined City of Dranik", 8); // OoW
w.addZone("broodlands", "The Broodlands", 9); // DoN
w.addZone("stillmoona", "Stillmoon Temple", 9); // DoN
w.addZone("stillmoonb", "The Ascent", 9); // DoN
w.addZone("thundercrest", "Thundercrest Isles", 9); // DoN
w.addZone("delvea", "Lavaspinner's Lair", 9); // DoN
w.addZone("delveb", "Tirranun's Delve", 9); // DoN
w.addZone("thenest", "The Accursed Nest", 9); // DoN
w.addZone("guildhall", "Guild Hall", 9); // DoN
w.addZone("tutoriala", "The Mines of Gloomingdeep (A), 0"); // DoN
w.addZone("tutorialb", "The Mines of Gloomingdeep (B), 0"); // DoN
w.addZone("illsalin", "Ruins of Illsalin", 10); // DoDH
w.addZone("illsalina", "Imperial Bazaar", 10); // DoDH
w.addZone("illsalinb", "Temple of the Korlach", 10); // DoDH
w.addZone("illsalinc", "The Nargilor Pits", 10); // DoDH
w.addZone("dreadspire", "Dreadspire Keep", 10); // DoDH
w.addZone("drachnidhive", "The Hive", 10); // DoDH
w.addZone("drachnidhivea", "Living Larder", 10); // DoDH
w.addZone("drachnidhiveb", "Coven of the Skinwalkers", 10); // DoDH
w.addZone("drachnidhivec", "Queen Sendaii's Lair", 10); // DoDH
w.addZone("westkorlach", "Stoneroot Falls", 10); // DoDH
w.addZone("westkorlacha", "Chambers of Xill", 10); // DoDH
w.addZone("westkorlachb", "Caverns of the Lost", 10); // DoDH
w.addZone("westkorlachc", "Lair of the Korlach", 10); // DoDH
w.addZone("eastkorlach", "Undershore", 10); // DoDH
w.addZone("eastkorlacha", "Snarlstone Dens", 10); // DoDH
w.addZone("shadowspine", "Shadowspine", 10); // DoDH
w.addZone("corathus", "Corathus Creep", 10); // DoDH
w.addZone("corathusa", "Sporali Caverns", 10); // DoDH
w.addZone("corathusb", "Corathus Lair", 10); // DoDH
w.addZone("nektulosa", "Shadowed Grove", 10); // DoDH
w.addZone("arcstone", "Arcstone", 11); // PoR
w.addZone("relic", "Relic", 11); // PoR
w.addZone("skylance", "Skylance", 11); // PoR
w.addZone("devastation", "The Devastation", 11); // PoR
w.addZone("devastationa", "The Seething Wall", 11); // PoR
w.addZone("rage", "Sverag, Stronghold of Rage", 11); // PoR
w.addZone("ragea", "Razorthorn, Tower of Sullon Zek", 11); // PoR
w.addZone("takishruinsa", "The Root of Ro", 11); // PoR
w.addZone("elddar", "The Elddar Forest", 11); // PoR
w.addZone("elddara", "Tunare's Shrine", 11); // PoR
w.addZone("theater", "Theater of Blood", 11); // PoR
w.addZone("theatera", "Deathknell, Tower of Dissonance", 11); // PoR
w.addZone("freeportacademy", "Academy of Arcane Sciences", 11); // PoR
w.addZone("freeporttemple", "Temple of Marr (B)", 11); // PoR
w.addZone("freeportmilitia", "Freeport Militia House", 11); // PoR
w.addZone("freeportarena", "Arena", 11); // PoR
w.addZone("freeportcityhall", "City Hall", 11); // PoR
w.addZone("freeporttheater", "Theater", 11); // PoR
w.addZone("freeporthall", "Hall of Truth", 11); // PoR
w.addZone("southro", "South Ro (A), 11"); // PoR
w.addZone("commonlands", "Commonlands", 11); // PoR
w.addZone("oceanoftears", "Ocean Of Tears", 11); // PoR
w.addZone("kithforest", "Kithicor Forest (B), 11"); // PoR
w.addZone("befallenb", "Befallen (B), 11"); // PoR
w.addZone("highpasskeep", "Highpass Keep", 11); // PoR
w.addZone("innothuleb", "Innothule Swamp (B), 11"); // PoR
w.addZone("toxxulia", "Toxxulia Forest", 11); // PoR
w.addZone("mistythicket", "Misty Thicket (B)", 11); // PoR
w.addZone("crescent", "Crescent Reach", 12); // TSS
w.addZone("moors", "Blightfire Moors", 12); // TSS
w.addZone("stonehive", "Stone Hive", 12); // TSS
w.addZone("mesa", "Goru`kar Mesa", 12); // TSS
w.addZone("roost", "Blackfeather Roost", 12); // TSS
w.addZone("steppes", "The Steppes", 12); // TSS
w.addZone("icefall", "Icefall Glacier", 12); // TSS
w.addZone("valdeholm", "Valdeholm", 12); // TSS
w.addZone("frostcrypt", "Frostcrypt, Throne of the Shade King", 12); // TSS
w.addZone("sunderock", "Sunderock Springs", 12); // TSS
w.addZone("vergalid", "Vergalid Mines", 12); // TSS
w.addZone("direwind", "Direwind Cliffs", 12); // TSS
w.addZone("ashengate", "Ashengate, Reliquary of the Scale", 12); // TSS
w.addZone("kattacastrum", "Katta Castrum", 13); // TBS
w.addZone("thalassius", "Thalassius, the Coral Keep", 13); // TBS
w.addZone("atiiki", "Jewel of Atiiki", 13); // TBS
w.addZone("zhisza", "Zhisza, the Shissar Sanctuary", 13); // TBS
w.addZone("silyssar", "Silyssar, New Chelsith", 13); // TBS
w.addZone("solteris", "Solteris, the Throne of Ro", 13); // TBS
w.addZone("barren", "Barren Coast", 13); // TBS
w.addZone("buriedsea", "The Buried Sea", 13); // TBS
w.addZone("jardelshook", "Jardel's Hook", 13); // TBS
w.addZone("monkeyrock", "Monkey Rock", 13); // TBS
w.addZone("suncrest", "Suncrest Isle", 13); // TBS
w.addZone("deadbone", "Deadbone Reef", 13); // TBS
w.addZone("blacksail", "Blacksail Folly", 13); // TBS
w.addZone("maidensgrave", "Maiden's Grave", 13); // TBS
w.addZone("redfeather", "Redfeather Isle", 13); // TBS
w.addZone("shipmvp", "The Open Sea (A)", 13); // TBS
w.addZone("shipmvu", "The Open Sea (B)", 13); // TBS
w.addZone("shippvu", "The Open Sea (C)", 13); // TBS
w.addZone("shipuvu", "The Open Sea (D)", 13); // TBS
w.addZone("shipmvm", "The Open Sea (E)", 13); // TBS
w.addZone("mechanotus", "Fortress Mechanotus", 14); // SoF
w.addZone("mansion", "Meldrath's Majestic Mansion", 14); // SoF
w.addZone("steamfactory", "The Steam Factory", 14); // SoF
w.addZone("shipworkshop", "S.H.I.P. Workshop", 14); // SoF
w.addZone("gyrospireb", "Gyrospire Beza", 14); // SoF
w.addZone("gyrospirez", "Gyrospire Zeka", 14); // SoF
w.addZone("dragonscale", "Dragonscale Hills", 14); // SoF
w.addZone("lopingplains", "Loping Plains", 14); // SoF
w.addZone("hillsofshade", "Hills of Shade", 14); // SoF
w.addZone("bloodmoon", "Bloodmoon Keep", 14); // SoF
w.addZone("crystallos", "Crystallos, Lair of the Awakened", 14); // SoF
w.addZone("guardian", "The Mechamatic Guardian", 14); // SoF
w.addZone("cryptofshade", "Crypt of Shade", 14); // SoF
w.addZone("dragonscaleb", "Deepscar's Den", 14); // SoF
w.addZone("oldfieldofbone", "Old Field of Scale", 15); // SoD
w.addZone("oldkaesoraa", "Kaesora Library", 15); // SoD
w.addZone("oldkaesorab", "Hatchery Wing", 15); // SoD
w.addZone("oldkurn", "Old Kurn's Tower", 15); // SoD
w.addZone("oldkithicor", "Bloody Kithicor", 15); // SoD
w.addZone("oldcommons", "Old Commonlands", 15); // SoD
w.addZone("oldhighpass", "Old Highpass Hold", 15); // SoD
w.addZone("thevoida", "The Void (A)", 15); // SoD
w.addZone("thevoidb", "The Void (B)", 15); // SoD
w.addZone("thevoidc", "The Void (C)", 15); // SoD
w.addZone("thevoidd", "The Void (D)", 15); // SoD
w.addZone("thevoide", "The Void (E)", 15); // SoD
w.addZone("thevoidf", "The Void (F)", 15); // SoD
w.addZone("thevoidg", "The Void (G)", 15); // SoD
w.addZone("oceangreenhills", "Oceangreen Hills", 15); // SoD
w.addZone("oceangreenvillage", "Oceangreen Village", 15); // SoD
w.addZone("oldblackburrow", "Old Blackburrow", 15); // SoD
w.addZone("bertoxtemple", "Temple of Bertoxxulous", 15); // SoD
w.addZone("discord", "Korafax, Home of the Riders", 15); // SoD
w.addZone("discordtower", "Citadel of the Worldslayer", 15); // SoD
w.addZone("oldbloodfield", "Old Bloodfields", 15); // SoD
w.addZone("precipiceofwar", "The Precipice of War", 15); // SoD
w.addZone("olddranik", "City of Dranik", 15); // SoD
w.addZone("toskirakk", "Toskirakk", 15); // SoD
w.addZone("korascian", "Korascian Warrens", 15); // SoD
w.addZone("rathechamber", "Rathe Council Chambers", 15); // SoD
w.addZone("oldfieldofboneb", "Field of Scale", 15); // SoD
w.addZone("brellsrest", "Brell's Rest", 16); // UF
w.addZone("fungalforest", "Fungal Forest", 16); // UF
w.addZone("underquarry", "The Underquarry", 16); // UF
w.addZone("coolingchamber", "The Cooling Chamber", 16); // UF
w.addZone("shiningcity", "Kernagir, The Shining City", 16); // UF
w.addZone("arthicrex", "Arthicrex", 16); // UF
w.addZone("foundation", "The Foundation", 16); // UF
w.addZone("lichencreep", "Lichen Creep", 16); // UF
w.addZone("pellucid", "Pellucid Grotto", 16); // UF
w.addZone("stonesnake", "Volska's Husk", 16); // UF
w.addZone("brellstemple", "Brell's Temple", 16); // UF
w.addZone("convorteum", "The Convorteum", 16); // UF
w.addZone("brellsarena", "Brell's Arena", 16); // UF
w.addZone("crafthalls", "Ngreth's Den", 16); // UF
w.addZone("weddingchapel", "Wedding Chapel", 16); // UF
w.addZone("dragoncrypt", "Lair of the Fallen", 16); // UF
w.addZone("feerrott2", "The Feerrott (B)", 17); // HoT
w.addZone("thulehouse1", "House of Thule", 17); // HoT
w.addZone("thulehouse2", "House of Thule, Upper Floors", 17); // HoT
w.addZone("housegarden", "The Grounds", 17); // HoT
w.addZone("thulelibrary", "The Library", 17); // HoT
w.addZone("well", "The Well", 17); // HoT
w.addZone("fallen", "Erudin Burning", 17); // HoT
w.addZone("morellcastle", "Morell's Castle", 17); // HoT
w.addZone("morelltower",  "Morell's Tower", 17); // HoT
w.addZone("alkabormare", "Al`Kabor's Nightmare", 17); // HoT
w.addZone("miragulmare", "Miragul's Nightmare", 17); // HoT
w.addZone("thuledream", "Fear Itself", 17); // HoT
w.addZone("somnium", "Sanctum Somnium", 17); // HoT
w.addZone("neighborhood", "Sunrise Hills", 17); // HoT
w.addZone("phylactery", "Miragul's Phylactery", 17); // HoT
w.addZone("argath", "Argath", 17); // HoT
w.addZone("arelis", "Valley of Lunanyn", 17); // HoT
w.addZone("beastdomain", "Beast's Domain", 17); // HoT
w.addZone("cityofbronze", "City of Bronze", 17); // HoT
w.addZone("eastsepulcher", "East Sepulcher", 17); // HoT
w.addZone("sarithcity", "Sarith City", 17); // HoT
w.addZone("rubak", "Rubak Oseka", 17); // HoT
w.addZone("resplendent", "Resplendent Temple", 17); // HoT
w.addZone("pillarsalra", "Pillars of Alra", 17); // HoT
w.addZone("windsong", "Windsong", 17); // HoT
w.addZone("guildhalllrg", "Palatial Guidhall", 17); // HoT
w.addZone("sepulcher", "Sepulcher of Order", 17); // HoT
w.addZone("westsepulcher", "West Sepulcher", 17); // HoT
w.addZone("resplendent", "Resplendent Temple", 17); // HoT
w.addZone("shadowedmount", "Shadowed Mount", 17); // HoT
w.addZone("guildhalllrg", "Grand Guild Hall", 17); // HoT
w.addZone("guildhallsml", "Greater Guild Hall", 17); // HoT
w.addZone("plhogrinteriors1a1", "One Bedroom House Interior", 17); // HoT
w.addZone("plhogrinteriors1a2", "One Bedroom House Interior", 17); // HoT
w.addZone("plhogrinteriors3a1", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhogrinteriors3a2", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhogrinteriors3b1", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhogrinteriors3b2", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors1a1", "One Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors1a2", "One Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors1a3", "One Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors3a1", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors3a2", "Three Bedroom House Interior", 17); // HoT
w.addZone("plhdkeinteriors3a3", "Three Bedroom House Interior", 17); // HoT
w.addZone("guildhall3", "Modest Guild Hall", 17); // HoT
w.addZone("kaelshard", "Kael Drakkel: The King's Madness", 18); // RoF
w.addZone("eastwastesshard", "East Wastes: Zeixshi-Kar's Awakening", 18); // RoF
w.addZone("crystalshard", "The Crystal Caverns: Fragment of Fear", 18); // RoF
w.addZone("shardslanding", "Shard's Landing", 18); // RoF
w.addZone("xorbb", "Valley of King Xorbb", 18); // RoF
w.addZone("breedinggrounds", "The Breeding Grounds", 18); // RoF
w.addZone("eviltree", "Evantil, the Vile Oak", 18); // RoF
w.addZone("grelleth", "Grelleth's Palace, the Chateau of Filth", 18); // RoF
w.addZone("chapterhouse", "Chapterhouse of the Fallen", 18); // RoF
w.addZone("phinteriortree", "Evantil's Abode", 18); // RoF
w.addZone("chelsithreborn", "Chelsith Reborn", 18); // RoF
w.addZone("poshadow", "Plane of Shadow", 18); // RoF
w.addZone("pomischief", "The Plane of Mischief", 18); // RoF
w.addZone("The Burned Woods", "burnedwoods", 18); // RoF
w.addZone("heartoffear", "Heart of Fear: The Threshold", 18); // RoF
w.addZone("heartoffearb", "Heart of Fear: The Rebirth", 18); // RoF
w.addZone("heartoffearc", "Heart of Fear: The Epicenter", 18); // RoF
w.addZone("thevoidh", "The Void (H)", 19); // CoTF
w.addZone("ethernere", "Ethernere Tainted West Karana", 19); // CoTF
w.addZone("neriakd", "Neriak - Fourth Gate", 19); // CoTF
w.addZone("deadhills", "The Dead Hills", 19); // CoTF
w.addZone("bixiewarfront", "Bix Warfront", 19); // CoTF
w.addZone("towerofrot", "Tower of Rot", 19); // CoTF
w.addZone("arginhiz", "Argin-Hiz", 19); // CoTF
w.addZone("arxmentis", "Arx Mentis", 20); // TDS
w.addZone("brotherisland", "Brother Island", 20); // TDS
w.addZone("endlesscaverns", "Caverns of Endless Song", 20); // TDS
w.addZone("dredge", "Combine Dredge", 20); // TDS
w.addZone("degmar", "Degmar, the Lost Castle", 20); // TDS
w.addZone("kattacastrumb", "Katta Castrum, The Deluge", 20); // TDS
w.addZone("tempesttemple", "Tempest Temple", 20); // TDS
w.addZone("thuliasaur", "Thuliasaur Island", 20); // TDS
w.addZone("exalted", "Sul Vius: Demiplane of Life", 21); // TBM
w.addZone("exaltedb", "Sul Vius: Demiplane of Decay", 21); // TBM
w.addZone("cosul", "Crypt of Sul", 21); // TBM
w.addZone("codecayb", "Ruins of Lxanvom", 21); // TBM
w.addZone("pohealth", "The Plane of Health", 21); // TBM
w.addZone("chardoktwo", "Chardok", 22); // EoK
w.addZone("frontiermtnsb", "Frontier Mountains", 22); // EoK
w.addZone("korshaext", "Gates of Kor-Sha", 22); // EoK
w.addZone("korshaint", "Kor-Sha Laboratory", 22); // EoK
w.addZone("lceanium", "Lceanium", 22); // EoK
w.addZone("scorchedwoods", "Scorched Woods", 22); // EoK
w.addZone("drogab", "Temple of Droga", 22); // EoK
w.addZone("charasisb", "Sathir's Tomb", 23); // RoS
w.addZone("gorowyn", "Gorowyn", 23); // RoS
w.addZone("charasistwo", "Howling Stones", 23); // RoS
w.addZone("skyfiretwo", "Skyfire Mountains", 23); // RoS
w.addZone("overtheretwo", "The Overthere", 23); // RoS
w.addZone("veeshantwo", "Veeshan's Peak", 23); // RoS
w.addZone("esianti", "Esianti: Palace of the Winds", 24); // TBL
w.addZone("trialsofsmoke", "Plane of Smoke", 24); // TBL
w.addZone("stratos", "Stratos: Zephyr's Flight", 24); // TBL
w.addZone("empyr", "Empyr: Realms of Ash", 24); // TBL
w.addZone("aalishai", "AAlishai: Palace of Embers", 24); // TBL
w.addZone("mearatas", "Mearatas: The Stone Demesne", 24); // TBL
w.addZone("chamberoftears", "The Chamber of Tears", 24); // TBL
w.addZone("gnomemtn", "Gnome Memorial Mountain", 24); // TBL
w.addZone("eastwastestwo", "The Eastern Wastes", 25); // ToV
w.addZone("frozenshadowtwo", "The Tower of Frozen Shadow", 25); // ToV
w.addZone("crystaltwoa", "The Ry`Gorr Mines", 25); // ToV
w.addZone("greatdividetwo", "The Great Divide", 25); // ToV
w.addZone("velketortwo", "Velketor's Labyrinth", 25); // ToV
w.addZone("kaeltwo", "Kael Drakkel", 25); // ToV
w.addZone("crystaltwob", "Crystal Caverns", 25); // ToV
w.addZone("sleepertwo", "The Sleeper's Tomb", 26); // CoV
w.addZone("necropolistwo", "Dragon Necropolis", 26); // CoV
w.addZone("cobaltscartwo", "Cobalt Scar", 26); // CoV
w.addZone("westwastestwo", "The Western Wastes", 26); // CoV
w.addZone("skyshrinetwo", "Skyshrine", 26); // CoV
w.addZone("templeveeshantwo", "The Temple of Veeshan", 26); // CoV
w.addZone("maidentwo", "Maiden's Eye", 27); // ToL
w.addZone("umbraltwo", "Umbral Plains", 27); // ToL
w.addZone("akhevatwo", "Ka Vethan", 27); // ToL
w.addZone("vexthaltwo", "Vex Thal", 27); // ToL
w.addZone("shadowvalley", "Shadow Valley", 27); // ToL
w.addZone("basilica", "Basilica of Adumbration", 27); // ToL
w.addZone("bloodfalls", "Bloodfalls", 27); // ToL
w.addZone("maidenhouseint", "Coterie Chambers", 27); // ToL
w.addZone("shadowhaventwo", "Ruins of Shadow Haven", 28); // NoS
w.addZone("sharvahltwo", "Shar Vahl, Divided", 28); // NoS
w.addZone("shadeweavertwo", "Shadeweaver's Tangle", 28); // NoS
w.addZone("paludaltwo", "Paludal Caverns", 28); // NoS
w.addZone("deepshade", "Deepshade", 28); // NoS
w.addZone("firefallpass", "Firefall Pass", 28); // NoS
w.addZone("hollowshadetwo", "Hollowshade Moor", 28); // NoS
w.addZone("darklightcaverns", "Darklight Caverns", 28); // NoS
w.addZone("laurioninn", "Laurion Inn", 29); // LS
w.addZone("timorousfalls", "Timorous Falls", 29); // LS
w.addZone("ankexfen", "Ankexfen Keep", 29); // LS
w.addZone("moorsofnokk", "Moors of Nokk", 29); // LS
w.addZone("unkemptwoods", "Unkempt Woods", 29); // LS
w.addZone("herosforge", "The Hero's Forge", 29); // LS
w.addZone("pallomen", "Pal'Lomen", 29); // LS

w.addBiZoneLine('qeytoqrg', 'qeynos2', 2);
w.addBiZoneLine('qeynos2', 'qeynos', 2);
w.addBiZoneLine('qeynos', 'erudsxing', 2);
w.addBiZoneLine('qeytoqrg', 'blackburrow', 2);
w.addBiZoneLine('blackburrow', 'everfrost', 2);
w.addBiZoneLine('blackburrow', 'jaggedpine', 2);
w.addBiZoneLine('jaggedpine', 'nedaria', 2);
w.addBiZoneLine('everfrost', 'halas', 2);
w.addBiZoneLine('everfrost', 'permafrost', 2);
w.addBiZoneLine('qeytoqrg', 'qey2hh1', 2);
w.addBiZoneLine('qey2hh1', 'northkarana', 2);
w.addBiZoneLine('northkarana', 'eastkarana', 2);
w.addBiZoneLine('northkarana', 'southkarana', 2);
w.addBiZoneLine('southkarana', 'paw', 2);
w.addBiZoneLine('southkarana', 'lakerathe', 2);
w.addBiZoneLine('eastkarana', 'highpasshold', 2);
w.addBiZoneLine('highpasshold', 'highkeep', 2);
w.addBiZoneLine('highpasshold', 'kithicor', 2);
w.addBiZoneLine('kithicor', 'rivervale', 2);
w.addBiZoneLine('kithicor', 'commons', 2);
w.addBiZoneLine('rivervale', 'misty', 2);
w.addBiZoneLine('misty', 'runnyeye', 2);
w.addBiZoneLine('runnyeye', 'beholder', 2);
w.addBiZoneLine('eastkarana', 'beholder', 2);
w.addBiZoneLine('lakerathe', 'arena', 2);
w.addBiZoneLine('lakerathe', 'rathemtn', 2);
w.addBiZoneLine('rathemtn', 'feerrott', 2);
w.addBiZoneLine('feerrott', 'fearplane', 2);
w.addBiZoneLine('feerrott', 'cazicthule', 2);
w.addBiZoneLine('qrg', 'qeytoqrg', 2);
w.addBiZoneLine('qeynos', 'qcat', 2);
w.addBiZoneLine('qeynos2', 'qcat', 2);
w.addBiZoneLine('erudsxing', 'erudnext', 2);
w.addBiZoneLine('erudnext', 'tox', 2);
w.addBiZoneLine('tox', 'kerraridge', 2);
w.addBiZoneLine('erudnext', 'erudnint', 2);
w.addBiZoneLine('feerrott', 'innothule', 2);
w.addBiZoneLine('innothule', 'grobb', 2);
w.addBiZoneLine('innothule', 'sro', 2);
w.addBiZoneLine('innothule', 'guktop', 2);
w.addBiZoneLine('guktop', 'gukbottom', 2);
w.addBiZoneLine('sro', 'oasis', 2);
w.addBiZoneLine('oasis', 'nro', 2);
w.addBiZoneLine('nro', 'freporte', 2);
w.addBiZoneLine('freporte', 'freportw', 2);
w.addBiZoneLine('freportw', 'freportn', 2);
w.addBiZoneLine('freportw', 'ecommons', 2);
w.addBiZoneLine('ecommons', 'commons', 2);
w.addBiZoneLine('ecommons', 'nektulos', 2);
w.addBiZoneLine('ecommons', 'nro', 2);
w.addBiZoneLine('nektulos', 'lavastorm', 2);
w.addBiZoneLine('lavastorm', 'soldungb', 2);
w.addBiZoneLine('lavastorm', 'soldunga', 2);
w.addBiZoneLine('lavastorm', 'soltemple', 2);
w.addBiZoneLine('lavastorm', 'najena', 2);
w.addBiZoneLine('freporte', 'oot', 2);
w.addBiZoneLine('oot', 'butcher', 2);
w.addBiZoneLine('butcher', 'kaladimb', 2);
w.addBiZoneLine('kaladimb', 'kaladima', 2);
w.addBiZoneLine('butcher', 'cauldron', 2);
w.addBiZoneLine('butcher', 'gfaydark', 2);
w.addBiZoneLine('gfaydark', 'crushbone', 2);
w.addBiZoneLine('cauldron', 'unrest', 2);
w.addBiZoneLine('gfaydark', 'felwithea', 2);
w.addBiZoneLine('felwithea', 'felwitheb', 2);
w.addBiZoneLine('oasis', 'timorous');

//KUNARK
//burningwood
w.addBiZoneLine('chardok', 'burningwood');
w.addBiZoneLine('dreadlands', 'burningwood');
w.addBiZoneLine('frontiermtns', 'burningwood');
w.addBiZoneLine('skyfire', 'burningwood');
//chardok
w.addBiZoneLine('chardok', 'chardokb');
//w.addBiZoneLine("chardok", "scorchedwoods");
//citymist
w.addBiZoneLine('emeraldjungle', 'citymist');
//dalnir
w.addBiZoneLine('warslikswood', 'dalnir');
//dreadlands
w.addBiZoneLine('burningwood', 'dreadlands');
w.addBiZoneLine('firiona', 'dreadlands');
w.addBiZoneLine('frontiermtns', 'dreadlands');
w.addBiZoneLine('karnor', 'dreadlands');
w.addBiZoneLine('nexus', 'dreadlands');
w.addZoneLine('guildhall', 'dreadlands', 2, 'take the teleporter');
//cabeast
w.addBiZoneLine('fieldofbone', 'cabeast');
w.addBiZoneLine('swampofnohope', 'cabeast');
w.addBiZoneLine('cabwest', 'cabeast');
//emeraldjungle
w.addBiZoneLine('fieldofbone', 'emeraldjungle');
w.addBiZoneLine('trakanon', 'emeraldjungle');
//fieldofbone
w.addBiZoneLine('emeraldjungle', 'fieldofbone');
w.addBiZoneLine('kaesora', 'fieldofbone');
w.addBiZoneLine('kurn', 'fieldofbone');
//firiona
w.addBiZoneLine('lakeofillomen', 'firiona');
w.addBiZoneLine('poknowledge', 'firiona');
w.addBiZoneLine('swampofnohope', 'firiona');
w.addBiZoneLine('timorous', 'firiona');
//frontiermtns
w.addBiZoneLine('timorous', 'frontiermtns');
w.addBiZoneLine('dreadlands', 'frontiermtns');
w.addBiZoneLine('lakeofillomen', 'frontiermtns');
w.addBiZoneLine('nurga', 'frontiermtns');
w.addBiZoneLine('droga', 'frontiermtns');
w.addBiZoneLine('overthere', 'frontiermtns');
//charasis
w.addBiZoneLine('overthere', 'charasis');
//lakeofillomen
w.addBiZoneLine('firiona', 'lakeofillomen');
w.addBiZoneLine('veksar', 'lakeofillomen');
w.addBiZoneLine('warslikswood', 'lakeofillomen');
//veksar
//warslikswood
//nurga
w.addBiZoneLine('droga', 'nurga');
//droga
//trakanon
w.addBiZoneLine('trakanon', 'sebilis');
//sebilis
//skyfire
w.addBiZoneLine('overthere', 'skyfire');
w.addBiZoneLine('veeshan', 'skyfire');
//veeshan
//overthere
w.addBiZoneLine('frontiermtns', 'overthere');
w.addBiZoneLine('poknowledge', 'overthere');
w.addBiZoneLine('skyfire', 'overthere');
w.addBiZoneLine('timorous', 'overthere');
w.addBiZoneLine('warslikswood', 'overthere');
//swampofnohope
w.addBiZoneLine('fieldofbone', 'swampofnohope');
w.addBiZoneLine('trakanon', 'swampofnohope');
//timorous
w.addBiZoneLine('oasis', 'timorous');
w.addBiZoneLine('butcher', 'timorous');
//cabwest
w.addBiZoneLine('cabwest', 'cabwest');
w.addBiZoneLine('timorous', 'cabwest');


//VELIOUS
//iceclad
w.addBiZoneLine('eastwastes', 'iceclad');
w.addBiZoneLine('nro', 'iceclad');
w.addBiZoneLine('frozenshadow', 'iceclad');
//frozenshadow
w.addBiZoneLine('iceclad', 'frozenshadow');
//velketor
w.addBiZoneLine('greatdivide', 'velketor');
//kael
w.addZoneLine('skyshrine', 'kael', 2, 'exit from skyshrine');
w.addBiZoneLine('eastwastes', 'kael');
w.addBiZoneLine('wakening', 'kael');
//skyshrine
w.addBiZoneLine('cobaltscar', 'skyshrine');
w.addZoneLine('skyshrine', 'kale', 2, 'entrance to kael');
w.addBiZoneLine('wakening', 'skyshrine');
//thurgadina
w.addBiZoneLine('greatdivide', 'thurgadina');
w.addBiZoneLine('thurgadinb', 'thurgadina');
//eastwastes
w.addBiZoneLine('crystal', 'eastwastes');
w.addBiZoneLine('greatdivide', 'eastwastes');
w.addBiZoneLine('iceclad', 'eastwastes');
w.addBiZoneLine('kael', 'eastwastes');
w.addBiZoneLine('sleeper', 'eastwastes');
//cobaltscar
w.addBiZoneLine('guildhall', 'cobaltscar');
w.addBiZoneLine('mischiefplane', 'cobaltscar');
w.addBiZoneLine('sirens', 'cobaltscar');
w.addBiZoneLine('skyshrine', 'cobaltscar');
//greatdivide
w.addBiZoneLine('eastwastes', 'greatdivide');
w.addBiZoneLine('thurgadinb', 'greatdivide');
w.addBiZoneLine('poknowledge', 'greatdivide');
w.addBiZoneLine('mischiefplane', 'greatdivide');
w.addBiZoneLine('nexus', 'greatdivide');
w.addBiZoneLine('thurgadina', 'greatdivide');
w.addBiZoneLine('velketor', 'greatdivide');
//wakening
w.addBiZoneLine('kael', 'wakening');
w.addBiZoneLine('skyshrine', 'wakening');
w.addZoneLine('wakening', 'growthplane', 2, 'entrance to growth');
//westwastes
w.addBiZoneLine('necropolis', 'westwastes');
w.addBiZoneLine('sirens', 'westwastes');
w.addBiZoneLine('templeveeshan', 'westwastes');
//crystal
w.addBiZoneLine('eastwastes', 'crystal');
//necropolis
w.addBiZoneLine('breedinggrounds', 'necropolis');
w.addBiZoneLine('westwastes', 'necropolis');
//templeveeshan
w.addBiZoneLine('templeveeshan', 'mischiefplane');
w.addBiZoneLine('templeveeshan', 'westwastes');
//sirens
w.addBiZoneLine('westwastes', 'sirens');
w.addBiZoneLine('cobaltscar', 'sirens');
//mischiefplane
w.addZoneLine('mischiefplane', 'cobaltscar', 2, 'entrance to mischief');
w.addZoneLine('mischiefplane', 'greatdivide', 2, 'entrance to mischief');
w.addZoneLine('mischiefplane', 'templeveeshan', 2, 'entrance to mischief');
//growthplane
w.addBiZoneLine('wakening', 'growthplane');
//sleeper
w.addBiZoneLine('eastwastes', 'sleeper');
//thurgadinb
w.addBiZoneLine('greatdivide', 'thurgadinb');
w.addBiZoneLine('thurgadina', 'thurgadinb');
//stonebrunt
w.addZoneLine('guildhall', 'stonebrunt', 2, 'exit from guild hall');
w.addBiZoneLine('gunthak', 'stonebrunt');
w.addBiZoneLine('warrens', 'stonebrunt');
//warrens
w.addBiZoneLine('warrens', 'paineel');
w.addBiZoneLine('warrens', 'stonebrunt');

//LUCLIN
//bazaar
w.addBiZoneLine('poknowledge', 'bazaar');
w.addBiZoneLine('shadowhaven', 'bazaar');
w.addBiZoneLine('nexus', 'bazaar');
//shadowhaven
w.addBiZoneLine('echo', 'shadowhaven');
w.addBiZoneLine('paludal', 'shadowhaven');
w.addBiZoneLine('bazaar', 'shadowhaven');
w.addBiZoneLine('nexus', 'shadowhaven');
//nexus
w.addBiZoneLine('dreadlands', 'nexus');
w.addBiZoneLine('greatdivide', 'nexus');
w.addBiZoneLine('gfaydark', 'nexus');
w.addBiZoneLine('netherbian', 'nexus');
w.addBiZoneLine('northkarana', 'nexus');
w.addBiZoneLine('poknowledge', 'nexus');
w.addBiZoneLine('shadowhaven', 'nexus');
w.addBiZoneLine('bazaar', 'nexus');
w.addBiZoneLine('tox', 'nexus');
w.addZoneLine('lceanium', 'ecommons', 2, 'exit from Lceanium');
w.addZoneLine('maiden', 'ecommons', 2, 'exit from Maiden');
//echo
w.addBiZoneLine('fungusgrove', 'echo');
w.addBiZoneLine('shadowhaven', 'echo');
w.addBiZoneLine('thedeep', 'echo');
//acrylia
w.addBiZoneLine('grimling', 'acrylia');
//sharvahl
w.addBiZoneLine('draniksscar', 'sharvahl');
w.addBiZoneLine('hollowshade', 'sharvahl');
w.addBiZoneLine('shadeweaver', 'sharvahl');
//paludal
w.addBiZoneLine('hollowshade', 'paludal');
w.addBiZoneLine('shadeweaver', 'paludal');
w.addBiZoneLine('shadowhaven', 'paludal');
//fungusgrove
w.addBiZoneLine('echo', 'fungusgrove');
w.addBiZoneLine('twilight', 'fungusgrove');
//vexthal
w.addBiZoneLine('poshadow', 'vexthal');
w.addBiZoneLine('umbral', 'vexthal');
//sseru
w.addBiZoneLine('dawnshroud', 'sseru');
w.addBiZoneLine('mseru', 'sseru');
//katta
w.addBiZoneLine('tenebrous', 'katta');
w.addBiZoneLine('twilight', 'katta');
//netherbian
w.addBiZoneLine('dawnshroud', 'netherbian');
w.addBiZoneLine('mseru', 'netherbian');
w.addBiZoneLine('nexus', 'netherbian');
//ssratemple
w.addBiZoneLine('thedeep', 'ssratemple');
w.addBiZoneLine('thegrey', 'ssratemple');
//griegsend
w.addBiZoneLine('dawnshroud', 'griegsend');
w.addBiZoneLine('scarlet', 'griegsend');
//thedeep
w.addBiZoneLine('echo', 'thedeep');
w.addBiZoneLine('ssratemple', 'thedeep');
//shadeweaver
w.addBiZoneLine('paludal', 'shadeweaver');
w.addBiZoneLine('poknowledge', 'shadeweaver');
w.addBiZoneLine('sharvahl', 'shadeweaver');
//hollowshade
w.addBiZoneLine('grimling', 'hollowshade');
w.addBiZoneLine('paludal', 'hollowshade');
w.addBiZoneLine('sharvahl', 'hollowshade');
//grimling
w.addBiZoneLine('acrylia', 'grimling');
w.addBiZoneLine('hollowshade', 'grimling');
w.addBiZoneLine('tenebrous', 'grimling');
//mseru
w.addBiZoneLine('letalis', 'mseru');
w.addBiZoneLine('netherbian', 'mseru');
w.addBiZoneLine('sseru', 'mseru');
//jaggedpine
w.addBiZoneLine('blackburrow', 'jaggedpine');
w.addBiZoneLine('nedaria', 'jaggedpine');
w.addBiZoneLine('qrg', 'jaggedpine');
//letalis
w.addBiZoneLine('mseru', 'letalis');
w.addBiZoneLine('thegrey', 'letalis');
//twilight
w.addBiZoneLine('fungusgrove', 'twilight');
w.addBiZoneLine('katta', 'twilight');
w.addBiZoneLine('scarlet', 'twilight');
w.addZoneLine('guildhall', 'twilight', 2, 'exit from guild hall');
//thegrey
w.addBiZoneLine('chelsithreborn', 'thegrey');
w.addBiZoneLine('letalis', 'thegrey');
w.addBiZoneLine('scarlet', 'thegrey');
w.addBiZoneLine('ssratemple', 'thegrey');
//tenebrous
w.addBiZoneLine('grimling', 'tenebrous');
w.addBiZoneLine('katta', 'tenebrous');
//maiden
w.addBiZoneLine('akheva', 'maiden');
w.addBiZoneLine('dawnshroud', 'maiden');
w.addBiZoneLine('umbral', 'maiden');
//dawnshroud
w.addBiZoneLine('griegsend', 'dawnshroud');
w.addBiZoneLine('maiden', 'dawnshroud');
w.addBiZoneLine('netherbian', 'dawnshroud');
w.addBiZoneLine('sseru', 'dawnshroud');
//scarlet
w.addBiZoneLine('griegsend', 'scarlet');
w.addBiZoneLine('thegrey', 'scarlet');
w.addBiZoneLine('twilight', 'scarlet');
//umbral
w.addBiZoneLine('maiden', 'umbral');
w.addBiZoneLine('vexthal', 'umbral');
//akheva
w.addBiZoneLine('maiden', 'akheva');

//PLANES OF POWER
w.addBiZoneLine('felwithea', 'felwitheb', 2);
//codecay
w.addBiZoneLine('podisease', 'codecay', 2);
w.addBiZoneLine('potimeb', 'codecay', 2);
w.addBiZoneLine('potranquility', 'codecay', 2);
//pojustice
w.addZoneLine('potranquility', 'pojustice');
//ponightmare
w.addZoneLine('nightmareb', 'ponightmare'); // 4
w.addZoneLine('potranquility', 'ponightmare');
//podisease
w.addZoneLine('potranquility', 'podisease');
w.addZoneLine('codecay', 'podisease');
//poinnovation
w.addZoneLine('potranquility', 'poinnovation');
w.addZoneLine('poinnovation', 'potimea', 2, '	Entrance To Plane of Time A');
//potorment
w.addZoneLine('potimeb', 'potorment');
w.addZoneLine('potranquility', 'potorment');
//povalor
w.addZoneLine('hohonora', 'povalor');
w.addZoneLine('potranquility', 'povalor');
//bothunder
w.addZoneLine('potranquility', 'bothunder');
w.addZoneLine('postorms', 'bothunder');
//postorms
w.addZoneLine('potranquility', 'postorms');
w.addZoneLine('bothunder', 'postorms');
//hohonora
w.addZoneLine('potranquility', 'hohonora');
w.addZoneLine('povalor', 'hohonora');
w.addZoneLine('hohonorb', 'hohonora');
//solrotower
w.addZoneLine('pofire', 'solrotower');
w.addZoneLine('potranquility', 'solrotower');
//potactics
w.addZoneLine('potranquility', 'potactics');
w.addZoneLine('potimeb', 'potactics');
//poair
w.addZoneLine('potranquility', 'poair');
//powater
w.addZoneLine('potranquility', 'powater');
//pofire
w.addZoneLine('potranquility', 'pofire');
w.addZoneLine('solrotower', 'pofire');
//poeartha
w.addZoneLine('potranquility', 'poeartha');
w.addZoneLine('poearthb', 'poeartha');
//potimea
w.addZoneLine('guildhall', 'potimea', 2, 'Exit From Guild Hall');
w.addZoneLine('poinnovation', 'potimea', 2, 'Exit From Plane of Innovation');
w.addZoneLine('potranquility', 'potimea');
w.addZoneLine('potimeb', 'potimea');
//hohonorb
w.addZoneLine('hohonora', 'hohonorb'); // 4
//nightmareb
//poearthb
//potimeb
//potranquility
w.addBiZoneLine('poknowledge', 'potranquility');
w.addBiZoneLine('hohonora', 'potranquility');
w.addBiZoneLine('bothunder', 'potranquility');
w.addBiZoneLine('hohonora', 'potranquility');
w.addBiZoneLine('podisease', 'potranquility');
w.addBiZoneLine('poinnovation', 'potranquility');
w.addBiZoneLine('pojustice', 'potranquility');
w.addBiZoneLine('ponightmare', 'potranquility');
w.addBiZoneLine('poknowledge', 'potranquility');
w.addBiZoneLine('postorms', 'potranquility');
w.addBiZoneLine('potimea', 'potranquility');
w.addBiZoneLine('potorment', 'potranquility');
w.addBiZoneLine('povalor', 'potranquility');
w.addBiZoneLine('powar', 'potranquility');
w.addBiZoneLine('powater', 'potranquility');
w.addBiZoneLine('solrotower', 'potranquility');
w.addBiZoneLine('poeartha', 'potranquility');
w.addBiZoneLine('poair', 'potranquility');
w.addBiZoneLine('pofire', 'potranquility');
w.addBiZoneLine('codecay', 'potranquility');
w.addBiZoneLine('hohonorb', 'potranquility');
//poknowledge
w.addBiZoneLine('arena', 'poknowledge');
w.addBiZoneLine('bazaar', 'poknowledge');
w.addBiZoneLine('butcher', 'poknowledge');
w.addBiZoneLine('everfrost', 'poknowledge');
w.addBiZoneLine('feerrott', 'poknowledge');
w.addZoneLine('feerrott2', 'poknowledge', 2, 'Exit From Feerrott, the Dream');
w.addBiZoneLine('fieldofbone', 'poknowledge');
w.addBiZoneLine('firiona', 'poknowledge');
w.addBiZoneLine('freportw', 'poknowledge');
w.addBiZoneLine('gfaydark', 'poknowledge');
w.addBiZoneLine('greatdivide', 'poknowledge');
w.addBiZoneLine('guildlobby', 'poknowledge');
w.addBiZoneLine('gunthak', 'poknowledge');
w.addBiZoneLine('innothule', 'poknowledge');
w.addBiZoneLine('innothuleb', 'poknowledge');
w.addBiZoneLine('misty', 'poknowledge');
w.addBiZoneLine('mistythicket', 'poknowledge');
w.addBiZoneLine('nektulos', 'poknowledge');
w.addBiZoneLine('nexus', 'poknowledge');
w.addBiZoneLine('overthere', 'poknowledge');
w.addBiZoneLine('tox', 'poknowledge');
w.addBiZoneLine('weddingchapel', 'poknowledge');
w.addBiZoneLine('weddingchapeldark', 'poknowledge');
w.addBiZoneLine('qeynos2', 'poknowledge');
w.addBiZoneLine('relic', 'poknowledge');
w.addBiZoneLine('shadeweaver', 'poknowledge');
w.addBiZoneLine('solrotower', 'pofire');
w.addBiZoneLine('steamfont', 'poknowledge');
w.addBiZoneLine('moors', 'poknowledge');
w.addBiZoneLine('draniksscar', 'poknowledge');
w.addBiZoneLine('gunthak', 'poknowledge');
w.addBiZoneLine('potimea', 'poknowledge');
w.addBiZoneLine('potranquility', 'poknowledge');
w.addBiZoneLine('rathemtn', 'poknowledge');
w.addBiZoneLine('tutoriala', 'poknowledge');

//LEGACY OF YKESHA
//gunthak
w.addBiZoneLine('poknowledge', 'gunthak');
w.addBiZoneLine('dulak', 'gunthak');
w.addBiZoneLine('nadox', 'gunthak');
w.addBiZoneLine('stonebrunt', 'gunthak');
//dulak
w.addBiZoneLine('gunthak', 'dulak');
w.addBiZoneLine('torgiran', 'dulak');
//torgiran
w.addBiZoneLine('nadox', 'torgiran');
w.addBiZoneLine('dulak', 'torgiran');
//nadox
w.addBiZoneLine('torgiran', 'gunthak');
w.addBiZoneLine('gunthak', 'gunthak');
w.addBiZoneLine('hatesfury', 'gunthak');
//hatesfury
w.addBiZoneLine('nadox', 'hatesfury');


//LOST DUNGEONS OF NORRATH
//The Cauldron of Lost Souls	guka	229
//The Bloodied Quarries	ruja	230
//The Sunken Library	taka	231
//The Silent Gallery	mira	232
//The Forlorn Caverns	mmca	233
//The Drowning Crypt	gukb	234
//The Halls of War	rujb	235
//The Shifting Tower	takb	236
//The Maw of the Menagerie	mirb	237
//The Dreary Grotto	mmcb	238
//The Ancient Aqueducts	gukc	239
//The Wind Bridges	rujc	240
//The Fading Temple	takc	241
//The Spider Den	mirc	242
//The Asylum of Invoked Stone	mmcc	243
//The Mushroom Grove	gukd	244
//The Gladiator Pits	rujd	245
//The Royal Observatory	takd	246
//The Hushed Banquet	mird	247
//The Chambers of Eternal Affliction	mmcd	248
//The Foreboding Prison	guke	249
//The Drudge Hollows	ruje	250
//The River of Recollection	take	251
//The Frosted Halls	mire	252
//The Sepulcher of the Damned	mmce	253
//The Chapel of the Witnesses	gukf	254
//The Fortified Lair of the Taskmasters	rujf	255
//The Sandfall Corridors	takf	256
//The Forgotten Wastes	mirf	257
//The Ritualistic Summoning Grounds	mmcf	258
//The Root Garden	gukg	259
//The Hidden Vale	rujg	260
//The Balancing Chamber	takg	261
//The Heart of the Menagerie	mirg	262
//The Cesspits of Putrescence	mmcg	263
//The Accursed Sanctuary	gukh	264
//The Blazing Forge	rujh	265
//The Sweeping Tides	takh	266
//The Morbid Laboratory	mirh	267
//The Aisles of Blood	mmch	268
//The Arena of Chance	ruji	269
//The Antiquated Palace	taki	270
//The Theater of Imprisoned Horrors	miri	271
//The Halls of Sanguinary Rites	mmci	272
//The Barracks of War	rujj	273
//The Prismatic Corridors	takj	274
//The Grand Library	mirj	275
//The Infernal Sanctuary	mmcj	276

//GATES OF DISCORD
//abysmal
w.addBiZoneLine('natimbi', 'abysmal');
w.addBiZoneLine('nedaria', 'abysmal');
//natimbi
w.addBiZoneLine('abysmal', 'natimbi');
w.addBiZoneLine('kodtaz', 'natimbi');
w.addBiZoneLine('nedaria', 'natimbi');
w.addBiZoneLine('qinimi', 'natimbi');
w.addBiZoneLine('qvic', 'natimbi');
//qinimi
w.addBiZoneLine('barindu', 'qinimi');
w.addBiZoneLine('ferubi', 'qinimi');
w.addBiZoneLine('natimbi', 'qinimi');
w.addBiZoneLine('riwwi', 'qinimi');
//riwwi
w.addBiZoneLine('barindu', 'riwwi');
w.addBiZoneLine('ferubi', 'riwwi');
w.addBiZoneLine('qinimi', 'riwwi');
//barindu
w.addBiZoneLine('ferubi', 'barindu');
w.addBiZoneLine('qinimi', 'barindu');
w.addBiZoneLine('riwwi', 'barindu');
w.addBiZoneLine('tipt', 'barindu');
w.addBiZoneLine('vxed', 'barindu');
//ferubi
w.addBiZoneLine('barindu', 'ferubi');
w.addBiZoneLine('qinimi', 'ferubi');
w.addBiZoneLine('riwwi', 'ferubi');
//snpool
//snlair
//snplant
//sncrematory
//tipt
w.addBiZoneLine('barindu', 'tipt');
//vxed
w.addBiZoneLine('barindu', 'vxed');
//yxtta
w.addBiZoneLine('kodtaz', 'yxtta');
w.addBiZoneLine('qvic', 'yxtta');
w.addBiZoneLine('uqua', 'yxtta');
//uqua
w.addBiZoneLine('yxtta', 'uqua');
//kodtaz
w.addBiZoneLine('natimbi', 'kodtaz');
w.addBiZoneLine('qvic', 'kodtaz');
w.addBiZoneLine('yxtta', 'kodtaz');
//ikkinz
//qvic
w.addBiZoneLine('inktuta', 'qvic');
w.addBiZoneLine('kodtaz', 'qvic');
w.addBiZoneLine('natimbi', 'qvic');
w.addBiZoneLine('txevu', 'qvic');
w.addBiZoneLine('yxtta', 'qvic');
//inktuta
w.addBiZoneLine('qvic', 'inktuta');
//txevu
w.addBiZoneLine('qvic', 'txevu');
w.addBiZoneLine('tacvi', 'txevu');
//tacvi
w.addBiZoneLine('txevu', 'tacvi');
//qvicb

//OMENS OF WAR
//wallofslaughter
w.addBiZoneLine('anguish', 'wallofslaughter');
w.addBiZoneLine('provinggrounds', 'wallofslaughter');
w.addBiZoneLine('causeway', 'wallofslaughter');
w.addZoneLine('guildhall', 'wallofslaughter', 2, 'Exit From Guild Hall');
//bloodfields
w.addBiZoneLine('draniksscar', 'bloodfields');
w.addBiZoneLine('dranik', 'bloodfields');
//draniksscar
w.addBiZoneLine('harbingers', 'draniksscar');
w.addBiZoneLine('causeway', 'draniksscar');
w.addBiZoneLine('bloodfields', 'draniksscar');
//causeway
w.addBiZoneLine('draniksscar', 'causeway');
w.addBiZoneLine('wallofslaughter', 'causeway');
//provinggrounds
w.addBiZoneLine('riftseekers', 'provinggrounds');
w.addBiZoneLine('wallofslaughter', 'provinggrounds');
//anguish
w.addBiZoneLine('wallofslaughter', 'anguish');
//riftseekers
w.addBiZoneLine('provinggrounds', 'riftseekers');
//harbingers
w.addBiZoneLine('draniksscar', 'harbingers');
//dranik
w.addBiZoneLine('bloodfields', 'dranik');

//DRAGONS OF NORRATH
//broodlands
w.addBiZoneLine('thenest', 'broodlands');
w.addBiZoneLine('delvea', 'broodlands');
w.addBiZoneLine('lavastorm', 'broodlands');
w.addBiZoneLine('stillmoona', 'broodlands');
w.addBiZoneLine('thundercrest', 'broodlands');
//stillmoona
w.addBiZoneLine('stillmoonb', 'stillmoona');
w.addBiZoneLine('broodlands', 'stillmoona');
//stillmoonb
w.addBiZoneLine('stillmoona', 'stillmoonb');
//thundercrest
w.addBiZoneLine('broodlands', 'thundercrest');
//delvea
w.addBiZoneLine('lavastorm', 'delvea');
w.addBiZoneLine('broodlands', 'delvea');
w.addBiZoneLine('	delveb', 'delvea');
//delveb
w.addBiZoneLine('delvea', 'delveb');
//thenest
w.addBiZoneLine('broodlands', 'thenest');
//Guild Lobby
w.addBiZoneLine('guildhall', 'guildlobby');
w.addBiZoneLine('nedaria', 'guildlobby');
w.addBiZoneLine('neighborhood', 'guildlobby');
//Guild Hall
w.addBiZoneLine('guildlobby', 'guildhall');
w.addZoneLine('guildhall', 'arcstone', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'argath', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'barindu', 2, 'give XYZ stone to zone to Gardens');
w.addZoneLine('guildhall', 'brellsrest', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'cobaltscar', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'commons', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'dragonscale', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'dreadlands', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'feerrott2', 2, 'give XYZ stone to zone to Dream');
w.addZoneLine('guildhall', 'mesa', 2, 'give XYZ stone to zone to Mesa');
w.addZoneLine('guildhall', 'gfaydark', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'iceclad', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'kattacastrum', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'lavastorm', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'lavastorm', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'hateplane', 2, 'give XYZ stone to zone to Hate');
w.addZoneLine('guildhall', 'airplane', 2, 'give XYZ stone to zone to Sky');
w.addZoneLine('guildhall', 'potimea', 2, 'give XYZ stone to zone to Time');
w.addZoneLine('guildhall', 'shardslanding', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'stonebrunt', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'tox', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'twilight', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'eastkorlach', 2, 'give XYZ stone to zone to');
w.addZoneLine('guildhall', 'wallofslaughter', 2, 'give XYZ stone to zone to');

//DEPTHS OF DARKHOLLOW
//illsalin
w.addBiZoneLine('eastkorlach', 'illsalin');
//dreadspire
w.addBiZoneLine('drachnidhive', 'dreadspire');
w.addBiZoneLine('westkorlach', 'dreadspire');
//drachnidhive
w.addBiZoneLine('dreadspire', 'drachnidhive');
w.addBiZoneLine('westkorlach', 'drachnidhive');
//westkorlach
w.addBiZoneLine('westkorlach', 'drachnidhive');
//eastkorlach
w.addBiZoneLine('dreadspire', 'eastkorlach');
w.addBiZoneLine('drachnidhive', 'eastkorlach');
w.addBiZoneLine('eastkorlach', 'eastkorlach');
//corathus
w.addBiZoneLine('nektulosa', 'corathus');
w.addBiZoneLine('eastkorlach', 'corathus');
//nektulosa
w.addBiZoneLine('poknowledge', 'nektulosa');
w.addBiZoneLine('commonlands', 'nektulosa');
w.addBiZoneLine('corathus', 'nektulosa');
w.addBiZoneLine('neriaka', 'nektulosa');
w.addBiZoneLine('eastkorlach', 'nektulosa');


w.addZoneLine('airplane', 'ecommons', 2, 'jump off island to');


const adjacencyListKeys = Object.keys(w.adjacencyList);
for (let zone of adjacencyListKeys) {
  ['sro', 'nro'].forEach(function(dstZone) {
    w.addZoneLine(zone, dstZone, 2, 'use wizard port to');
  });
  ['sro', 'misty', 'mistythicket'].forEach(function(dstZone) {
    w.addZoneLine(zone, dstZone, 2, 'use druid port to');
  });
  ['guildlobby'].forEach(function(dstZone) {
    w.addZoneLine(zone, dstZone, 2, 'use lobby AA to');
  });
}

// ['sro', 'nro'].forEach(function(zone) {
//   w.addZoneLine('bazaar', zone, 2, 'use Tearel to teleport to');
// });


let searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let from = document.getElementById("from");
    let to = document.getElementById("to");
    let areWizardPortsEnabledChk = document.getElementById("areWizardPortsEnabled");
    areWizardPortsEnabled = areWizardPortsEnabledChk.checked;

    let areDruidPortsEnabledChk = document.getElementById("areDruidPortsEnabled");
    areDruidPortsEnabled = areDruidPortsEnabledChk.checked;
    console.log(areDruidPortsEnabled);

    let areGuildLobbyPortsEnabledChk = document.getElementById("areGuildLobbyPortsEnabled");
    areGuildLobbyPortsEnabled = areGuildLobbyPortsEnabledChk.checked;

    let isGuildLobbyAAEnabledChk = document.getElementById("isGuildLobbyAAEnabled");
    isGuildLobbyAAEnabled = isGuildLobbyAAEnabledChk.checked;


    if (from.value === "" || to.value === "" || from.value === undefined || to.value === undefined) {
      document.getElementById("results").innerHTML = "Please select a starting and ending zone.";
      return;
    }


    if (from.value === to.value) {
      document.getElementById("results").innerHTML = "You are already in <b>"+w.fullNames[from.value]+"</b>!";
      return;
    }


    let nav = w.findShortestPath(from.value, to.value);
    let out = ""
    out += "<ol>";

    out = " To get from <b>"+w.fullNames[from.value]+"</b> to <b>"+w.fullNames[to.value]+"</b>:<br>";
    out += "<ol>"

    let src = ""
    let adj = ""
    if (nav.length <2 ) {
      out += "</ol>"
      out += "No route found to get from <b>"+w.fullNames[from.value]+"</b> to <b>"+w.fullNames[to.value]+"</b>!";
      document.getElementById("results").innerHTML = out;
      return;
    }
    for (let i = 0; i < nav.length; i++) {
      if (src == "") {
        src = nav[i];
        continue;
      }
      adj = w.notes[src+nav[i]];
      if (adj == "") {
        adj = "zone to";
      }
      out += "<li>From <b>"+w.fullNames[src]+" ("+src+")</b> "+adj+" <b>"+w.fullNames[nav[i]]+" ("+nav[i]+")</b></li>";
      src = nav[i];
      adj = w.notes[""+src+nav[i]];

    }
    out += "</ol>"
    out += "You are now in <b>"+w.fullNames[to.value]+"</b>!<br>";
    document.getElementById("results").innerHTML = out;
});

let zonesList = document.getElementById("zones");

for (let zone of adjacencyListKeys) {
  let option = document.createElement("option");
  option.value = zone;
  option.text = w.fullNames[zone];
  zonesList.appendChild(option);
}

// const shortestPath = w.findShortestPath('qeynos', 'qeynos2');
// console.log(shortestPath);
// for (let shortName of shortestPath) {
//   console.log(w.fullNames[shortName], shortName);
// }

