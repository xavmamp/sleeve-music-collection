export type Album = {
    id: number,
    title: string,
    artist: string,
    cover?: string,
    year: number,
    genre: string,
    tracks: string[]
}

export const artists = [
    { slug: "britney-spears", name: "Britney Spears", image: "/britney-spears.png" },
    { slug: "esser", name: "Esser", image: "/esser-artist.jpg" },
    { slug: "daft-punk", name: "Daft Punk", image: "/daft-punk.jpg" },
];

export const albums: Album[] = [  // different from albums.ts, const albums here holds an array of Album objects
    {
        id: 1,
        title: "Circus",
        artist: "Britney Spears",
        cover: "/britney-spears-circus.png",
        year: 2008,
        genre: "Pop",
        tracks: [
            "Womanizer",
            "Circus",
            "Out from Under",
            "Kill the Lights",
            "Shattered Glass",
            "If U Seek Amy",
            "Unusual You",
            "Blur",
            "Mmm Papi",
            "Mannequin",
            "Lace and Leather",
            "My Baby",
            "Radar"
        ]
    },
    {
        id: 2,
        title: "Braveface",
        artist: "Esser",
        cover: "/esser-braveface.jfif",
        year: 2009,
        genre: "Electro",
        tracks: [
            "Leaving Town",
            "Braveface",
            "Headlock",
            "Bones",
            "Satisfied",
            "Work It Out",
            "I Love You",
            "This Time Around",
            "Real Life",
            "Stop Dancing"
        ]
    },
    {
        id: 3,
        title: "Discovery",
        artist: "Daft Punk",
        cover: "/daft-punk-discovery.jfif",
        year: 2001,
        genre: "Synth",
        tracks: [
            "One More Time",
            "Aerodynamic",
            "Digital Love",
            "Harder, Better, Faster, Stronger",
            "Crescendolls",
            "Nightvision",
            "Superheroes",
            "High Life",
            "Something About Us",
            "Voyager",
            "Veridis Quo",
            "Short Circuit",
            "Face to Face",
            "Too Long"
        ]
    },
    {
        id: 4,
        title: "Blackout",
        artist: "Britney Spears",
        cover: "/britney-spears-blackout.png",
        year: 2007,
        genre: "Pop",
        tracks: [
            "Gimme More",
            "Piece of Me",
            "Radar",
            "Break the Ice",
            "Heaven on Earth",
            "Get Naked (I Got a Plan)",
            "Freakshow",
            "Toy Soldier",
            "Hot as Ice",
            "Ooh Ooh Baby",
            "Perfect Lover",
            "Why Should I Be Sad"
        ]
    },
    {
        id: 5,
        title: "Enmity",
        artist: "Esser",
        cover: "/esser-enmity.jfif",
        year: 2012,
        genre: "Electro",
        tracks: [
            "Enmity",
            "S.ands",
            "A77"
        ]
    },
];