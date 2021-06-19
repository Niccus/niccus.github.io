
const palette_fields = ["group","name","outer_border","outer_fill","mid_border","inner_fill","inner_gear"];
const palette_labels = {"group":"Group/Team","name":"Label","outer_border":"Outer Border","outer_fill":"Outer Fill","mid_border":"Midborder","inner_fill":"Inner Fill","inner_gear":"Inner gear"};

var palettes_raw = [
  {
    "group": "Core Mechanics",
    "name": "Core Values",
    "outer_border": "#b42b29",
    "outer_fill": "#f6b235",
    "mid_border": "#b42b29",
    "inner_fill": "#ffffff",
    "inner_gear": "#b42b29"
  },
  {
    "group": "Core Mechanics",
    "name": "Travel Gear",
    "outer_border": "#12573B",
    "outer_fill": "#1D955E",
    "mid_border": "#8F7201",
    "inner_fill": "#533900",
    "inner_gear": "#FFF568"
  },
  {
    "group": "Core Mechanics",
    "name": "Maximized",
    "outer_border": "#03A78E",
    "outer_fill": "#000404",
    "mid_border": "#03A78E",
    "inner_fill": "#000404",
    "inner_gear": "#00FFD8"
  },
  {
    "group": "Seattle Garages",
    "name": "Tritone",
    "outer_border": "#2b4075",
    "outer_fill": "#ff2423",
    "mid_border": "#2b4075",
    "inner_fill": "#ffffff",
    "inner_gear": "#2b4075"
  },
  {
    "group": "Baltimore Crabs",
    "name": "Old Bay",
    "outer_border": "#593037",
    "outer_fill": "#cd7672",
    "mid_border": "#593037",
    "inner_fill": "#f7630c",
    "inner_gear": "#593037"
  },
  {
    "group": "Miami Dale",
    "name": "¡Dale!",
    "outer_border": "#bf00ff",
    "outer_fill": "#fee020",
    "mid_border": "#33ffff",
    "inner_fill": "#ff69b4",
    "inner_gear": "#33ffff"
  },
  {
    "group": "Chicago Firefighters",
    "name": "Home Station",
    "outer_border": "#400000",
    "outer_fill": "#8c2a3e",
    "mid_border": "#400000",
    "inner_fill": "#fce100",
    "inner_gear": "#400000"
  },
  {
    "group": "Boston Flowers",
    "name": "Full Bloom",
    "outer_border": "#9755a5",
    "outer_fill": "#f7d1ff",
    "mid_border": "#4e5229",
    "inner_fill": "#ec1c24",
    "inner_gear": "#4e5229"
  },
  {
    "group": "Hawai'i Fridays",
    "name": "Late Afternoon",
    "outer_border": "#11a6c2",
    "outer_fill": "#a4f566",
    "mid_border": "#e67575",
    "inner_fill": "#3ee652",
    "inner_gear": "#e67575"
  },
  {
    "group": "Atlantis Georgias",
    "name": "Coral Peach",
    "outer_border": "#ffca18",
    "outer_fill": "#8cfffb",
    "mid_border": "#ffca18",
    "inner_fill": "#54cab0",
    "inner_gear": "#ffca18"
  },
  {
    "group": "Breckenridge Jazz Hands",
    "name": "Pocket Aces",
    "outer_border": "#4e084d",
    "outer_fill": "#7ba9d7",
    "mid_border": "#4e084d",
    "inner_fill": "#f3ca40",
    "inner_gear": "#4e084d"
  },
  {
    "group": "Tokyo Lift",
    "name": "Legscraper Lights",
    "outer_border": "#90147b",
    "outer_fill": "#e536c8",
    "mid_border": "#90147b",
    "inner_fill": "#73feed",
    "inner_gear": "#90147b"
  },
  {
    "group": "San Francisco Lovers",
    "name": "Up Close & Personal",
    "outer_border": "#681800",
    "outer_fill": "#d2264a",
    "mid_border": "#681800",
    "inner_fill": "#f193b3",
    "inner_gear": "#681800"
  },
  {
    "group": "Yellowstone Magic",
    "name": "Heaven and Earth",
    "outer_border": "#ffaec9",
    "outer_fill": "#bf0043",
    "mid_border": "#99d9ea",
    "inner_fill": "#fff200",
    "inner_gear": "#99d9ea"
  },
  {
    "group": "New York Millennials",
    "name": "Called Home",
    "outer_border": "#585858",
    "outer_fill": "#6bccf8",
    "mid_border": "#585858",
    "inner_fill": "#ffaec8",
    "inner_gear": "#585858"
  },
  {
    "group": "New York Millennials",
    "name": "Literally everyone saw this",
    "outer_border": "#dddddd",
    "outer_fill": "#8becf8",
    "mid_border": "#ffffff",
    "inner_fill": "#ffaec8",
    "inner_gear": "#ffffff"
  },
  {
    "group": "Kansas City Breath Mints",
    "name": "Fresh Tints",
    "outer_border": "#09852c",
    "outer_fill": "#0ed145",
    "mid_border": "#ffffff",
    "inner_fill": "#ec1c24",
    "inner_gear": "#ffffff"
  },
  {
    "group": "Canada Moist Talkers",
    "name": "Wet Paint",
    "outer_border": "#035597",
    "outer_fill": "#3b97d3",
    "mid_border": "#ed1c24",
    "inner_fill": "#ffffff",
    "inner_gear": "#ed1c24"
  },
  {
    "group": "Ohio Worms",
    "name": "Earthen Hues",
    "outer_border": "#b97a56",
    "outer_fill": "#f0ba9b",
    "mid_border": "#5d3d2b",
    "inner_fill": "#b97a56",
    "inner_gear": "#5d3d2b"
  },
  {
    "group": "Philly Pies",
    "name": "Pie and Dye",
    "outer_border": "#009f8c",
    "outer_fill": "#ffcd4c",
    "mid_border": "#af0005",
    "inner_fill": "#ffcc1b",
    "inner_gear": "#af0005"
  },
  {
    "group": "Houston Spies",
    "name": "Subtle Shades",
    "outer_border": "#67556b",
    "outer_fill": "#040404",
    "mid_border": "#67556b",
    "inner_fill": "#040404",
    "inner_gear": "#67556b"
  },
  {
    "group": "Houston Spies",
    "name": "Full Stealth (Discord Dark)",
    "outer_border": "#37393e",
    "outer_fill": "#000000",
    "mid_border": "#37393e",
    "inner_fill": "#000000",
    "inner_gear": "#37393e",
    "bg": "#000000",
    "transparency": "#000000"
  },
  {
    "group": "Houston Spies",
    "name": "Full Stealth (Discord Light)",
    "outer_border": "#ffffff",
    "outer_fill": "#000000",
    "mid_border": "#ffffff",
    "inner_fill": "#000000",
    "inner_gear": "#ffffff",
    "bg": "#000000",
    "transparency": "#000000"
  },
  {
    "group": "Hellmouth Sunbeams",
    "name": "Luminance",
    "outer_border": "#ffc90d",
    "outer_fill": "#fff9ab",
    "mid_border": "#ffc70c",
    "inner_fill": "#fce100",
    "inner_gear": "#ffc70c"
  },
  {
    "group": "Dallas Steaks",
    "name": "Prime Cut",
    "outer_border": "#585858",
    "outer_fill": "#c3c3c3",
    "mid_border": "#fdeca6",
    "inner_fill": "#ec1c24",
    "inner_gear": "#fdeca6"
  },
  {
    "group": "Charleston Shoe Thieves",
    "name": "Paint Drip",
    "outer_border": "#156a96",
    "outer_fill": "#ffce0a",
    "mid_border": "#156a96",
    "inner_fill": "#fdfafb",
    "inner_gear": "#156a96"
  },
  {
    "group": "LA Unlimited Tacos",
    "name": "Pepito",
    "outer_border": "#0acc00",
    "outer_fill": "#5b0070",
    "mid_border": "#000000",
    "inner_fill": "#ffae00",
    "inner_gear": "#000000"
  },
  {
    "group": "Hades Tigers",
    "name": "Tiger's Stripes",
    "outer_border": "#c32229",
    "outer_fill": "#002229",
    "mid_border": "#c32229",
    "inner_fill": "#faa623",
    "inner_gear": "#c32229"
  },
  {
    "group": "Mexico City Wild Wings",
    "name": "Central Flats",
    "outer_border": "#006847",
    "outer_fill": "#c64000",
    "mid_border": "#ffffff",
    "inner_fill": "#d15700",
    "inner_gear": "#ffffff"
  },
  {
    "group": "Society Data Witches",
    "name": "Umbral Sheets",
    "outer_border": "#bc60e2",
    "outer_fill": "#180040",
    "mid_border": "#671a8d",
    "inner_fill": "#ffffff",
    "inner_gear": "#271851"
  },
  {
    "group": "Pride",
    "name": "Agender",
    "outer_border": "#000000",
    "outer_fill": "#818285",
    "mid_border": "#BBDA80",
    "inner_gear": "#000000",
    "inner_fill": "#FFFFFF"
  },
  {
    "group": "Pride",
    "name": "Aromantic",
    "outer_border": "#000000",
    "outer_fill": "#939598",
    "mid_border": "#FFFFFF",
    "inner_gear": "#C5DF9B",
    "inner_fill": "#59A34F"
  },
  {
    "group": "Pride",
    "name": "Asexual",
    "outer_border": "#642165",
    "outer_fill": "#939598",
    "mid_border": "#642165",
    "inner_gear": "#642165",
    "inner_fill": "#FFFFFF"
  },
  {
    "group": "Pride",
    "name": "Bisexual",
    "outer_border": "#92278F",
    "outer_fill": "#D91B5C",
    "mid_border": "#92278F",
    "inner_gear": "#92278F",
    "inner_fill": "#283891"
  },
  {
    "group": "Pride",
    "name": "Genderfluid",
    "outer_border": "#000000",
    "outer_fill": "#3F4CA0",
    "mid_border": "#BC47BB",
    "inner_gear": "#FFFFFF",
    "inner_fill": "#F175A3"
  },
  {
    "group": "Pride",
    "name": "Genderqueer",
    "outer_border": "#E2EAF1",
    "outer_fill": "#49833D",
    "mid_border": "#E2EAF1",
    "inner_gear": "#E2EAF1",
    "inner_fill": "#A981BA"
  },
  {
    "group": "Pride",
    "name": "Intersex",
    "outer_border": "#7D3B9B",
    "outer_fill": "#FFF200",
    "mid_border": "#7D3B9B",
    "inner_gear": "#7D3B9B",
    "inner_fill": "#FFF200"
  },
  {
    "group": "Pride",
    "name": "Lesbian",
    "outer_border": "#D62D27",
    "outer_fill": "#F89B58",
    "mid_border": "#E2EAF1",
    "inner_gear": "#A41F65",
    "inner_fill": "#D261A5"
  },
  {
    "group": "Pride",
    "name": "Nonbinary",
    "outer_border": "#000000",
    "outer_fill": "#895EA8",
    "mid_border": "#FFFFFF",
    "inner_gear": "#3A3A3C",
    "inner_fill": "#F7EF3D"
  },
  {
    "group": "Pride",
    "name": "Pansexual",
    "outer_border": "#FFD53F",
    "outer_fill": "#EC008C",
    "mid_border": "#FFD53F",
    "inner_gear": "#FFD53F",
    "inner_fill": "#00AEEF"
  },
  {
    "group": "Pride",
    "name": "Polysexual",
    "outer_border": "#49B965",
    "outer_fill": "#D74398",
    "mid_border": "#49B965",
    "inner_gear": "#49B965",
    "inner_fill": "#448BCA"
  },
  {
    "group": "Pride",
    "name": "Plural",
    "outer_border": "#A957C5",
    "outer_fill": "#5CDD5C",
    "mid_border": "#FEF56A",
    "inner_gear": "#BDBDEF",
    "inner_fill": "#607EC6"
  },
  {
    "group": "Pride",
    "name": "Transgender (Blue Fill)",
    "outer_border": "#F5A9B8",
    "outer_fill": "#6CCFF6",
    "mid_border": "#F5A9B8",
    "inner_gear": "#F5A9B8",
    "inner_fill": "#FFFFFF"
  },
  {
    "group": "Pride",
    "name": "Transgender (Pink Fill)",
    "outer_border": "#6CCFF6",
    "outer_fill": "#F5A9B8",
    "mid_border": "#6CCFF6",
    "inner_gear": "#6CCFF6",
    "inner_fill": "#FFFFFF"
  }
]

function arr_shuf(arr) {
  let l = arr.length;
  let temp; let j;
  for(let i = 0; i < (l - 1); ++i) {
    j = i + Math.floor(Math.random() * (l - i));
    if(i != j) {
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}

//Regroup, shuffle, and ungroup
let temp_chunks = [];
let temp_compare = "";
let i = 0;
while(i < palettes_raw.length) {
  temp_compare = palettes_raw[i].group;
  let temp_chunk = [];

  while(palettes_raw[i] && temp_compare === palettes_raw[i].group) {
    temp_chunk.push(palettes_raw[i]);
    ++i;
  }

  temp_chunks.push(temp_chunk);
}

arr_shuf(temp_chunks);

var palettes = [];
for(let i = 0; i < temp_chunks.length; ++i) {
  for(let j = 0; j < temp_chunks[i].length; ++j) {
    palettes.push(temp_chunks[i][j]);
  }
}