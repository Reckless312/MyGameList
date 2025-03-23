'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";

type Game = {
    name: string;
    description: string;
    image: string;
    releaseDate: string;
    price: number;
    tag: string;
}

type GamesContextType = {
    games: Game[];
    addGame: (newGame: Game) => void;
    removeGame: (removableGame: Game) => void;
    checkGame: (game: Game) => number;
    updateGame: (gameTitle: string | null, updatedGame: Game) => void;
    sortGames: () => void;
    getOldestGame: () => Game | undefined;
    getEarliestGame: () => Game | undefined;
    getAverageGameByDate: () => Game | undefined;
}

let sortAscending = true;

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({children}: {children: ReactNode}) {
    const [games, setGames] = useState<Game[]>([{
        name: "Persona 3",
        description: "Dive into the Dark Hour and awaken the depths of your heart. Persona 3 Reload is a captivating reimagining of the genre-defining RPG, reborn for the modern era with cutting-edge graphics and gameplay. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2161700/header.jpg?t=1741697885",
        releaseDate: "2024-02-02",
        price: 70,
        tag: "JRPG",
    }, {
        name: "Persona 4",
        description: "A coming of age story that sets the protagonist and his friends on a journey kickstarted by a chain of serial murders. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1113000/header.jpg?t=1704380046",
        releaseDate: "2020-06-13",
        price: 20,
        tag: "JRPG",
    }, {
        name: "Persona 5",
        description: "Don the mask and join the Phantom Thieves of Hearts as they stage grand heists, infiltrate the minds of the corrupt, and make them change their ways! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg?t=1733297467",
        releaseDate: "2022-10-21",
        price: 60,
        tag: "JRPG",
    } , {
        name: "Metaphor: ReFantazio",
        description: "The throne sits empty after the king’s assassination. With no heirs, the will of the late king decrees that the next monarch will be elected by the people, & thus begins your fight for the throne.. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2679460/header.jpg?t=1741600226",
        releaseDate: "2024-10-11",
        price: 70,
        tag: "RPG",
    } , {
        name: "Counter-Strike",
        description: "Play the world's number 1 online action game. Engage in an incredibly realistic brand of terrorist warfare in this wildly popular team-based game. Ally with teammates to complete strategic missions. Take out enemy sites. Rescue hostages. Your role affects your team's success. Your team's success affects...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/10/header.jpg?t=1729702322",
        releaseDate: "2020-11-01",
        price: 8,
        tag: "Action",
    }, {
        name: "Counter-Strike 2",
        description: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1729703045",
        releaseDate: "2012-08-21",
        price: 0,
        tag: "FPS",
    } , {
        name: "Dead by Daylight",
        description: "Trapped forever in a realm of eldritch evil where even death is not an escape, four determined Survivors face a bloodthirsty Killer in a vicious game of nerve and wits. Pick a side and step into a world of tension and terror with horror gaming's best asymmetrical multiplayer. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg?t=1738165502",
        releaseDate: "2016-06-14",
        price: 20,
        tag: "Horror",
    } , {
        name: "Red Dead Redemption",
        description: "Experience the story of former outlaw John Marston as he tracks down the last remaining members of the notorious Van der Linde Gang in the PC debut of the critically acclaimed predecessor to Red Dead Redemption 2. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2668510/header.jpg?t=1741118459",
        releaseDate: "2024-10-29",
        price: 40,
        tag: "Open World",
    } , {
        name: "Red Dead Redemption 2",
        description: "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg?t=1720558643",
        releaseDate: "2019-12-05",
        price: 60,
        tag: "Open World",
    } , {
        name: "Dying Light",
        description: "First-person action survival game set in a post-apocalyptic open world overrun by flesh-hungry zombies. Roam a city devastated by a mysterious virus epidemic. Scavenge for supplies, craft weapons, and face hordes of the infected. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/239140/header.jpg?t=1738004178",
        releaseDate: "2015-01-26",
        price: 20,
        tag: "Horror",
    } , {
        name: "The Elder Scrolls V: Skyrim Special Edition",
        description: "Winner of more than 200 Game of the Year Awards, The Elder Scrolls V: Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg?t=1721923149",
        releaseDate: "2016-10-28",
        price: 40,
        tag: "Open World",
    } , {
        name: "Rocket League®",
        description: "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/252950/d56cf9d01073d893677fb9e7e257b79fd7939ee3/header.jpg?t=1741975345",
        releaseDate: "2015-07-07",
        price: 20,
        tag: "Multiplayer",
    } , {
        name: "Among Us",
        description: "An online and local party game of teamwork and betrayal for 4-15 players...in space! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/945360/header.jpg?t=1731953093",
        releaseDate: "2018-11-16",
        price: 5,
        tag: "Multiplayer",
    } , {
        name: "Just Cause™ 3",
        description: "With over 1000 km² of complete freedom from sky to seabed, Rico Rodriguez returns to unleash chaos in the most creative and explosive ways imaginable. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/225540/header.jpg?t=1728396027",
        releaseDate: "2015-12-01",
        price: 3,
        tag: "Open World",
    } , {
        name: "DARK SOULS™: REMASTERED",
        description: "Then, there was fire. Re-experience the critically acclaimed, genre-defining game that started it all. Beautifully remastered, return to Lordran in stunning high-definition detail running at 60fps. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570940/header.jpg?t=1726158603",
        releaseDate: "2018-05-24",
        price: 40,
        tag: "Souls-like",
    } , {
        name: "DARK SOULS™ II",
        description: "Developed by FROM SOFTWARE, DARK SOULS™ II is the highly anticipated sequel to the gruelling 2011 breakout hit Dark Souls. The unique old-school action RPG experience captivated imaginations of gamers worldwide with incredible challenge and intense emotional reward.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/236430/header.jpg?t=1726158600",
        releaseDate: "2014-04-25",
        price: 20,
        tag: "Souls-like",
    } , {
        name: "DARK SOULS™ III",
        description: "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg?t=1733509027",
        releaseDate: "2016-04-11",
        price: 60,
        tag: "Souls-like",
    } , {
        name: "Sekiro™: Shadows Die Twice - GOTY Edition",
        description: "Game of the Year - The Game Awards 2019 Best Action Game of 2019 - IGN Carve your own clever path to vengeance in the award winning adventure from developer FromSoftware, creators of Bloodborne and the Dark Souls series. Take Revenge. Restore Your Honor. Kill Ingeniously. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg?t=1726158438",
        releaseDate: "2019-03-21",
        price: 60,
        tag: "Souls-like",
    } , {
        name: "ELDEN RING",
        description: "THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1739922037",
        releaseDate: "2022-02-25",
        price: 60,
        tag: "Souls-like",
    } , {
        name: "ELDEN RING NIGHTREIGN",
        description: "ELDEN RING NIGHTREIGN is a standalone adventure within the ELDEN RING universe, crafted to offer players a new gaming experience by reimagining the game’s core design. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2622380/header.jpg?t=1742521322",
        releaseDate: "2025-05-30",
        price: 40,
        tag: "Souls-like",
    }, {
        name: "God of War",
        description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg?t=1729030762",
        releaseDate: "2022-01-14",
        price: 50,
        tag: "Action",
    } , {
        name: "God of War Ragnarök",
        description: "Kratos and Atreus embark on a mythic journey for answers before Ragnarök arrives – now on PC. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg?t=1738256985",
        releaseDate: "2024-09-19",
        price: 60,
        tag: "Action",
    }, {
        name: "Fallout 3: Game of the Year Edition",
        description: "Prepare for the Future™ With Fallout 3: Game of the Year Edition, experience the most acclaimed game of 2008 like never before. Create a character of your choosing and descend into an awe-inspiring, post-apocalyptic world where every minute is a fight for survival. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/22370/header.jpg?t=1732208097",
        releaseDate: "2009-10-13",
        price: 20,
        tag: "Open World",
    } , {
        name: "Fallout 4",
        description: "Bethesda Game Studios, the award-winning creators of Fallout 3 and The Elder Scrolls V: Skyrim, welcome you to the world of Fallout 4 – their most ambitious game ever, and the next generation of open-world gaming. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg?t=1726758475",
        releaseDate: "2015-11-10",
        price: 20,
        tag: "Open World"
    }, {
        name: "Marvel’s Spider-Man Remastered",
        description: "n Marvel’s Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story. Play as an experienced Peter Parker, fighting big crime and iconic villains in Marvel’s New York.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg?t=1725652915",
        releaseDate: "2022-08-12",
        price: 60,
        tag: "Open World",
    } , {
        name: "Marvel’s Spider-Man: Miles Morales",
        description: "After the events of Marvel’s Spider-Man Remastered, teenage Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man. When a fierce power struggle threatens to destroy his home, Miles must take up the mantle of Spider-Man and own it ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1817190/header.jpg?t=1737599097",
        releaseDate: "2022-11-18",
        price: 50,
        tag: "Open World",
    } , {
        name: "Marvel's Spider-Man 2",
        description: "Be Greater. Together. The incredible power of the symbiote forces Peter Parker and Miles Morales into a desperate fight as they balance their lives, friendships, and their duty to protect in an exciting chapter of the critically acclaimed Spider-Man franchise on PC. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2651280/header.jpg?t=1738343995",
        releaseDate: "2025-01-30",
        price: 60,
        tag: "Action",
    } , {
        name: "Stardew Valley",
        description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home? ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1711128146",
        releaseDate: "2016-02-26",
        price: 14,
        tag: "Farming",
    } , {
        name: "The Witcher: Enhanced Edition Director's Cut",
        description: "Become The Witcher, Geralt of Rivia, a legendary monster slayer caught in a web of intrigue woven by forces vying for control of the world. Make difficult decisions and live with the consequences in a game that will immerse you in an extraordinary tale like no other. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/20900/header.jpg?t=1729242001",
        releaseDate: "2008-09-16",
        price: 2,
        tag: "RPG",
    } , {
        name: "The Witcher 2: Assassins of Kings Enhanced Edition",
        description: " A time of untold chaos has come. Mighty forces clash behind the scenes in a struggle for power and influence. The Northern Kingdoms mobilize for war. But armies on the march are not enough to stop a bloody conspiracy... ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/20920/header.jpg?t=1729586898",
        releaseDate: "2011-05-17",
        price: 3,
        tag: "RPG",
    } , {
        name: "The Witcher 3: Wild Hunt",
        description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg?t=1736424367",
        releaseDate: "2015-05-18",
        price: 6,
        tag: "RPG",
    } , {
        name: "Portal",
        description: "Portal™ is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/400/header.jpg?t=1738796058",
        releaseDate: "2007-10-10",
        price: 7,
        tag: "Puzzle",
    }, {
        name: "Portal 2",
        description: "The \"Perpetual Testing Initiative\" has been expanded to allow you to design co-op puzzles for you and your friends! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/620/header.jpg?t=1725487730",
        releaseDate: "2011-04-19",
        price: 10,
        tag: "Puzzle",
    } , {
        name: "Left 4 Dead",
        description: "From Valve (the creators of Counter-Strike, Half-Life and more) comes Left 4 Dead, a co-op action horror game for the PC and Xbox 360 that casts up to four players in an epic struggle for survival against swarming zombie hordes and terrifying mutant monsters. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/500/header.jpg?t=1738796049",
        releaseDate: "2008-11-17",
        price: 10,
        tag: "Multiplayer",
    } , {
        name: "Left 4 Dead 2",
        description: "Set in the zombie apocalypse, Left 4 Dead 2 (L4D2) is the highly anticipated sequel to the award-winning Left 4 Dead, the #1 co-op game of 2008. This co-operative action horror FPS takes you and your friends through the cities, swamps and cemeteries of the Deep South, from Savannah to New Orleans...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/550/header.jpg?t=1731457037",
        releaseDate: "2009-11-17",
        price: 10,
        tag: "Multiplayer",
    } , {
        name: "Five Nights at Freddy's",
        description: "Welcome to your new summer job at Freddy Fazbear's Pizza, where kids and parents alike come for entertainment and food! The main attraction is Freddy Fazbear, of course; and his two friends. They are animatronic robots, programmed to please the crowds! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/319510/header.jpg?t=1666889251",
        releaseDate: "2014-08-18",
        price: 4,
        tag: "Horror",
    } , {
        name: "Five Nights at Freddy's 2",
        description: "Welcome back to the new and improved Freddy Fazbear's Pizza! As always, Fazbear Entertainment is not responsible for death or dismemberment. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/332800/header.jpg?t=1579635993",
        releaseDate: "2014-11-11",
        price: 8,
        tag: "Horror",
    } , {
        name: "Five Nights at Freddy's 3",
        description: "Thirty years after Freddy Fazbear's Pizza closed it's doors, the events that took place there have become nothing more than a rumor and a childhood memory, but the owners of \"Fazbear's Fright: The Horror Attraction\" are determined to revive the legend and make the experience as authentic as possible for ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/354140/header.jpg?t=1579635991",
        releaseDate: "2015-03-03",
        price: 8,
        tag: "Horror",
    } , {
        name: "Five Nights at Freddy's 4",
        description: "In this last chapter of the Five Nights at Freddy's original story, you must once again defend yourself against Freddy Fazbear, Chica, Bonnie, Foxy, and even worse things that lurk in the shadows. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/388090/header.jpg?t=1579635988",
        releaseDate: "2015-07-24",
        price: 8,
        tag: "Horror",
    } , {
        name: "Five Nights at Freddy's: Sister Location",
        description: "Welcome to Circus Baby's Pizza World, where family fun and interactivity go beyond anything you've seen at those *other* pizza places! Now hiring: Late night technician. Must enjoy cramped spaces and be comfortable around active machinery. Not responsible for death or dismemberment. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/506610/header.jpg?t=1579635985",
        releaseDate: "2016-10-07",
        price: 8,
        tag: "Horror",
    } , {
        name: "METAL GEAR RISING: REVENGEANCE",
        description: "Developed by Kojima Productions and PlatinumGames, METAL GEAR RISING: REVENGEANCE takes the renowned METAL GEAR franchise into exciting new territory with an all-new action experience. The game seamlessly melds pure action and epic story-telling that surrounds Raiden...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/235460/header.jpg?t=1740076034",
        releaseDate: "2014-01-09",
        price: 20,
        tag: "Action",
    } , {
        name: "Bully: Scholarship Edition",
        description: "Bully tells the story of mischievous 15-year-old Jimmy Hopkins as he goes through the hilarity and awkwardness of adolescence. Beat the jocks at dodge ball, play pranks on the preppies, save the nerds, kiss the girl and navigate the social hierarchy in the worst school around. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/12200/header.jpg?t=1741118085",
        releaseDate: "2008-10-21",
        price: 4,
        tag: "Open World",
    } , {
        name: "Outlast",
        description: "Hell is an experiment you can't survive in Outlast, a first-person survival horror game developed by veterans of some of the biggest game franchises in history. As investigative journalist Miles Upshur, explore Mount Massive Asylum and try to survive long enough to discover its terrible secret... if you ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/238320/header.jpg?t=1666817106",
        releaseDate: "2013-09-04",
        price: 20,
        tag: "Horror",
    } , {
        name: "Outlast 2",
        description: "Outlast 2 introduces you to Sullivan Knoth and his followers, who left our wicked world behind to give birth to Temple Gate, a town, deep in the wilderness and hidden from civilization. Knoth and his flock are preparing for the tribulations of the end of times and you’re right in the thick of it. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/414700/header.jpg?t=1618944453",
        releaseDate: "2017-04-25",
        price: 23,
        tag: "Horror",
    } , {
        name: "The Forest",
        description: "As the lone survivor of a passenger jet crash, you find yourself in a mysterious forest battling to stay alive against a society of cannibalistic mutants. Build, explore, survive in this terrifying first person survival horror simulator. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/242760/header.jpg?t=1699381053",
        releaseDate: "2018-04-30",
        price: 17,
        tag: "Open World",
    } , {
        name: "Sons Of The Forest",
        description: "Sent to find a missing billionaire on a remote island, you find yourself in a cannibal-infested hellscape. Craft, build, and struggle to survive, alone or with friends, in this terrifying new open-world survival horror simulator. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg?t=1708624856",
        releaseDate: "2024-02-22",
        price: 29,
        tag: "Open World",
    } , {
        name: "Half-Life",
        description: "Named Game of the Year by over 50 publications, Valve's debut title blends action and adventure with award-winning technology to create a frighteningly realistic world where players must think to survive. Also includes an exciting multiplayer mode that allows you to play against friends and enemies ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/70/header.jpg?t=1738795025",
        releaseDate: "1998-11-19",
        price: 8,
        tag: "FPS",
    } , {
        name: "Half-Life 2",
        description: "Reawakened from stasis in the occupied metropolis of City 17, Gordon Freeman is joined by Alyx Vance as he leads a desperate human resistance. Experience the landmark first-person shooter packed with immersive world-building, boundary-pushing physics, and exhilarating combat. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220/header.jpg?t=1737139959",
        releaseDate: "2004-11-16",
        price: 10,
        tag: "FPS",
    } , {
        name: "Dishonored",
        description: " Dishonored is an immersive first-person action game that casts you as a supernatural assassin driven by revenge. With Dishonored’s flexible combat system, creatively eliminate your targets as you combine the supernatural abilities, weapons and unusual gadgets at your disposal. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/205100/header.jpg?t=1726757539",
        releaseDate: "2012-10-12",
        price: 10,
        tag: "Stealth",
    } , {
        name: "Dishonored 2",
        description: "Reprise your role as a supernatural assassin in Dishonored 2. Declared a “masterpiece” by Eurogamer and hailed “a must-play revenge tale” by Game Informer, Dishonored 2 is the follow up to Arkane’s 1st-person action blockbuster & winner of 100+ 'Game of the Year' awards, Dishonored. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/403640/header.jpg?t=1726161101",
        releaseDate: "2016-11-11",
        price: 30,
        tag: "Stealth",
    } , {
        name: "Papers, Please",
        description: "Congratulations. The October labor lottery is complete. Your name was pulled. For immediate placement, report to the Ministry of Admission at Grestin Border Checkpoint. An apartment will be provided for you and your family in East Grestin. Expect a Class-8 dwelling. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/239030/header.jpg?t=1678266428",
        releaseDate: "2013-08-08",
        price: 10,
        tag: "Indie",
    } , {
        name: "Okami HD",
        description: "Experience the critically acclaimed masterpiece with its renowned Sumi-e ink art style in breathtaking high resolution. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/587620/header.jpg?t=1733787035",
        releaseDate: "2017-12-12",
        price: 10,
        tag: "Adventure",
    } , {
        name: "Hollow Knight",
        description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg?t=1695270428",
        releaseDate: "2017-02-24",
        price: 15,
        tag: "Souls-like",
    } , {
        name: "Subnautica",
        description: "Descend into the depths of an alien underwater world filled with wonder and peril. Craft equipment, pilot submarines and out-smart wildlife to explore lush coral reefs, volcanoes, cave systems, and more - all while trying to survive. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg?t=1729208919",
        releaseDate: "2018-01-23",
        price: 30,
        tag: "Open World",
    } , {
        name: "Cyberpunk 2077",
        description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg?t=1734434803",
        releaseDate: "2020-12-10",
        price: 24,
        tag: "Open World",
    } , {
        name: "FINAL FANTASY VII REMAKE INTERGRADE",
        description: "Cloud Strife, an ex-SOLDIER operative, descends on the mako-powered city of Midgar. The world of the timeless classic FINAL FANTASY VII is reborn, using cutting-edge graphics technology, a new battle system and an additional adventure featuring Yuffie Kisaragi. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1462040/header.jpg?t=1737643021",
        releaseDate: "2022-06-17",
        price: 40,
        tag: "RPG",
    } , {
        name: "FINAL FANTASY VII REBIRTH",
        description: "The Unknown Journey Continues... After escaping from the dystopian city of Midgar, Cloud and his friends set out on a journey across the planet. New adventures await in a vibrant and vast world in this standalone entry to the FFVII remake trilogy! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2909400/header.jpg?t=1740049902",
        releaseDate: "2025-01-23",
        price: 48,
        tag: "RPG",
    } , {
        name: "Resident Evil 2",
        description: "A deadly virus engulfs the residents of Raccoon City in September of 1998, plunging the city into chaos as flesh eating zombies roam the streets for survivors. An unparalleled adrenaline rush, gripping storyline, and unimaginable horrors await you. Witness the return of Resident Evil 2. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/883710/header.jpg?t=1728438541",
        releaseDate: "2019-01-25",
        price: 10,
        tag: "Horror",
    } , {
        name: "Resident Evil 3",
        description: "Jill Valentine is one of the last remaining people in Raccoon City to witness the atrocities Umbrella performed. To stop her, Umbrella unleashes their ultimate secret weapon: Nemesis! Also includes Resident Evil Resistance, a new 1 vs 4 online multiplayer game set in the Resident Evil universe.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/952060/header.jpg?t=1728438347",
        releaseDate: "2020-04-03",
        price: 10,
        tag: "Horror",
    } , {
        name: "Resident Evil 4",
        description: "Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president's kidnapped daughter to a secluded European village, where there is something terribly wrong with the locals. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg?t=1736385712",
        releaseDate: "2023-03-24",
        price: 20,
        tag: "Horror",
    } , {
        name: "Resident Evil 7 Biohazard",
        description: "Fear and isolation seep through the walls of an abandoned southern farmhouse. \"7\" marks a new beginning for survival horror with the “Isolated View” of the visceral new first-person perspective. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/418370/header.jpg?t=1728436752",
        releaseDate: "2017-01-24",
        price: 8,
        tag: "Horror",
    } , {
        name: "Resident Evil Village",
        description: "Experience survival horror like never before in the 8th major installment in the Resident Evil franchise - Resident Evil Village. With detailed graphics, intense first-person action and masterful storytelling, the terror has never felt more realistic. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1196590/header.jpg?t=1741142800",
        releaseDate: "2021-05-07",
        price: 16,
        tag: "Horror",
    } , {
        name: "Phasmophobia",
        description: "Phasmophobia is a 4 player online co-op psychological horror. Paranormal activity is on the rise and it’s up to you and your team to use all the ghost-hunting equipment at your disposal in order to gather as much evidence as you can. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/739630/header.jpg?t=1740090955",
        releaseDate: "2020-09-18",
        price: 20,
        tag: "Horror",
    } , {
        name: "Black Myth: Wukong",
        description: "Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg?t=1742561528",
        releaseDate: "2024-08-20",
        price: 60,
        tag: "Action",
    } , {
        name: "Grand Theft Auto: San Andreas – The Definitive Edition",
        description: "Grand Theft Auto: San Andreas: It’s the early ’90s. After a couple of cops frame him for homicide, Carl ‘CJ’ Johnson is forced on a journey that takes him across the entire state of San Andreas, to save his family and to take control of the streets. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1547000/header.jpg?t=1741117455",
        releaseDate: "2023-01-19",
        price: 24,
        tag: "Open World",
    } , {
        name: "Grand Theft Auto III – The Definitive Edition",
        description: "It all starts in Liberty City. With revolutionary freedom to go anywhere and jack anyone, Grand Theft Auto III puts the center of the criminal underworld at your fingertips, if you have enough guts to take it. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1546970/header.jpg?t=1741117830",
        releaseDate: "2023-01-19",
        price: 24,
        tag: "Open World",
    } , {
        name: "Grand Theft Auto: Vice City – The Definitive Edition",
        description: "Welcome to the 1980s. From the decade of big hair and pastel suits comes the story of one man's rise to the top of the criminal pile. Grand Theft Auto returns with Tommy Vercetti’s tale of betrayal and revenge in a neon-soaked tropical town full of excess and brimming with possibilities. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1546990/header.jpg?t=1741117543",
        releaseDate: "2023-01-19",
        price: 24,
        tag: "Open World",
    } , {
        name: "Grand Theft Auto IV: The Complete Edition",
        description: "Niko Bellic, Johnny Klebitz and Luis Lopez all have one thing in common - they live in the worst city in America. Liberty City worships money and status, and is heaven for those who have them and a living nightmare for those who don't. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/12210/header.jpg?t=1721061564",
        releaseDate: "2020-03-24",
        price: 7,
        tag: "Open World",
    } , {
        name: "Grand Theft Auto V Enhanced",
        description: "Experience entertainment blockbusters Grand Theft Auto V and Grand Theft Auto Online — now upgraded for a new generation with stunning visuals, faster loading, 3D audio, and more, plus exclusive content for GTA Online players. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/3240220/header.jpg?t=1741381848",
        releaseDate: "2025-03-04",
        price: 30,
        tag: "Open World",
    } , {
        name: "DEATH STRANDING DIRECTOR'S CUT",
        description: "From legendary game creator Hideo Kojima comes a genre-defying experience, now expanded in this definitive DIRECTOR’S CUT. As Sam Bridges, your mission is to deliver hope to humanity by connecting the last survivors of a decimated America. Can you reunite the shattered world, one step at a time? ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1850570/header.jpg?t=1728989088",
        releaseDate: "2022-03-30",
        price: 20,
        tag: "Open World",
    } , {
        name: "A Way Out",
        description: "A Way Out is an exclusively co-op adventure where you play the role of one of two prisoners making their daring escape from prison. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1222700/header.jpg?t=1730912036",
        releaseDate: "2018-03-23",
        price: 5,
        tag: "Multiplayer",
    } , {
        name: "It Takes Two",
        description: "Embark on the craziest journey of your life in It Takes Two. Invite a friend to join for free with Friend’s Pass and work together across a huge variety of gleefully disruptive gameplay challenges. Winner of GAME OF THE YEAR at the Game Awards 2021. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg?t=1730911936",
        releaseDate: "2021-03-26",
        price: 12,
        tag: "Multiplayer",
    } , {
        name: "Split Fiction",
        description: "Embrace mind-blowing moments as you’re pulled deep into the many worlds of Split Fiction, a boundary-pushing co-op adventure. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2001120/header.jpg?t=1742494049",
        releaseDate: "2025-03-06",
        price: 40,
        tag: "Multiplayer",
    } , {
        name: "Lethal Company",
        description: "A co-op horror about scavenging at abandoned moons to sell scrap to the Company. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg?t=1723894859",
        releaseDate: "2023-10-24",
        price: 10,
        tag: "Horror",
    } , {
        name: "Ghost of Tsushima DIRECTOR'S CUT",
        description: "A storm is coming. Venture into the complete Ghost of Tsushima DIRECTOR’S CUT on PC; forge your own path through this open-world action adventure and uncover its hidden wonders. Brought to you by Sucker Punch Productions, Nixxes Software and PlayStation Studios. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg?t=1737495883",
        releaseDate: "2024-05-16",
        price: 60,
        tag: "Action",
    } , {
        name: "The Binding of Isaac: Rebirth",
        description: "The Binding of Isaac: Rebirth is a randomly generated action RPG shooter with heavy Rogue-like elements. Following Isaac on his journey players will find bizarre treasures that change Isaac’s form giving him super human abilities and enabling him to fight off droves of mysterious creatures, discover secrets ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/250900/header.jpg?t=1731977365",
        releaseDate: "2014-11-04",
        price: 15,
        tag: "Indie",
    } , {
        name: "MiSide",
        description: "Let's imagine that you have a game in which you care for a character. But could you imagine one day getting into that game yourself? ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2527500/header.jpg?t=1740650632",
        releaseDate: "2024-12-11",
        price: 13,
        tag: "Horror",
    } , {
        name: "STAR WARS Jedi: Fallen Order™",
        description: "A galaxy-spanning adventure awaits in Star Wars Jedi: Fallen Order, a 3rd person action-adventure title from Respawn. An abandoned Padawan must complete his training, develop new powerful Force abilities, and master the art of the lightsaber - all while staying one step ahead of the Empire.",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1172380/header.jpg?t=1725901454",
        releaseDate: "2019-11-15",
        price: 4,
        tag: "Souls-like",
    } , {
        name: "The Last of Us™ Part I",
        description: "Discover the award-winning game that inspired the critically acclaimed television show. Guide Joel and Ellie through a post-apocalyptic America, and encounter unforgettable allies and enemies in The Last of Us™. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg?t=1741209545",
        releaseDate: "2023-03-28",
        price: 60,
        tag: "Adventure",
    } , {
        name: "The Last of Us™ Part II Remastered",
        description: "Experience the winner of over 300 Game of the Year awards, now on PC. Discover Ellie and Abby’s story with graphical enhancements, gameplay modes like the roguelike survival experience No Return, and more. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2531310/header.jpg?t=1742580411",
        releaseDate: "2025-04-03",
        price: 50,
        tag: "Adventure",
    } , {
        name: "DOOM",
        description: "Now includes all three premium DLC packs (Unto the Evil, Hell Followed, and Bloodfall), maps, modes, and weapons, as well as all feature updates including Arcade Mode, Photo Mode, and the latest Update 6.66, which brings further multiplayer improvements as well as revamps multiplayer progression. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/379720/header.jpg?t=1692892793",
        releaseDate: "2016-05-13",
        price: 20,
        tag: "FPS",
    } , {
        name: "DOOM Eternal",
        description: "Hell’s armies have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the final destruction of humanity. The only thing they fear... is you. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg?t=1702308063",
        releaseDate: "2020-03-20",
        price: 40,
        tag: "FPS",
    } , {
        name: "DOOM: The Dark Ages",
        description: "DOOM: The Dark Ages is the prequel to the critically acclaimed DOOM (2016) and DOOM Eternal that tells an epic cinematic story of the DOOM Slayer’s rage. Players will step into the blood-stained boots of the DOOM Slayer, in this never-before-seen dark and sinister medieval war against Hell. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/3017860/header.jpg?t=1740674745",
        releaseDate: "2025-05-15",
        price: 80,
        tag: "FPS",
    } , {
        name: "Cuphead",
        description: "Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era, i.e. traditional hand drawn cel animation, watercolor backgrounds, and original jazz recordings. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg?t=1709068852",
        releaseDate: "2017-09-29",
        price: 20,
        tag: "Multiplayer",
    } , {
        name: "Undertale",
        description: "UNDERTALE! The RPG game where you don't have to destroy anyone. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/391540/header.jpg?t=1579096091",
        releaseDate: "2015-09-15",
        price: 10,
        tag: "Indie",
    } , {
        name: "SILENT HILL 2",
        description: "Investigating a letter from his late wife, James returns to where they made so many memories - Silent Hill. What he finds is a ghost town, prowled by disturbing monsters and cloaked in deep fog. Confront the monsters, solve puzzles, and search for traces of your wife in this remake of SILENT HILL 2. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg?t=1737565204",
        releaseDate: "2024-10-08",
        price: 70,
        tag: "Horror",
    } , {
        name: "Until Dawn™",
        description: "Rebuilt and enhanced for PC – Until Dawn invites you to relive the nightmare, and immerse yourself in a gripping slasher horror where every decision can make the difference between life and death. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2172010/header.jpg?t=1737496446",
        releaseDate: "2024-10-04",
        price: 70,
        tag: "Horror",
    } , {
        name: "Ghostrunner",
        description: "Ghostrunner offers a unique single-player experience: fast-paced, violent combat, and an original setting that blends science fiction with post-apocalyptic themes. It tells the story of a world that has already ended and its inhabitants who fight to survive. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1139900/header.jpg?t=1727712844",
        releaseDate: "2020-10-27",
        price: 8,
        tag: "Action",
    } , {
        name: "60 Seconds! Reatomized",
        description: "The post-apocalyptic dark comedy is back - remastered and even more radioactive than before! Scavenge supplies, rescue your family, and stay alive in your fallout shelter. Make difficult decisions, hunt mutant roaches... and maybe survive. Or not. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1012880/header.jpg?t=1737718090",
        releaseDate: "2019-07-25",
        price: 10,
        tag: "Adventure",
    } , {
        name: "Beyond: Two Souls",
        description: "A unique psychological action thriller delivered by A-list Hollywood performances by Elliot Page and Willem Dafoe, Beyond: Two Souls takes you on a thrilling journey across the globe as you play out the remarkable life of Jodie Holmes. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/960990/header.jpg?t=1667468566",
        releaseDate: "2020-06-18",
        price: 20,
        tag: "Adventure",
    } , {
        name: "Heavy Rain",
        description: "Experience a gripping psychological thriller filled with innumerable twists and turns. The hunt is on for a murderer known only as the Origami Killer. Four characters, each following their own leads, must take part in a desperate attempt to prevent the killer from claiming a new victim. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/960910/header.jpg?t=1675271942",
        releaseDate: "2020-06-18",
        price: 20,
        tag: "Adventure",
    } , {
        name: "Detroit: Become Human",
        description: "Detroit: Become Human puts the destiny of both mankind and androids in your hands, taking you to a near future where machines have become more intelligent than humans. Every choice you make affects the outcome of the game, with one of the most intricately branching narratives ever created. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1222140/header.jpg?t=1667468479",
        releaseDate: "2020-06-18",
        price: 40,
        tag: "Adventure",
    } , {
        name: "Murdered: Soul Suspect",
        description: "MURDERED: SOUL SUSPECT™ takes players into a whole new realm of mystery where the case is personal and the clues just out of reach, challenging gamers to solve the hardest case of all… their own murder. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/233290/header.jpg?t=1503075903",
        releaseDate: "2014-06-06",
        price: 2,
        tag: "Adventure",
    } , {
        name: "Horizon Zero Dawn™ Remastered",
        description: "Experience the critically acclaimed Horizon Zero Dawn™ with stunning new visuals and upgraded features. In a far future where colossal machines roam the Earth, pockets of humanity survive in unique tribes among the lush, overgrown ruins of our long-lost civilization. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2561580/header.jpg?t=1738876500",
        releaseDate: "2024-10-31",
        price: 50,
        tag: "Open World",
    } , {
        name: "UNO",
        description: "UNO makes its return with new exciting features! Match cards by color or value and play action cards to change things up. Race against others to empty your hand before everyone else in Classic play or customize your experience with House Rules. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/470220/header.jpg?t=1728664374",
        releaseDate: "2016-12-08",
        price: 10,
        tag: "Multiplayer",
    } , {
        name: "Visage",
        description: "Visage is a first-person psychological horror game. Explore a mysterious ever-changing house in a slow-paced, atmospheric world that combines both uncannily comforting and horrifyingly realistic environments, and enjoy a genuinely terrifying experience. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/594330/header.jpg?t=1607559678",
        releaseDate: "2020-10-30",
        price: 30,
        tag: "Horror",
    } , {
        name: "Devil May Cry 5",
        description: "The ultimate Devil Hunter is back in style, in the game action fans have been waiting for. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/601150/header.jpg?t=1701395090",
        releaseDate: "2019-03-08",
        price: 30,
        tag: "Action",
    } , {
        name: "Sifu",
        description: "Sifu is a realistic third-person brawler with tight Kung Fu combat mechanics and cinematic martial arts action embarking you on a path for revenge. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2138710/header.jpg?t=1734256859",
        releaseDate: "2023-03-28",
        price: 40,
        tag: "Action",
    } , {
        name: "South Park™: The Stick of Truth™",
        description: "From the perilous battlefields of the fourth-grade playground, a young hero will rise, destined to be South Park’s savior. From the creators of South Park, Trey Parker and Matt Stone, comes an epic quest to become… cool. Introducing South Park™: The Stick of Truth™.For a thousand years, the battle has been ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/213670/header.jpg?t=1680013652",
        releaseDate: "2014-03-06",
        price: 30,
        tag: "RPG",
    } , {
        name: "South Park™: The Fractured But Whole™",
        description: "From the creators of South Park, Trey Parker and Matt Stone, comes South Park: The Fractured But Whole, a sequel to 2014's award-winning South Park: The Stick of Truth. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/488790/header.jpg?t=1680013571",
        releaseDate: "2017-10-16",
        price: 30,
        tag: "RPG",
    } , {
        name: "Call of Duty® 4: Modern Warfare® (2007)",
        description: "The new action-thriller from the award-winning team at Infinity Ward, the creators of the Call of Duty® series, delivers the most intense and cinematic action experience ever. Call of Duty 4: Modern Warfare arms gamers with an arsenal of advanced and powerful modern day firepower and transports them...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/7940/header.jpg?t=1731698665",
        releaseDate: "2007-11-12",
        price: 20,
        tag: "FPS",
    } , {
        name: "Call of Duty®: Modern Warfare® 2 (2009)",
        description: "The most-anticipated game of the year and the sequel to the best-selling first-person action game of all time, Modern Warfare 2 continues the gripping and heart-racing action as players face off against a new threat dedicated to bringing the world to the brink of collapse. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/10180/header.jpg?t=1654809646",
        releaseDate: "2009-11-12",
        price: 20,
        tag: "FPS",
    } , {
        name: "Call of Duty®: Modern Warfare® 3 (2011)",
        description: "The best-selling first-person action series of all-time returns with an epic sequel to the multiple GOTY award winner Call of Duty®: Modern Warfare® 2 ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/115300/header.jpg?t=1692032509",
        releaseDate: "2011-11-08",
        price: 40,
        tag: "FPS",
    } , {
        name: "Mafia: Definitive Edition",
        description: "An inadvertent brush with the mob thrusts cabdriver Tommy Angelo into the world of organized crime. Initially uneasy about falling in with the Salieri family, the rewards become too big to ignore. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1030840/header.jpg?t=1738968937",
        releaseDate: "2020-09-25",
        price: 40,
        tag: "Action",
    } , {
        name: "Mafia II: Definitive Edition",
        description: "War hero Vito Scaletta becomes entangled with the mob in hopes of paying his father’s debts. Vito works to prove himself, climbing the family ladder with crimes of larger reward and consequence. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1030830/header.jpg?t=1738969036",
        releaseDate: "2020-05-19",
        price: 30,
        tag: "Action",
    } , {
        name: "Mafia III: Definitive Edition",
        description: "After Lincoln Clay's surrogate family, the black mob, is betrayed and killed by the Italian Mafia, Lincoln builds a new family and blazes a path of revenge through the Mafioso responsible. 2",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/360430/header.jpg?t=1738969130",
        releaseDate: "2020-05-19",
        price: 30,
        tag: "Action",
    } , {
        name: "Doki Doki Literature Club Plus!",
        description: "Welcome to the club! Write poems for your crush and experience the terror of school romance in this critically-acclaimed psychological horror story. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1388880/header.jpg?t=1727387604",
        releaseDate: "2021-06-30",
        price: 15,
        tag: "Horror",
    } , {
        name: "Slay the Princess — The Pristine Cut",
        description: "You're here to slay the princess. Don't believe her lies. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1989270/header.jpg?t=1741956081",
        releaseDate: "2023-10-23",
        price: 18,
        tag: "Horror",
    } , {
        name: "Mirror's Edge™",
        description: "In a city where information is heavily monitored, couriers called Runners transport sensitive data. In this seemingly utopian paradise, a crime has been committed, & you are being hunted. You are a Runner called Faith and this innovative first-person action-adventure is your story. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/17410/header.jpg?t=1738878228",
        releaseDate: "2009-01-13",
        price: 3,
        tag: "Adventure",
    } , {
        name: "Mirror's Edge™ Catalyst",
        description: "Mirror's Edge™ Catalyst raises the action-adventure bar through fluid, first person action and immerses players in Faith's story as she fights for freedom. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1233570/header.jpg?t=1725569207",
        releaseDate: "2016-06-07",
        price: 3,
        tag: "Adventure",
    } , {
        name: "Mini Ninjas",
        description: "Mini Ninjas is a game that combines furious action with stealth and exploration for an experience that appeals to a wide audience across age groups and preferences. It’s an action-adventure with a strong focus on allowing the player freedom to explore the world and has the depth to allow for very varied ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/35000/header.jpg?t=1592492627",
        releaseDate: "2009-09-14",
        price: 2,
        tag: "Adventure",
    } , {
        name: "Far Cry® 2",
        description: "You are a gun for hire, trapped in a war-torn African state, stricken with malaria and forced to make deals with corrupt warlords on both sides of the conflict in order to make this country your home. You must identify and exploit your enemies' weaknesses, neutralizing their superior numbers and firepower ...",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/19900/header.jpg?t=1709317476",
        releaseDate: "2008-1022",
        price: 10,
        tag: "Open World",
    } , {
        name: "Far Cry 3",
        description: "Discover the dark secrets of a lawless island ruled by violence and take the fight to the enemy as you try to escape. You’ll need more than luck to escape alive! ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220240/header.jpg?t=1738250672",
        releaseDate: "2012-11-29",
        price: 20,
        tag: "Open World",
    } , {
        name: "Far Cry® 4",
        description: " Hidden in the towering Himalayas lies Kyrat, a country steeped in tradition and violence. You are Ajay Ghale. Traveling to Kyrat to fulfill your mother’s dying wish, you find yourself caught up in a civil war to overthrow the oppressive regime of dictator Pagan Min. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/298110/header.jpg?t=1739176495",
        releaseDate: "2014-11-18",
        price: 30,
        tag: "Open World",
    } , {
        name: "Far Cry® 5",
        description: "Discover the open world of Hope County, Montana, besieged by a fanatical doomsday cult. Dive into the action solo or two-player co-op in the story campaign, use a vast arsenal of weapons and allies, and free Hope County from Joseph Seed and his cult. ",
        image: "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/552520/header.jpg?t=1738249745",
        releaseDate: "2018-03-27",
        price: 60,
        tag: "Open World",
    }
    ]);

    const addGame = (newGame: Game) => {
        setGames([...games, newGame]);
    }

    const removeGame = (game: Game) => {
        setGames([...games.filter((inListGame) => inListGame.name !== game.name)]);
    }

    const checkGame = (game: Game) => {
        return games.filter((inListGame) => inListGame.name === game.name).length;
    }

    const updateGame = (gameTitle: string | null, updatedGame: Game) => {
        setGames(games.map((inListGame) => inListGame.name === gameTitle ? updatedGame : inListGame));
    }

    const sortGames = () => {
        const sortedGames = [...games];

        if(sortAscending){
            sortedGames.sort((a, b) => a.name.localeCompare(b.name))
        }
        else{
            sortedGames.sort((a, b) => b.name.localeCompare(a.name));
        }

        sortAscending = !sortAscending;
        setGames(sortedGames);
    }

    const getOldestGame = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }
        return localGames.reduce((maxGame, currentGame) => maxGame.releaseDate > currentGame.releaseDate ? currentGame : maxGame, games[0])
    }

    const getEarliestGame = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }
        return localGames.reduce((minGame, currentGame) => minGame.releaseDate < currentGame.releaseDate ? currentGame : minGame, games[0])
    }

    const getAverageGameByDate = () => {
        const localGames = [...games];
        if(localGames.length == 0) {
            return undefined;
        }
        return localGames.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)).at(Math.floor(localGames.length / 2));
    }

    return (
        <GamesContext.Provider value={{games, addGame, removeGame, checkGame, updateGame, sortGames, getOldestGame, getEarliestGame, getAverageGameByDate}}>
            {children}
        </GamesContext.Provider>
    );
}

export function useGames() {
    const context = useContext(GamesContext);
    if (!context) {
        console.error("useGames must be used within a GamesProvider");
    }
    return context;
}