/* Cedarfield After Dark — shared world data.
   Fan-made companion to Harlan Coben's "The Stranger" (2015). No text from the novel is reproduced here. */
window.CF = window.CF || {};

CF.BOOK = { title: 'The Stranger', author: 'Harlan Coben', year: 2015, chapters: 56,
  copyright: 'In copyright (© 2015 Harlan Coben). This companion quotes nothing from the novel; every summary and prompt is written fresh, and passages are cited by chapter and scene so you can find them in any edition.' };

/* Chapter index: my own spoiler-light labels. Shown only up to the reader's current chapter. */
CF.CHAPTERS = [
 [1,'Draft Night','Adam'],[2,'The Last Pick','Adam'],[3,'Novelty Funsy','Adam'],[4,'Gag Gifts','Adam'],
 [5,'Daddy Eggs','Adam'],[6,'The Away Sideline','Adam'],[7,'The Cone of Honesty','Adam'],[8,'Red Lobster, Beachwood','The stranger'],
 [9,'The Minefield','Adam'],[10,'Give Me Until Tomorrow','Adam'],[11,'Hummel Figurines','Adam'],[12,'The Back Table','Adam'],
 [13,'Room 233','Adam'],[14,'A Visitor for Heidi','Heidi'],[15,'Toll Records','Adam'],[16,'Call Me Gush','Adam'],
 [17,'Four Days Before the Wedding','The stranger'],[18,'Face Against the Glass','Adam'],[19,'The Uniform','Adam'],[20,'LoveMyFamily','Adam'],
 [21,'Big Bob on Fire','Bob'],[22,'The Press Conference','Adam'],[23,'Apartment 9B','Adam'],[24,'The Picnic Table','Adam'],
 [25,'The Smell Test','Adam'],[26,'A Rug from Ravi','Johanna'],[27,'Friends and Neighbors','Adam'],[28,'The Forty-Yard Dash','Dan'],
 [29,"Bonner's Notebook",'Adam'],[30,'BARISTA77','Adam'],[31,'Room 715','Kuntz'],[32,'The Swamps of Jersey','Adam'],
 [33,'Lunch with the Girls','Johanna'],[34,"Mom's a Mom",'Adam'],[35,"Almost Doesn't Count",'Adam'],[36,"Eduardo's Garage",'Chris'],
 [37,'Holiday Party','Adam'],[38,'Starsky and Hutch','Johanna'],[39,'Police at the Door','Adam'],[40,'The Study on Park Avenue','Kuntz'],
 [41,'Interview Room','Adam'],[42,'So Hum','Gabrielle'],[43,'Behind the Bleachers','Adam'],[44,'Off the Record','Adam'],
 [45,'He Knows','Chris'],[46,'Aunt Johanna','Johanna'],[47,'The Tail','Adam'],[48,'Lake Charmaine','Adam'],
 [49,'The Second DVD','Johanna'],[50,'Called to the Office','Adam / Thomas'],[51,'The Bike Chain','Adam'],[52,'Eight Rounds','Kuntz / Johanna'],
 [53,'The Basement','Adam'],[54,'Beth Lutheran Lot','Adam'],[55,'Mahlon Dickerson','Adam'],[56,'Six Months Later','Adam']
];

