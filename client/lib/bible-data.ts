export interface BibleBook {
  name: string;
  abbreviation: string;
  chapters: number;
  testament: "OT" | "NT";
  category: string;
}

export const BIBLE_CATEGORIES = {
  pentateuch: "Pentateuch",
  history: "History Books",
  wisdom: "Wisdom",
  majorProphets: "Major Prophets",
  minorProphets: "Minor Prophets",
  gospels: "Gospels",
  acts: "Acts",
  pauline: "Pauline Epistles",
  general: "General Epistles",
  revelation: "Revelation",
};

export const BIBLE_BOOKS: BibleBook[] = [
  { name: "Genesis", abbreviation: "Gen", chapters: 50, testament: "OT", category: "pentateuch" },
  { name: "Exodus", abbreviation: "Ex", chapters: 40, testament: "OT", category: "pentateuch" },
  { name: "Leviticus", abbreviation: "Lev", chapters: 27, testament: "OT", category: "pentateuch" },
  { name: "Numbers", abbreviation: "Num", chapters: 36, testament: "OT", category: "pentateuch" },
  { name: "Deuteronomy", abbreviation: "Deut", chapters: 34, testament: "OT", category: "pentateuch" },
  { name: "Joshua", abbreviation: "Josh", chapters: 24, testament: "OT", category: "history" },
  { name: "Judges", abbreviation: "Judg", chapters: 21, testament: "OT", category: "history" },
  { name: "Ruth", abbreviation: "Ruth", chapters: 4, testament: "OT", category: "history" },
  { name: "1 Samuel", abbreviation: "1 Sam", chapters: 31, testament: "OT", category: "history" },
  { name: "2 Samuel", abbreviation: "2 Sam", chapters: 24, testament: "OT", category: "history" },
  { name: "1 Kings", abbreviation: "1 Kgs", chapters: 22, testament: "OT", category: "history" },
  { name: "2 Kings", abbreviation: "2 Kgs", chapters: 25, testament: "OT", category: "history" },
  { name: "1 Chronicles", abbreviation: "1 Chr", chapters: 29, testament: "OT", category: "history" },
  { name: "2 Chronicles", abbreviation: "2 Chr", chapters: 36, testament: "OT", category: "history" },
  { name: "Ezra", abbreviation: "Ezra", chapters: 10, testament: "OT", category: "history" },
  { name: "Nehemiah", abbreviation: "Neh", chapters: 13, testament: "OT", category: "history" },
  { name: "Esther", abbreviation: "Est", chapters: 10, testament: "OT", category: "history" },
  { name: "Job", abbreviation: "Job", chapters: 42, testament: "OT", category: "wisdom" },
  { name: "Psalms", abbreviation: "Ps", chapters: 150, testament: "OT", category: "wisdom" },
  { name: "Proverbs", abbreviation: "Prov", chapters: 31, testament: "OT", category: "wisdom" },
  { name: "Ecclesiastes", abbreviation: "Eccl", chapters: 12, testament: "OT", category: "wisdom" },
  { name: "Song of Solomon", abbreviation: "Song", chapters: 8, testament: "OT", category: "wisdom" },
  { name: "Isaiah", abbreviation: "Isa", chapters: 66, testament: "OT", category: "majorProphets" },
  { name: "Jeremiah", abbreviation: "Jer", chapters: 52, testament: "OT", category: "majorProphets" },
  { name: "Lamentations", abbreviation: "Lam", chapters: 5, testament: "OT", category: "majorProphets" },
  { name: "Ezekiel", abbreviation: "Ezek", chapters: 48, testament: "OT", category: "majorProphets" },
  { name: "Daniel", abbreviation: "Dan", chapters: 12, testament: "OT", category: "majorProphets" },
  { name: "Hosea", abbreviation: "Hos", chapters: 14, testament: "OT", category: "minorProphets" },
  { name: "Joel", abbreviation: "Joel", chapters: 3, testament: "OT", category: "minorProphets" },
  { name: "Amos", abbreviation: "Amos", chapters: 9, testament: "OT", category: "minorProphets" },
  { name: "Obadiah", abbreviation: "Obad", chapters: 1, testament: "OT", category: "minorProphets" },
  { name: "Jonah", abbreviation: "Jonah", chapters: 4, testament: "OT", category: "minorProphets" },
  { name: "Micah", abbreviation: "Mic", chapters: 7, testament: "OT", category: "minorProphets" },
  { name: "Nahum", abbreviation: "Nah", chapters: 3, testament: "OT", category: "minorProphets" },
  { name: "Habakkuk", abbreviation: "Hab", chapters: 3, testament: "OT", category: "minorProphets" },
  { name: "Zephaniah", abbreviation: "Zeph", chapters: 3, testament: "OT", category: "minorProphets" },
  { name: "Haggai", abbreviation: "Hag", chapters: 2, testament: "OT", category: "minorProphets" },
  { name: "Zechariah", abbreviation: "Zech", chapters: 14, testament: "OT", category: "minorProphets" },
  { name: "Malachi", abbreviation: "Mal", chapters: 4, testament: "OT", category: "minorProphets" },
  { name: "Matthew", abbreviation: "Matt", chapters: 28, testament: "NT", category: "gospels" },
  { name: "Mark", abbreviation: "Mark", chapters: 16, testament: "NT", category: "gospels" },
  { name: "Luke", abbreviation: "Luke", chapters: 24, testament: "NT", category: "gospels" },
  { name: "John", abbreviation: "John", chapters: 21, testament: "NT", category: "gospels" },
  { name: "Acts", abbreviation: "Acts", chapters: 28, testament: "NT", category: "acts" },
  { name: "Romans", abbreviation: "Rom", chapters: 16, testament: "NT", category: "pauline" },
  { name: "1 Corinthians", abbreviation: "1 Cor", chapters: 16, testament: "NT", category: "pauline" },
  { name: "2 Corinthians", abbreviation: "2 Cor", chapters: 13, testament: "NT", category: "pauline" },
  { name: "Galatians", abbreviation: "Gal", chapters: 6, testament: "NT", category: "pauline" },
  { name: "Ephesians", abbreviation: "Eph", chapters: 6, testament: "NT", category: "pauline" },
  { name: "Philippians", abbreviation: "Phil", chapters: 4, testament: "NT", category: "pauline" },
  { name: "Colossians", abbreviation: "Col", chapters: 4, testament: "NT", category: "pauline" },
  { name: "1 Thessalonians", abbreviation: "1 Thess", chapters: 5, testament: "NT", category: "pauline" },
  { name: "2 Thessalonians", abbreviation: "2 Thess", chapters: 3, testament: "NT", category: "pauline" },
  { name: "1 Timothy", abbreviation: "1 Tim", chapters: 6, testament: "NT", category: "pauline" },
  { name: "2 Timothy", abbreviation: "2 Tim", chapters: 4, testament: "NT", category: "pauline" },
  { name: "Titus", abbreviation: "Titus", chapters: 3, testament: "NT", category: "pauline" },
  { name: "Philemon", abbreviation: "Phlm", chapters: 1, testament: "NT", category: "pauline" },
  { name: "Hebrews", abbreviation: "Heb", chapters: 13, testament: "NT", category: "general" },
  { name: "James", abbreviation: "Jas", chapters: 5, testament: "NT", category: "general" },
  { name: "1 Peter", abbreviation: "1 Pet", chapters: 5, testament: "NT", category: "general" },
  { name: "2 Peter", abbreviation: "2 Pet", chapters: 3, testament: "NT", category: "general" },
  { name: "1 John", abbreviation: "1 John", chapters: 5, testament: "NT", category: "general" },
  { name: "2 John", abbreviation: "2 John", chapters: 1, testament: "NT", category: "general" },
  { name: "3 John", abbreviation: "3 John", chapters: 1, testament: "NT", category: "general" },
  { name: "Jude", abbreviation: "Jude", chapters: 1, testament: "NT", category: "general" },
  { name: "Revelation", abbreviation: "Rev", chapters: 22, testament: "NT", category: "revelation" },
];

