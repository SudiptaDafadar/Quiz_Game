export const TOPICS = [
  { id: 'All', label: 'All Topics', icon: '✨', description: 'Mixed blitz across Marvel, GK, Video Games, Python & Science' },
  { id: 'Marvel', label: 'Marvel Universe', icon: '🛡️', description: 'Avengers, Infinity Saga, MCU lore, relics, and superheroes' },
  { id: 'GK', label: 'General Knowledge', icon: '🌍', description: 'World geography, landmark history, monuments & world records' },
  { id: 'Games', label: 'Video Games', icon: '🎮', description: 'Iconic gaming franchises, retro arcade history, RPGs & esports' },
  { id: 'Python', label: 'Python & Code', icon: '🐍', description: 'Python 3.12 syntax, data structures, and tricky edge cases' },
  { id: 'Science', label: 'Science & Cosmos', icon: '🔬', description: 'Astrophysics, chemistry, biology, and planetary science' }
];

export const QUESTIONS = [
  // ================= MARVEL UNIVERSE (MCU ONLY) =================
  {
    id: 'mcu-1',
    topic: 'Marvel',
    c: 'Stark AI',
    q: "What was Tony Stark's AI assistant called before Friday?",
    o: ['Ultron', 'J.A.R.V.I.S.', 'E.D.I.T.H.', 'Vision'],
    a: 1,
    e: 'J.A.R.V.I.S. (Just A Rather Very Intelligent System) was Tony Stark\'s original AI assistant before F.R.I.D.A.Y. was activated.'
  },
  {
    id: 'mcu-2',
    topic: 'Marvel',
    c: 'Relics & Shields',
    q: "What metal is Captain America's shield made from?",
    o: ['Adamantium', 'Uru', 'Vibranium', 'Carbonadium'],
    a: 2,
    e: 'Howard Stark forged Captain America\'s iconic circular shield from rare, vibration-absorbent Vibranium.'
  },
  {
    id: 'mcu-3',
    topic: 'Marvel',
    c: 'Avengers: Endgame',
    q: "Who lifts Thor's hammer to fight Thanos in Endgame?",
    o: ['Iron Man', 'Hulk', 'Captain America', 'Hawkeye'],
    a: 2,
    e: 'Captain America proves worthy in Avengers: Endgame, summoning Mjolnir with lightning strikes to fight Thanos.'
  },
  {
    id: 'mcu-4',
    topic: 'Marvel',
    c: 'Infinity Stones',
    q: "Which Infinity Stone does Doctor Strange protect?",
    o: ['Mind Stone', 'Time Stone', 'Power Stone', 'Soul Stone'],
    a: 1,
    e: 'Doctor Strange protects the emerald Time Stone, encased within the Eye of Agamotto.'
  },
  {
    id: 'mcu-5',
    topic: 'Marvel',
    c: 'Stark Family',
    q: "What is the first name of Tony Stark's wife?",
    o: ['Wanda', 'Natasha', 'Pepper', 'Maria'],
    a: 2,
    e: 'Virginia "Pepper" Potts is Tony Stark\'s longtime partner, CEO of Stark Industries, and wife.'
  },
  {
    id: 'mcu-6',
    topic: 'Marvel',
    c: 'Wakanda',
    q: "What is the name of T'Challa's genius sister?",
    o: ['Okoye', 'Shuri', 'Nakia', 'Ramonda'],
    a: 1,
    e: 'Princess Shuri is Wakanda\'s chief innovator who engineers Black Panther\'s kinetic nano-suits and weapons.'
  },
  {
    id: 'mcu-7',
    topic: 'Marvel',
    c: 'Spider-Man',
    q: "What is the first name of Peter Parker's best friend?",
    o: ['Harry', 'Flash', 'Ned', 'Miles'],
    a: 2,
    e: 'Ned Leeds is Peter Parker\'s trusted best friend and high-school "guy in the chair".'
  },
  {
    id: 'mcu-8',
    topic: 'Marvel',
    c: 'Guardians of the Galaxy',
    q: "What superhero name does Peter Quill use?",
    o: ['Nova', 'Star-Lord', 'Rocket', 'Starlight'],
    a: 1,
    e: 'Peter Quill leads the Guardians of the Galaxy under the galactic hero moniker Star-Lord.'
  },
  {
    id: 'mcu-9',
    topic: 'Marvel',
    c: 'Infinity War',
    q: "Which daughter does Thanos sacrifice for the Soul Stone?",
    o: ['Nebula', 'Gamora', 'Wanda', 'Mantis'],
    a: 1,
    e: 'Thanos tearfully sacrificed his adopted daughter Gamora off the cliffs of Vormir to obtain the Soul Stone.'
  },
  {
    id: 'mcu-10',
    topic: 'Marvel',
    c: 'Thor & Weapons',
    q: "What is the name of Thor's axe?",
    o: ['Mjolnir', 'Gungnir', 'Stormbreaker', 'Hofund'],
    a: 2,
    e: 'Thor, Rocket, and Groot forged Stormbreaker at Nidavellir with King Eitri to defeat Thanos.'
  },
  {
    id: 'mcu-11',
    topic: 'Marvel',
    c: 'Cosmic Planets',
    q: "On which planet is the Soul Stone found?",
    o: ['Titan', 'Vormir', 'Xandar', 'Morag'],
    a: 1,
    e: 'The Soul Stone was kept on planet Vormir, guarded by the Red Skull as the Stonekeeper.'
  },
  {
    id: 'mcu-12',
    topic: 'Marvel',
    c: 'Hulk Lore',
    q: "What type of radiation transformed Bruce Banner into the Hulk?",
    o: ['Solar radiation', 'Gamma radiation', 'Nuclear radiation', 'Cosmic radiation'],
    a: 1,
    e: 'Bruce Banner absorbed fatal doses of Gamma radiation during an experimental supersoldier project, creating the Hulk.'
  },
  {
    id: 'mcu-13',
    topic: 'Marvel',
    c: 'Captain America',
    q: "What nickname does Steve Rogers use for the Winter Soldier?",
    o: ['Sam', 'Tony', 'Bucky', 'Clint'],
    a: 2,
    e: 'Steve Rogers calls his childhood friend and WWII comrade James Buchanan Barnes "Bucky".'
  },
  {
    id: 'mcu-14',
    topic: 'Marvel',
    c: 'Avengers',
    q: "What is the first name of the Scarlet Witch?",
    o: ['Natasha', 'Wanda', 'Monica', 'Carol'],
    a: 1,
    e: 'Wanda Maximoff is the Scarlet Witch, wielding immense chaos magic and reality-warping powers.'
  },
  {
    id: 'mcu-15',
    topic: 'Marvel',
    c: 'Age of Ultron',
    q: "Which AI villain do Tony Stark and Bruce Banner create?",
    o: ['Vision', 'Ultron', 'J.A.R.V.I.S.', 'Zola'],
    a: 1,
    e: 'Tony Stark and Bruce Banner synthesized Ultron from the Mind Stone as a peacekeeping program, but it went rogue.'
  },
  {
    id: 'mcu-16',
    topic: 'Marvel',
    c: 'Thor: Ragnarok',
    q: "Who destroys Thor's hammer in Ragnarok?",
    o: ['Loki', 'Thanos', 'Hela', 'Surtur'],
    a: 2,
    e: 'Hela, the Asgardian Goddess of Death and Thor\'s older sister, shatters Mjolnir into pieces with one hand.'
  },
  {
    id: 'mcu-17',
    topic: 'Marvel',
    c: 'Avengers: Endgame',
    q: "Who rescues Tony Stark and Nebula from space in Endgame?",
    o: ['Thor', 'Captain Marvel', 'Doctor Strange', 'Rocket'],
    a: 1,
    e: 'Captain Marvel (Carol Danvers) discovers the drifting Benatar and flies Tony Stark and Nebula back to Earth.'
  },
  {
    id: 'mcu-18',
    topic: 'Marvel',
    c: 'The Blip',
    q: "Who snaps to bring everyone back in Endgame?",
    o: ['Tony Stark', 'Thor', 'Bruce Banner (Hulk)', 'Steve Rogers'],
    a: 2,
    e: 'Bruce Banner (Smart Hulk) wears the Nano Gauntlet and snaps his fingers, taking the gamma radiation hit to revive everyone.'
  },
  {
    id: 'mcu-19',
    topic: 'Marvel',
    c: 'Ant-Man',
    q: "What is Ant-Man's real name?",
    o: ['Hank Pym', 'Scott Lang', 'Luis', 'Darren Cross'],
    a: 1,
    e: 'Scott Lang becomes the modern Ant-Man after being recruited and trained by Hank Pym.'
  },
  {
    id: 'mcu-20',
    topic: 'Marvel',
    c: 'Captain Marvel',
    q: "What is the name of the cat-like alien that scratches Nick Fury's eye?",
    o: ['Rocket', 'Goose', 'Cosmo', 'Flerken'],
    a: 1,
    e: 'Goose looks like a normal ginger cat, but is actually a dangerous alien Flerken who permanently blinded Nick Fury\'s eye.'
  },

  // ================= GENERAL KNOWLEDGE (GK) =================
  {
    id: 'gk-1',
    topic: 'GK',
    c: 'Geography',
    q: 'What is the capital city of Australia?',
    o: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    a: 2,
    e: 'Canberra was chosen as the compromise capital of Australia in 1908 to resolve the fierce rivalry between Sydney and Melbourne.'
  },
  {
    id: 'gk-2',
    topic: 'GK',
    c: 'Geography',
    q: 'Which is the largest desert in the world by area?',
    o: ['Sahara Desert', 'Antarctic Polar Desert', 'Arabian Desert', 'Gobi Desert'],
    a: 1,
    e: 'By scientific definition (precipitation < 250mm/year), Antarctica is the world\'s largest desert, spanning ~14.2 million square kilometers.'
  },
  {
    id: 'gk-3',
    topic: 'GK',
    c: 'History',
    q: 'In which year did the Apollo 11 lunar module land on the Moon?',
    o: ['1967', '1969', '1971', '1973'],
    a: 1,
    e: 'Neil Armstrong and Buzz Aldrin stepped onto the lunar surface on July 20, 1969, during the Apollo 11 mission.'
  },
  {
    id: 'gk-4',
    topic: 'GK',
    c: 'World Records',
    q: 'What is the deepest known location in the Earth\'s oceans?',
    o: ['Java Trench', 'Challenger Deep', 'Puerto Rico Trench', 'Tonga Trench'],
    a: 1,
    e: 'Challenger Deep, located in the southern end of the Mariana Trench, plunges nearly 10,928 meters (35,853 feet) below sea level.'
  },
  {
    id: 'gk-5',
    topic: 'GK',
    c: 'Literature & Art',
    q: 'Who painted the iconic masterpiece "The Starry Night"?',
    o: ['Claude Monet', 'Pablo Picasso', 'Vincent van Gogh', 'Salvador Dalí'],
    a: 2,
    e: 'Vincent van Gogh painted The Starry Night in June 1889 while staying at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence.'
  },
  {
    id: 'gk-6',
    topic: 'GK',
    c: 'World Trivia',
    q: 'Which country has the most natural lakes in the world?',
    o: ['Russia', 'Canada', 'Finland', 'United States'],
    a: 1,
    e: 'Canada has over 2 million lakes, containing more than 60% of all natural lakes in the world.'
  },
  {
    id: 'gk-7',
    topic: 'GK',
    c: 'World History',
    q: 'Which ancient wonder of the world is the only one still largely intact?',
    o: ['Colossus of Rhodes', 'Hanging Gardens of Babylon', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'],
    a: 2,
    e: 'The Great Pyramid of Giza (built for Pharaoh Khufu circa 2560 BC) is the oldest and only surviving ancient wonder.'
  },
  {
    id: 'gk-8',
    topic: 'GK',
    c: 'Geography',
    q: 'Which country features a non-quadrilateral (two-triangle) national flag?',
    o: ['Nepal', 'Switzerland', 'Vatican City', 'Bhutan'],
    a: 0,
    e: 'Nepal has the only modern sovereign state flag that is not a four-sided quadrilateral, consisting of two stacked triangular pennants.'
  },

  // ================= VIDEO GAMES =================
  {
    id: 'game-1',
    topic: 'Games',
    c: 'Gaming History',
    q: 'What company originally began in 1889 as a manufacturer of handmade Hanafuda playing cards?',
    o: ['Sega', 'Sony', 'Nintendo', 'Capcom'],
    a: 2,
    e: 'Fusajiro Yamauchi founded Nintendo Koppai in Kyoto, Japan, in 1889 to craft handmade traditional Hanafuda playing cards before pivoting into toys and video games.'
  },
  {
    id: 'game-2',
    topic: 'Games',
    c: 'Bestsellers',
    q: 'Which game is officially recognized as the best-selling video game of all time (over 300M copies)?',
    o: ['Grand Theft Auto V', 'Tetris', 'Minecraft', 'Wii Sports'],
    a: 2,
    e: 'Created by Markus "Notch" Persson and Mojang Studios, Minecraft surpassed 300 million copies sold across all platforms by 2023.'
  },
  {
    id: 'game-3',
    topic: 'Games',
    c: 'Iconic Characters',
    q: 'What is the real name of the green-clad sword-wielding protagonist in "The Legend of Zelda"?',
    o: ['Zelda', 'Link', 'Ganon', 'Navi'],
    a: 1,
    e: 'Link is the hero of Hyrule; Princess Zelda is the royal bearer of the Triforce of Wisdom who frequently guides or needs rescue.'
  },
  {
    id: 'game-4',
    topic: 'Games',
    c: 'Arcade Lore',
    q: 'What was the original Japanese name of "Pac-Man" before it was adapted for Western distribution?',
    o: ['Puck Man', 'Muncher', 'Ghost Hunter', 'Dot Chomper'],
    a: 0,
    e: 'Namco designed it as "Puck Man" (from the Japanese onomatopoeia "paku paku" for mouth opening/closing). Midway changed it to "Pac-Man" to prevent vandalism.'
  },
  {
    id: 'game-5',
    topic: 'Games',
    c: 'RPG & Souls',
    q: 'Which Japanese development studio is renowned for creating "Dark Souls", "Bloodborne", and "Elden Ring"?',
    o: ['Square Enix', 'FromSoftware', 'Konami', 'Atlus'],
    a: 1,
    e: 'Hidetaka Miyazaki and FromSoftware defined the modern action-RPG genre with their demanding combat and intricate environmental storytelling.'
  },
  {
    id: 'game-6',
    topic: 'Games',
    c: 'Shooters',
    q: 'In the Halo franchise, what is Master Chief\'s military service tag and number?',
    o: ['Noble-6', 'Spartan-117 (John-117)', 'Ghost-007', 'Titan-404'],
    a: 1,
    e: 'Master Chief is Master Chief Petty Officer John-117, a cornerstone Spartan-II commando in humanity\'s war against the Covenant.'
  },
  {
    id: 'game-7',
    topic: 'Games',
    c: 'Pokemon',
    q: 'What is Pikachu\'s official number in the National Pokédex?',
    o: ['#001', '#007', '#025', '#151'],
    a: 2,
    e: 'Pikachu is entry #025 in the National Pokédex. Bulbasaur is #001 and Mew is #151.'
  },
  {
    id: 'game-8',
    topic: 'Games',
    c: 'Console Wars',
    q: 'Which gaming console holds the record as the highest-selling home console of all time (~155M units)?',
    o: ['PlayStation 2', 'Nintendo Switch', 'PlayStation 4', 'Xbox 360'],
    a: 0,
    e: 'Sony\'s PlayStation 2, released in 2000, sold over 155 million units worldwide thanks in part to its affordable built-in DVD player.'
  },

  // ================= PYTHON & CODE =================
  {
    id: 'py-1',
    topic: 'Python',
    c: 'Syntax',
    q: 'Which keyword is used to define a standard function in Python?',
    code: 'def calculate_score(points):\n    return points * 2',
    o: ['func', 'def', 'function', 'lambda'],
    a: 1,
    e: "'def' starts a standard function definition. 'lambda' is strictly reserved for anonymous single-expression inline functions."
  },
  {
    id: 'py-2',
    topic: 'Python',
    c: 'Data Structures',
    q: 'Which of the following built-in data types is immutable in Python?',
    o: ['list', 'dict', 'set', 'tuple'],
    a: 3,
    e: 'Tuples cannot be modified after creation (immutable); lists, dictionaries, and sets are mutable.'
  },
  {
    id: 'py-3',
    topic: 'Python',
    c: 'Slicing',
    q: 'What does the slice expression [1, 2, 3, 4][1:3] evaluate to?',
    code: 'numbers = [1, 2, 3, 4]\nprint(numbers[1:3])',
    o: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3]', '[1, 2]'],
    a: 2,
    e: 'Slices take [start:stop]. Index 1 is 2, index 2 is 3, stop index 3 is non-inclusive, yielding [2, 3].'
  },
  {
    id: 'py-4',
    topic: 'Python',
    c: 'Tricky Edge Cases',
    q: 'What does the expression 0.1 + 0.2 == 0.3 evaluate to in standard Python?',
    code: '0.1 + 0.2 == 0.3',
    o: ['True', 'False', 'TypeError', 'None'],
    a: 1,
    e: 'Due to IEEE 754 floating-point binary representation, 0.1 + 0.2 evaluates to approximately 0.30000000000000004, so the equality check returns False.'
  },
  {
    id: 'py-5',
    topic: 'Python',
    c: 'Operators',
    q: 'What does the // operator represent in Python 3?',
    code: '7 // 2  # returns 3',
    o: ['Single-line comment', 'Floor division', 'Modulus remainder', 'Exponentiation'],
    a: 1,
    e: '// performs division and rounds down to the nearest lower mathematical integer (floor).'
  },
  {
    id: 'py-6',
    topic: 'Python',
    c: 'Internals',
    q: 'What is the evaluated result of bool("False") in Python?',
    code: 'result = bool("False")',
    o: ['False', 'True', 'ValueError', 'None'],
    a: 1,
    e: 'Any non-empty string in Python evaluates to truthy (True), regardless of whether its content spells "False".'
  },
  {
    id: 'py-7',
    topic: 'Python',
    c: 'Collections',
    q: 'What is the length of len(set([1, 1, 2, 3, 3]))?',
    code: 'items = set([1, 1, 2, 3, 3])\nprint(len(items))',
    o: ['5', '3', '2', 'IndexError'],
    a: 1,
    e: 'Python sets automatically deduplicate elements, reducing the collection to {1, 2, 3} with a length of 3.'
  },
  {
    id: 'py-8',
    topic: 'Python',
    c: 'Sequences',
    q: 'What does the slice expression [1, 2, 3][::-1] return?',
    code: 'arr = [1, 2, 3]\nprint(arr[::-1])',
    o: ['[1, 2, 3]', '[3, 2, 1]', 'IndexError', '[-1, -2, -3]'],
    a: 1,
    e: 'A slice step of -1 steps backwards from end to beginning, reversing the sequence into [3, 2, 1].'
  },

  // ================= SCIENCE & COSMOS =================
  {
    id: 'sci-1',
    topic: 'Science',
    c: 'Astronomy',
    q: 'Which planet in our solar system has the highest number of confirmed moons?',
    o: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    a: 1,
    e: 'Saturn leads with 146 confirmed moons recognized by the International Astronomical Union, surpassing Jupiter\'s 95.'
  },
  {
    id: 'sci-2',
    topic: 'Science',
    c: 'Chemistry',
    q: 'What is the chemical symbol for the element Gold?',
    o: ['Gd', 'Ag', 'Au', 'Pt'],
    a: 2,
    e: 'Gold\'s chemical symbol is Au, derived from the Latin word "Aurum", which means shining dawn.'
  },
  {
    id: 'sci-3',
    topic: 'Science',
    c: 'Physics',
    q: 'What is the approximate speed of light in a vacuum?',
    o: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '1,000,000 km/s'],
    a: 0,
    e: 'Light travels at exactly 299,792,458 meters per second in a vacuum (approx 300,000 kilometers per second).'
  },
  {
    id: 'sci-4',
    topic: 'Science',
    c: 'Biology',
    q: 'Which organelle is universally referred to as the powerhouse of the cell?',
    o: ['Ribosome', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus'],
    a: 1,
    e: 'Mitochondria produce the majority of the cell\'s supply of adenosine triphosphate (ATP), used as a chemical energy source.'
  },
  {
    id: 'sci-5',
    topic: 'Science',
    c: 'Earth Science',
    q: 'What is the hardest naturally occurring mineral substance on Earth according to the Mohs scale?',
    o: ['Quartz', 'Corundum', 'Diamond', 'Topaz'],
    a: 2,
    e: 'Diamond is rated a maximum 10 on the Mohs hardness scale due to its rigid tetrahedral covalent carbon crystal lattice.'
  }
];