/* Rooms — each a place in Cedarfield (or near it). */
CF.ROOMS = {
  hall:     { name: 'American Legion Hall', short: 'Legion Hall', subject: 'Main room · your ledger', x: 50, y: 52,
              caption: 'Draft night. Folding chairs in a circle, neon beer signs, a sticky bar, and a stranger who knows something.',
              blurb: 'Where it starts. Set your chapter, check your ledger, collect what you have found, and talk to Dot.' },
  office:   { name: "Adam's Law Office", short: 'Law Office', subject: 'Close reading & style', x: 76, y: 24,
              caption: 'A four-storey glass box on Midland Avenue, Paramus. One desk lamp still on after everyone has gone.',
              blurb: 'Read like a lawyer reads a contract: slowly, for what each sentence is doing. Prose rhythm, voice, point of view, chapter endings.' },
  classroom:{ name: 'Room 233, Cedarfield High', short: 'Room 233', subject: 'Themes & ideas', x: 22, y: 72,
              caption: 'A 1970s school gone grey, aqua trim fading. Corinne’s homeroom, with a substitute at the desk.',
              blurb: 'Secrets, surveillance, the suburban dream, parenthood, money, trust. Track the ideas the novel keeps returning to.' },
  records:  { name: 'Town Hall Records Room', short: 'Records Room', subject: 'History & the author’s life', x: 88, y: 50,
              caption: 'Dented filing cabinets, a wall clock that runs fast, and the ranking that made Cedarfield proud.',
              blurb: 'Coben’s New Jersey, the internet of 2015, eminent domain, youth sport, and the real history behind the fiction.' },
  stacks:   { name: 'Public Library Stacks', short: 'Library Stacks', subject: 'Sources & influences', x: 9, y: 44,
              caption: 'Modern library, quiet aisle, one flickering tube. Somebody has left a mythology book open on a cart.',
              blurb: 'What this novel is in conversation with: Ibsen, Hawthorne, Conan Doyle’s blackmailer, suburban fiction, and Coben’s own shelf.' },
  turnpike: { name: 'The Turnpike', short: 'Turnpike', subject: 'Setting & geography', x: 92, y: 80,
              caption: 'Toll plaza lights at 2 a.m. Every journey in this book leaves a record somewhere.',
              blurb: 'Bergen County to Beachwood, Ohio, to a lake past the Delaware. Maps, distances, places and what they mean.' },
  field:    { name: 'The Lacrosse Field', short: 'Lacrosse Field', subject: 'Philosophy & ethics', x: 30, y: 26,
              caption: 'New turf under floodlights. Parents in folding chairs, fathers with crossed arms, a referee everyone is shouting at.',
              blurb: 'Is it right to tell? What do we owe family versus everyone else? Weigh the novel’s dilemmas with real ethical tools.' },
  board:    { name: 'The Incident Board', short: 'Incident Board', subject: 'Writing craft', x: 64, y: 82,
              caption: 'A corkboard in a station back office: photos, index cards, red string, a coffee ring.',
              blurb: 'How a Coben thriller is built: braided strands, short chapters, planted clues, misdirection and the turn.' },
  diner:    { name: 'The All-Night Diner', short: 'Diner', subject: 'Art & music', x: 12, y: 16,
              caption: 'Chrome, vinyl booths and a jukebox that only plays the seventies. The coffee is free if you look tired enough.',
              blurb: 'Seventies cover-band songs, Springsteen, suburban photography, night painting. Make the book’s soundtrack and colours.' },
  kitchen:  { name: 'The Price Kitchen', short: 'Price Kitchen', subject: 'Food & making', x: 42, y: 88,
              caption: 'A granite island the colour of strong coffee, homework spread across the table, every light in the house left on.',
              blurb: 'What people eat in this novel says who they are. Cook it, make things, and talk about it at the table.' },
  driveway: { name: 'The Dark Driveway', short: 'Driveway', subject: 'Reflective journal', x: 60, y: 8,
              caption: 'Adam’s car in the driveway, engine off. Upstairs, both boys’ windows glow.',
              blurb: 'Sit in the car before you go inside. Your private journal, predictions, moods and the letters you would never send.' }
};
CF.ROOM_ORDER = ['hall','office','classroom','records','stacks','turnpike','field','board','diner','kitchen','driveway'];
CF.STUDY_ROOMS = CF.ROOM_ORDER.slice(1);
CF.LINKS = {
  hall: ['office','field','diner','driveway','board'],
  office: ['hall','records','board','driveway'],
  classroom: ['field','stacks','kitchen'],
  records: ['office','stacks','turnpike'],
  stacks: ['records','classroom','diner'],
  turnpike: ['records','driveway','board'],
  field: ['hall','classroom','kitchen','diner'],
  board: ['hall','office','turnpike','kitchen'],
  diner: ['hall','stacks','field'],
  kitchen: ['classroom','field','board','driveway'],
  driveway: ['hall','office','kitchen','turnpike']
};

/* Secret rooms. Answers stored as hashes so view-source doesn't spoil them. */
CF.SECRETS = {
  burner:  { name: 'The Burner Phone', where: 'office', minCh: 30, key: 'Brass key',
             riddle: 'Seven letters a husband and wife picked because the word meant nothing to them. Behind a counter it hands you your coffee. Add two of the same digit and it guards a phone bill.',
             hint: 'Chapter 30. Think about how they chose a password.', hash: 'h_barista' },
  darkroom:{ name: 'The Darkroom', where: 'diner', minCh: 37, key: 'Red-glass key',
             riddle: 'Corinne called me a greatest-hits record of other people’s lives with the bad tracks cut. Adam joked that if you believed me you would wonder why anyone needs a prescription. Where did he find the holiday party?',
             hint: 'Chapter 37. A social network.', hash: 'h_facebook' },
  server:  { name: 'The Server Closet', where: 'board', minCh: 17, key: 'Copper key',
             riddle: 'Every house on the internet has one. The site promised to forget it. A man behind the curtain wrote it down, and a bride learned who really posted the video from four numbers and three dots.',
             hint: 'Chapter 17. Two words, the second is a place.', hash: 'h_ipaddress' },
  lockbox: { name: "The Board's Lockbox", where: 'field', minCh: 27, key: 'Steel key',
             riddle: 'In honest books the first digit is a one almost a third of the time and a nine barely one time in twenty. People who invent figures forget me. Forensic accountants do not. Whose law am I?',
             hint: 'A physicist named it in 1938. Surname only.', hash: 'h_benford' },
  storage: { name: 'The Storage Unit', where: 'kitchen', minCh: 5, key: 'Tin key',
             riddle: 'Scrambled with milk, a yellow condiment and a hard Italian cheese. Declared lame at about seven, brought back when a coach said protein. Name the dish the way its cook does, though its eater asks him not to.',
             hint: 'Chapter 5. Two words.', hash: 'h_daddyeggs' },
  motel:   { name: 'The Motel Room', where: 'turnpike', minCh: 48, key: 'Plastic keyfob',
             riddle: 'I am a narrow toll bridge from New Jersey into Pennsylvania, still privately owned, named for the family who ran a ferry here before me. Give my first word.',
             hint: 'Chapter 48. The bridge Gabrielle crosses.', hash: 'h_dingmans' },
  woods:   { name: 'The Woods Trail', where: 'driveway', minCh: 55, key: 'Iron key', curios: true,
             riddle: 'This path has no riddle. It opens when your satchel holds ten curios, picked up from the paintings in the rooms.',
             hint: 'Look closely at every banner. Something small in each picture can be picked up.' }
};
CF.ANSWERS = { h_barista:['barista','barista77','baristabarista'], h_facebook:['facebook','fb'],
  h_ipaddress:['ip address','ipaddress','an ip address','the ip address','ip'], h_benford:["benford","benford's law","benfords law",'frank benford'],
  h_daddyeggs:['daddy eggs','daddy egg'], h_dingmans:['dingmans','dingman','dingman’s','dingman\'s','dingmans ferry'] };