export const DAILY_VERSES = [
  { reference: "Hebrews 4:12", text: "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart." },
  { reference: "Psalm 119:105", text: "Your word is a lamp for my feet, a light on my path." },
  { reference: "2 Timothy 3:16-17", text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work." },
  { reference: "Joshua 1:8", text: "Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it." },
  { reference: "Romans 15:4", text: "For everything that was written in the past was written to teach us, so that through the endurance taught in the Scriptures and the encouragement they provide we might have hope." },
  { reference: "Isaiah 55:11", text: "So is my word that goes out from my mouth: It will not return to me empty, but will accomplish what I desire and achieve the purpose for which I sent it." },
  { reference: "Matthew 4:4", text: "Jesus answered, It is written: Man shall not live on bread alone, but on every word that comes from the mouth of God." },
];

export function getRandomBook(): BibleBook {
  return BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
}

export function getRandomVerse(book: BibleBook): { book: string; chapter: number; verse: number } {
  const chapter = Math.floor(Math.random() * book.chapters) + 1;
  const verse = Math.floor(Math.random() * 20) + 1;
  return { book: book.name, chapter, verse };
}

export function getDailyVerse(): typeof DAILY_VERSES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

export function getBooksByCategory(category: string): BibleBook[] {
  return BIBLE_BOOKS.filter(book => book.category === category);
}

export function getBookIndex(bookName: string): number {
  return BIBLE_BOOKS.findIndex(book => book.name === bookName);
}