CF.CURIOS = {
  hall: ["Bonner's notebook page", 'A torn page of licence plates in tiny handwriting from the Legion lot.'],
  office: ['A Hummel figurine', 'A porcelain boy with a swing. Mr Rinsky thinks they are creepy; his wife loves them.'],
  classroom: ['A periodic-table tile', 'Element 79, gold. Prised off the chart in the chemistry room where Kristin pulled Adam aside.'],
  records: ['A magazine clipping', 'Cedarfield, ranked among the best places to live in America. Someone has underlined the number.'],
  stacks: ["A boy's bookmark", 'Left in a mythology novel. Ryan reads them; his father tucks the bookmark in when he falls asleep.'],
  turnpike: ['An E-ZPass transponder', 'The little box everyone forgets is on the windscreen, logging every toll.'],
  field: ['A silicone wristband', 'Green rubber, stamped with the town lacrosse club. Thomas snaps his when he is anxious.'],
  board: ['A golf pencil', 'Short, unsharpened at one end. Someone licks the tip before writing.'],
  diner: ['A jukebox selection card', 'A seventies heartbreaker that Adam insists is not a heartbreaker.'],
  kitchen: ['A Chipwich wrapper', 'From the freezer, the dessert promised to the boys the night of the back table.'],
  driveway: ["Jersey's leash", 'The border collie stands in front of the door so nobody can open it to let her out.']
};

/* Motifs for the theme concordance. */
CF.MOTIFS = {
  secrets: ['Secrets', 'What is hidden, who hides it, and who decides when it comes out.'],
  lies: ['Lies & deception', 'Fake bellies, false names, cover stories, white lies to children.'],
  surveillance: ['Watching & tracking', 'Locator apps, browser histories, cameras, notebooks of licence plates.'],
  anonymity: ['Anonymity', 'Websites that promise discretion; a stranger who will not give his name.'],
  parenting: ['Parenting', 'Protecting children, living through them, lying to them for their own good.'],
  marriage: ['Marriage', 'Eighteen years, a team that keeps score, the elephants in the room.'],
  fatherhood: ['Fathers & sons', 'Dead fathers, absent fathers, doubted paternity, a son becoming a man.'],
  money: ['Money', 'Visa charges, lacrosse funds, IPOs, ten thousand dollars in three days.'],
  dream: ['The suburban dream', 'Living the dream: the house, the town, the schools, and how flimsy it is.'],
  class: ['Class & status', 'Hackensack and Cedarfield, his-and-hers Mercedes, a dead family shop.'],
  sport: ['Youth sport', 'Drafts, rankings, referees, scholarships, and parents on the sideline.'],
  technology: ['Technology', 'The internet as confessional, marketplace and informer.'],
  justice: ['Justice & law', 'Lawyers take sides; police form theories; who gets punished and who does not.'],
  violence: ['Violence', 'The threat of it in ordinary men, and its arrival from outside.'],
  community: ['Community & gossip', 'A town where everyone knows everyone and talks.'],
  identity: ['Performance & identity', 'Roles we slip in and out of: coach, teacher, competitor, pregnant woman.'],
  truth: ['Truth-telling', 'Does the truth set you free, or does it just change who carries the weight?']
};

/* Strands of the braided plot (writing craft). */
CF.STRANDS = {
  adam: ['Adam & the Prices', '#2E5A4C'], stranger: ['The stranger & his group', '#5B8FC2'], heidi: ['Heidi, Johanna & Beachwood', '#9A3B2C'],
  rinsky: ['Rinsky & Kasselton', '#7A6A3A'], kuntz: ['Kuntz & the IPO', '#4A3B5C'], lacrosse: ['The lacrosse board', '#D9952F'], victims: ['Other people the stranger visits', '#6B7F86']
};

/* Gazetteer for the Turnpike map. lat/lon are real; Cedarfield & Kasselton are fictional and placed approximately. */
CF.PLACES = {
  cedarfield:{n:'Cedarfield (fictional)',lat:40.985,lon:-74.11,ch:1,t:'A wealthy Bergen County-style town invented for the novel. Corinne grew up here until she was ten.'},
  kasselton:{n:'Kasselton (fictional)',lat:40.93,lon:-74.17,ch:5,t:'Neighbouring town where the Rinskys’ house stands in the way of a redevelopment. Also invented.'},
  paramus:{n:'Paramus, NJ',lat:40.9445,lon:-74.0754,ch:5,t:'Adam’s office, Midland Avenue. Famous in real life for its malls and its Sunday shopping ban.'},
  glenrock:{n:'Glen Rock, NJ',lat:40.9629,lon:-74.1329,ch:5,t:'Opponents in Thomas’s away game.'},
  atlanticcity:{n:'Atlantic City, NJ',lat:39.3643,lon:-74.4229,ch:1,t:'Where Corinne’s teachers’ conference was held, at a casino hotel.'},
  beachwood:{n:'Beachwood, Ohio',lat:41.4645,lon:-81.5087,ch:8,t:'A suburb east of Cleveland. Heidi Dann’s home; Johanna Griffin’s jurisdiction.'},
  universityheights:{n:'University Heights, Ohio',lat:41.4978,lon:-81.5374,ch:8,t:'Where Heidi works the department-store makeup counters.'},
  columbus:{n:'Columbus, Ohio',lat:39.9612,lon:-82.9988,ch:26,t:'Marty Dann’s convention, and his alibi.'},
  hackensack:{n:'Hackensack, NJ',lat:40.8859,lon:-74.0435,ch:18,t:'The garden apartment where Corinne moved after her father died. Ten miles and a world away.'},
  ramsey:{n:'Ramsey, NJ',lat:41.0573,lon:-74.141,ch:9,t:'The coffee shop where Corinne caught Suzanne still eight months pregnant.'},
  nyack:{n:'Nyack, NY',lat:41.0907,lon:-73.9179,ch:22,t:'Across the state line on the Hudson. Suzanne Hope’s brick apartment, 9B.'},
  newark:{n:'Newark, NJ',lat:40.7357,lon:-74.1724,ch:41,t:'Essex County law-enforcement offices downtown; an airport-hotel car park. Corinne first taught here.'},
  harrison:{n:'Harrison, NJ',lat:40.7465,lon:-74.1563,ch:37,t:'The Greek diner Adam and Sally Perryman fought to save.'},
  metlife:{n:'East Rutherford, NJ',lat:40.8135,lon:-74.0745,ch:32,t:'MetLife Stadium and the reclaimed swamp where Tripp keeps an office.'},
  sparta:{n:'Sparta, NJ',lat:41.0335,lon:-74.6385,ch:28,t:'Dan and Carly Molino’s house off the lake.'},
  fairlawn:{n:'Fair Lawn, NJ',lat:40.9404,lon:-74.1185,ch:39,t:'Gabrielle Dunbar’s inflated Cape Cod.'},
  pequannock:{n:'Pequannock, NJ',lat:40.948,lon:-74.296,ch:47,t:'Lockwood Avenue: Gabrielle’s ex and his much younger partner.'},
  skyline:{n:'Skyline Drive, Ramapo Mts',lat:41.06,lon:-74.27,ch:48,t:'A mountain road wrapped in local legend, forty-five minutes from Manhattan.'},
  dingmans:{n:'Dingmans Ferry, PA',lat:41.2187,lon:-74.8668,ch:48,t:'A narrow, privately owned toll bridge over the Delaware.'},
  waterGap:{n:'Columbia, NJ (Delaware Water Gap)',lat:40.925,lon:-75.09,ch:41,t:'A motel near the Gap.'},
  pittsburgh:{n:'Pittsburgh, PA',lat:40.43,lon:-79.89,ch:20,t:'South Braddock Avenue: a strip mall where a phone’s battery ran out.'},
  village:{n:'Greenwich Village, NYC',lat:40.7336,lon:-74.0027,ch:46,t:'Kimberly Dann’s dorm.'},
  washingtonheights:{n:'Washington Heights, NYC',lat:40.8406,lon:-73.942,ch:31,t:'The children’s hospital at 168th Street, room 715.'},
  parkave:{n:'Park Avenue, NYC',lat:40.773,lon:-73.964,ch:40,t:'A study with leather-bound books and too much cognac.'},
  mahlon:{n:'Mahlon Dickerson Reservation',lat:40.99,lon:-74.58,ch:55,t:'Morris County woods near Lake Hopatcong, where Corinne’s family once had a summer house.'},
  hopatcong:{n:'Lake Hopatcong, NJ',lat:40.95,lon:-74.62,ch:55,t:'New Jersey’s largest lake.'}
};
CF.ELSEWHERE = [['Austin, Texas',36,'Ingrid Prisby’s home.'],['Houston, Texas',37,'Rice University, Ingrid’s college.'],['Revere, Massachusetts',37,'The mailing address that leads Adam to Downing Place.'],['Atlanta, Georgia',5,'Emory University, where Adam met Corinne during volunteer training.'],['Bentonville, Arkansas',8,'Where Marty Dann flies to sell vacuums to a retail giant.'],['Madison, Wisconsin',22,'A 1984 Jane Doe case Rinsky works on with online sleuths.'],['Chicago, Illinois',42,'Gabrielle’s ex is there on business.']];

/* Further-reading bank: only works confirmed to exist. [title, author, year, kind] */
CF.BANK = {
  wildduck:['The Wild Duck','Henrik Ibsen',1884,'play'], dollshouse:["A Doll's House",'Henrik Ibsen',1879,'play'], enemy:['An Enemy of the People','Henrik Ibsen',1882,'play'],
  wakefield:['Wakefield','Nathaniel Hawthorne',1835,'story'], blackveil:["The Minister's Black Veil",'Nathaniel Hawthorne',1836,'story'],
  oedipus:['Oedipus the King','Sophocles','c. 429 BCE','play'], ripley:['The Talented Mr. Ripley','Patricia Highsmith',1955,'novel'],
  strangersontrain:['Strangers on a Train','Patricia Highsmith',1950,'novel'], gonegirl:['Gone Girl','Gillian Flynn',2012,'novel'],
  biglies:['Big Little Lies','Liane Moriarty',2014,'novel'], husbandsecret:["The Husband's Secret",'Liane Moriarty',2013,'novel'],
  littlechildren:['Little Children','Tom Perrotta',2004,'novel'], revroad:['Revolutionary Road','Richard Yates',1961,'novel'],
  swimmer:['The Swimmer','John Cheever',1964,'story'], littlefires:['Little Fires Everywhere','Celeste Ng',2017,'novel'],
  nevertold:['Everything I Never Told You','Celeste Ng',2014,'novel'], circle:['The Circle','Dave Eggers',2013,'novel'],
  orwell:['Nineteen Eighty-Four','George Orwell',1949,'novel'], rebecca:['Rebecca','Daphne du Maurier',1938,'novel'],
  ackroyd:['The Murder of Roger Ackroyd','Agatha Christie',1926,'novel'], womaninwhite:['The Woman in White','Wilkie Collins',1859,'novel'],
  inthewoods:['In the Woods','Tana French',2007,'novel'], gonebaby:['Gone, Baby, Gone','Dennis Lehane',1998,'novel'], mystic:['Mystic River','Dennis Lehane',2001,'novel'],
  deadknow:['What the Dead Know','Laura Lippman',2007,'novel'], ladder:['Ladder of Years','Anne Tyler',1995,'novel'], dareme:['Dare Me','Megan Abbott',2012,'novel'],
  camus:['The Stranger (L’Étranger)','Albert Camus',1942,'novel'], pastoral:['American Pastoral','Philip Roth',1997,'novel'],
  sportswriter:['The Sportswriter','Richard Ford',1986,'novel'], independence:['Independence Day','Richard Ford',1995,'novel'],
  corrections:['The Corrections','Jonathan Franzen',2001,'novel'], virgin:['The Virgin Suicides','Jeffrey Eugenides',1993,'novel'],
  lottery:['The Lottery','Shirley Jackson',1948,'story'], salesman:['Death of a Salesman','Arthur Miller',1949,'play'], allmysons:['All My Sons','Arthur Miller',1947,'play'],
  crime:['Crime and Punishment','Fyodor Dostoevsky',1866,'novel'], bigsleep:['The Big Sleep','Raymond Chandler',1939,'novel'],
  purloined:['The Purloined Letter','Edgar Allan Poe',1844,'story'], telltale:['The Tell-Tale Heart','Edgar Allan Poe',1843,'story'],
  bohemia:['A Scandal in Bohemia','Arthur Conan Doyle',1891,'story'], milverton:['The Adventure of Charles Augustus Milverton','Arthur Conan Doyle',1904,'story'],
  tellnoone:['Tell No One','Harlan Coben',2001,'novel'], goneforgood:['Gone for Good','Harlan Coben',2002,'novel'], holdtight:['Hold Tight','Harlan Coben',2008,'novel'],
  caught:['Caught','Harlan Coben',2010,'novel'], sixyears:['Six Years','Harlan Coben',2013,'novel'], missingyou:['Missing You','Harlan Coben',2014,'novel'],
  foolmeonce:['Fool Me Once','Harlan Coben',2016,'novel'], dealbreaker:['Deal Breaker','Harlan Coben',1995,'novel'], thewoods:['The Woods','Harlan Coben',2007,'novel'], shelter:['Shelter','Harlan Coben',2011,'novel'],
  boksecrets:['Secrets: On the Ethics of Concealment and Revelation','Sissela Bok',1982,'nonfiction'], boklying:['Lying: Moral Choice in Public and Private Life','Sissela Bok',1978,'nonfiction'],
  goffman:['The Presentation of Self in Everyday Life','Erving Goffman',1956,'nonfiction'], solove:['The Future of Reputation','Daniel J. Solove',2007,'nonfiction'],
  ronson:["So You've Been Publicly Shamed",'Jon Ronson',2015,'nonfiction'], zuboff:['The Age of Surveillance Capitalism','Shoshana Zuboff',2019,'nonfiction'],
  putnam:['Bowling Alone','Robert D. Putnam',2000,'nonfiction'], crabgrass:['Crabgrass Frontier','Kenneth T. Jackson',1985,'nonfiction'],
  scorecasting:['Scorecasting','Tobias J. Moskowitz & L. Jon Wertheim',2011,'nonfiction'], ariely:['The (Honest) Truth About Dishonesty','Dan Ariely',2012,'nonfiction'],
  ekman:['Telling Lies','Paul Ekman',1985,'nonfiction'], harrislying:['Lying','Sam Harris',2011,'nonfiction'],
  simpleart:['The Simple Art of Murder','Raymond Chandler',1944,'essay'], highsmithplot:['Plotting and Writing Suspense Fiction','Patricia Highsmith',1966,'nonfiction'],
  onwriting:['On Writing','Stephen King',2000,'nonfiction'], mill:['On Liberty','John Stuart Mill',1859,'nonfiction'], republic:['Republic (Book II, the Ring of Gyges)','Plato','c. 375 BCE','philosophy'],
  kant:['On a Supposed Right to Lie from Philanthropy','Immanuel Kant',1797,'essay'], sandel:['Justice: What’s the Right Thing to Do?','Michael J. Sandel',2009,'nonfiction'],
  kingpin:['American Kingpin','Nick Bilton',2017,'nonfiction'], playingtowin:['Playing to Win: Raising Children in a Competitive Culture','Hilary Levey Friedman',2013,'nonfiction'],
  gameon:['Game On','Tom Farrey',2008,'nonfiction'], citron:['Hate Crimes in Cyberspace','Danielle Keats Citron',2014,'nonfiction'],
  perelaffairs:['The State of Affairs','Esther Perel',2017,'nonfiction'], perelcaptivity:['Mating in Captivity','Esther Perel',2006,'nonfiction'],
  gottman:['The Seven Principles for Making Marriage Work','John M. Gottman & Nan Silver',1999,'nonfiction'], gopnik:['The Gardener and the Carpenter','Alison Gopnik',2016,'nonfiction'],
  lareau:['Unequal Childhoods','Annette Lareau',2003,'nonfiction'], pinkhouse:['Little Pink House','Jeff Benedict',2009,'nonfiction'], evicted:['Evicted','Matthew Desmond',2016,'nonfiction'],
  borntorun:['Born to Run','Bruce Springsteen',2016,'memoir'], crewdson:['Twilight: Photographs by Gregory Crewdson','Gregory Crewdson',2002,'photography'],
  owens:['Suburbia','Bill Owens',1973,'photography'], hopperbook:['Edward Hopper: An Intimate Biography','Gail Levin',1995,'biography'],
  eliotrock:['The Rock (choruses)','T. S. Eliot',1934,'poetry']
};

/* Songs and artworks named or alluded to in the novel (facts only, no lyrics). */
CF.JUKEBOX = [
  {ch:5, song:'Please Come to Boston', artist:'Dave Loggins', year:1974, note:'Gribbel’s band is debuting it. Adam argues that the woman who refuses to move is the real problem; Gribbel defends her. A comic duet about whether you follow someone to a new life.'},
  {ch:15, song:'Dust in the Wind', artist:'Kansas', year:1977, note:'The band opened with this slow ballad in a dark bar. A song about how little lasts, opening a chapter about a wife who has vanished.'},
  {ch:15, song:'Paradise by the Dashboard Light', artist:'Meat Loaf', year:1977, note:'A male–female duet about a promise extracted in a parked car. Gribbel sings both parts himself.'},
  {ch:15, song:"Don't Go Breaking My Heart", artist:'Elton John & Kiki Dee', year:1976, note:'Another duet Gribbel performs solo, switching voices.'},
  {ch:39, song:'The Night Chicago Died', artist:'Paper Lace', year:1974, note:'Gribbel claims a tearful crowd. A story-song about a wife waiting through a night of violence to hear if her husband survived.'},
  {ch:4, song:'Bruce Springsteen live', artist:'Bruce Springsteen', year:'', note:'The Prices have seen him a dozen times. Adam dances like a fool; Corinne stands still and watches the stage. A whole marriage in two ways of listening.'},
  {ch:2, song:'Gaston', artist:'from Disney’s Beauty and the Beast', year:1991, note:'Adam hears an imaginary chorus whenever Bob Baime struts past. Name-calling as a coping strategy.'},
  {ch:32, song:'A Springsteen phrase', artist:'Bruce Springsteen (allusion)', year:'', note:'Tripp’s office sits in the reclaimed swamp near the stadium, and the narration borrows a famous Springsteen phrase for the place.'}
];

/* Kitchen: original recipes inspired by food in the novel. */
CF.RECIPES = [
  {id:'scramble', ch:5, name:'Mustard-and-Parmesan Scramble', serves:2, ing:[[4,'','eggs'],[3,'tbsp','milk'],[1,'tsp','Dijon or yellow mustard'],[30,'g','Parmesan, finely grated'],[1,'tbsp','butter'],[0.25,'tsp','black pepper']],
   steps:['Whisk eggs, milk and mustard until no streaks remain.','Melt the butter over low heat; it should foam, not brown.','Add the eggs and stir slowly with a spatula, folding the curds as they set.','Take off the heat while still glossy; fold in the cheese and pepper.'], note:'Cook it low and slow. The mustard disappears into savouriness; nobody will guess it is there, which is rather the point of this book.'},
  {id:'skirt', ch:7, name:'Marinated Skirt Steak', serves:4, ing:[[700,'g','skirt steak'],[3,'tbsp','soy sauce'],[2,'tbsp','olive oil'],[1,'tbsp','brown sugar'],[3,'','garlic cloves, crushed'],[1,'','lime, juiced']],
   steps:['Mix everything but the steak; marinate the steak 2–4 hours in the fridge.','Grill or pan-sear very hot, 3–4 minutes a side.','Rest 5 minutes, then slice thinly across the grain.'], note:'The Friday-night favourite: a family dinner that looks perfect from the outside.'},
  {id:'milanese', ch:12, name:'Veal (or Chicken) Milanese', serves:2, ing:[[2,'','thin veal or chicken cutlets'],[60,'g','dried breadcrumbs'],[30,'g','Parmesan'],[1,'','egg'],[3,'tbsp','olive oil'],[1,'','lemon, in wedges'],[50,'g','rocket']],
   steps:['Pound cutlets thin between sheets of baking paper.','Dip in beaten egg, then in crumbs mixed with Parmesan.','Fry in oil 2–3 minutes a side until golden.','Serve with rocket and lemon.'], note:'The dish ordered at a back table for a wife who never arrived. Make it for someone who will.'},
  {id:'panini', ch:9, name:'Café Turkey-and-Swiss Panini', serves:2, ing:[[4,'','slices sourdough'],[150,'g','sliced turkey'],[4,'','slices Swiss cheese'],[2,'tbsp','mustard'],[1,'tbsp','butter']],
   steps:['Spread mustard inside; layer turkey and cheese.','Butter the outsides.','Press in a hot pan under a heavy pan, 3 minutes a side.'], note:'Corinne’s bliss: a corner table, a sandwich, a book, and a small community of regulars.'},
  {id:'bagel', ch:10, name:'Bacon, Egg and Cheese on a Sesame Bagel', serves:1, ing:[[1,'','sesame bagel'],[2,'','rashers bacon'],[1,'','egg'],[1,'','slice American or cheddar cheese']],
   steps:['Crisp the bacon.','Fry the egg in the bacon fat; flip, and lay cheese on top to melt.','Toast the bagel and assemble.'], note:'The favourite made on the morning after the confrontation. Ask yourself why she made it.'},
  {id:'maitai', ch:8, name:'Mango Mai Tai Mocktail', serves:1, ing:[[120,'ml','mango nectar'],[30,'ml','orange juice'],[15,'ml','lime juice'],[10,'ml','orgeat or almond syrup'],[15,'ml','grenadine']],
   steps:['Shake nectar, juices and syrup with ice.','Strain over fresh ice.','Pour grenadine slowly down the side so it sinks.'], note:'The stranger nurses one for two hours while watching a lunch table. Make one and watch a room for twenty minutes.'},
  {id:'pizza', ch:12, name:'Half-and-Half Pizza Night', serves:3, ing:[[1,'','pizza base'],[150,'g','tomato sauce'],[200,'g','mozzarella'],[60,'g','pepperoni'],[150,'g','cooked chicken'],[3,'tbsp','buffalo sauce']],
   steps:['Spread sauce, scatter cheese.','Pepperoni on one half; chicken tossed in buffalo sauce on the other.','Bake hot, 220°C, 12–15 minutes.'], note:'Two brothers, one pie, and a negotiation. Every family has a treaty about something.'},
  {id:'sandwich', ch:12, name:'Cookie Ice-Cream Sandwiches', serves:6, ing:[[12,'','chocolate-chip cookies'],[500,'ml','vanilla ice cream'],[60,'g','mini chocolate chips']],
   steps:['Soften ice cream 10 minutes.','Sandwich a scoop between two cookies; roll the edges in chips.','Freeze an hour on a tray.'], note:'The freezer dessert promised as a bribe. Talk about what bribes look like in this book.'},
  {id:'protein', ch:5, name:'Peanut Butter Protein Shake', serves:1, ing:[[250,'ml','milk'],[1,'','banana'],[2,'tbsp','peanut butter'],[2,'tbsp','oats']],
   steps:['Blend until smooth.','Drink after a workout you didn’t enjoy.'], note:'Adam’s post-gym reward. Bodies and discipline run all through the gym chapters.'}
];

/* Dot, the narrator. Original character: has tended the Legion bar 31 years. */
CF.DOT = {
  greet: [
    'Evening. I’m Dot. Thirty-one years behind this bar. I hear everything and I repeat nothing, which is more than I can say for the internet.',
    'Back again. Pull up a stool. Tell me what chapter you’re on and I’ll keep my mouth shut about the rest.',
    'You look like someone who read past midnight. I won’t ask what happened. You’ll tell me when you’re ready.'
  ],
  rooms: {
    office:'The law office. Adam reads people for a living. Watch how the author makes you read him.',
    classroom:'Room 233. Big ideas live here, along with a substitute who doesn’t know anybody’s name.',
    records:'The records room. Facts are cheaper than gossip but they last longer.',
    stacks:'The stacks. Every story is borrowed from older ones. The trick is noticing which.',
    turnpike:'The Turnpike. In New Jersey you can’t go anywhere without paying for it, and every toll remembers you.',
    field:'The field. Everybody’s a philosopher on the sideline. Try being one before the whistle.',
    board:'The incident board. Red string, coffee rings, and the question every thriller asks: what did I miss?',
    diner:'The diner. Seventies on the jukebox, eggs any time. Sit in a booth and think in colours.',
    kitchen:'The Price kitchen. You can tell a lot about a marriage from who loads the dishwasher.',
    driveway:'The driveway. Engine off. Sit a minute. Nobody can see you in here but you.',
    hall:'Back at the bar. Your ledger’s on the counter.'
  },
  progress: [
    [1,'One box ticked. That’s how every ledger starts.'],
    [10,'Ten. You’re a regular now. Regulars get the good peanuts.'],
    [50,'Fifty boxes. Corinne would have ranked you near the top of the sheet.'],
    [150,'A hundred and fifty. Most people quit the book club before this. You didn’t.'],
    [400,'Four hundred. I’d buy you a drink if this weren’t a website.'],
    [1000,'A thousand ticks. I’m running out of things to say, and I’ve tended bar thirty-one years.']
  ],
  secret: [
    'Some doors in this town only open if you know the right word. The law office has one. Read carefully.',
    'Every painting in every room has something small you can pick up. Look in the corners.',
    'Somebody’s kitchen has a dish with a silly name. Somebody else’s field has a law that catches liars with arithmetic.',
    'There’s a key you only get by collecting all ten curios. It opens a path I don’t like walking.'
  ],
  spoiler: 'Not yet. That page is still face-down. Move your chapter marker when you get there.',
  keyfound: 'A key. Put it in your satchel. Seven of them open the last door.',
  finale: 'You found all seven. The dossier’s open. Take your notes home and keep them somewhere safe. I won’t tell anyone.'
};

/* Ethics lenses for the field. */
CF.LENSES = {
  conseq:['Consequences','Judge the act by its results. Who is better or worse off because of it, and by how much?'],
  duty:['Duty & rules','Some acts are right or wrong whatever the outcome. Would you will this as a rule for everyone? Does it use a person merely as a means?'],
  virtue:['Character','What would a good person, honest, courageous and kind, do here? What habit does this act build?'],
  care:['Care & relationship','What do the particular relationships here demand? Who is vulnerable, and who is responsible for them?'],
  contract:['Fairness','What rules would everyone agree to if they did not know which person in the story they would be?']
};

/* Dates for the records-room timeline. Verified real-world facts. */
CF.TIMELINE = [
  [1954,'US Supreme Court decides Berman v. Parker, allowing takings to clear "blighted" areas.'],
  [1962,'Harlan Coben is born in Newark, New Jersey (4 January). He grows up in Livingston, NJ.'],
  [1984,'Coben graduates from Amherst College, where he studied political science.'],
  [1990,'Coben’s first novel, Play Dead, is published.'],
  [1995,'Deal Breaker introduces sports agent Myron Bolitar, who carries a long series.'],
  [2001,'Tell No One, a standalone thriller after seven Myron Bolitar novels, becomes Coben’s breakout bestseller.'],
  [2004,'Facebook launches at Harvard; it opens to the general public in 2006.'],
  [2005,'Kelo v. New London: the Supreme Court allows a city to take homes for private economic development. Public backlash follows across the US.'],
  [2008,'Bitcoin’s white paper is published under the name Satoshi Nakamoto.'],
  [2010,'Apple releases Find My iPhone as a free app; family location sharing spreads through the decade.'],
  [2011,'Scorecasting by Tobias Moskowitz and L. Jon Wertheim argues referee bias explains much of home advantage.'],
  [2011,'The Silk Road marketplace opens on the Tor network.'],
  [2013,'The FBI shuts down Silk Road and arrests its operator, Ross Ulbricht.'],
  [2004,'New Jersey becomes the first US state to criminalise sharing intimate images without consent. Many states follow from 2013 onward.'],
  [2015,'The Stranger is published in March 2015 (Dutton in the US).'],
  [2015,'In July–August the Ashley Madison hack exposes users of an affair site, months after the novel came out: fiction anticipating fact.'],
  [2020,'The Stranger is adapted for television, with the story moved to England.']
];
