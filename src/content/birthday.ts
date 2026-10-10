/**
 * SONU.EXE — all personal content lives here.
 * Replace any value wrapped like "[ADD_SOMETHING]" with real content.
 * Placeholder values are never shown raw to the visitor — a tasteful
 * fallback (see `fallback` fields or <Txt/>) is displayed instead.
 * Image/audio paths point to /public/assets/... (see public/assets/README.md).
 */

export type Answer = { label: string; response: string };
export type Question = { label?: string; prompt: string; answers: Answer[] };
export type Benefit = {
  title: string;
  icon: "heart" | "tv" | "crown" | "sparkles";
  front: string;
  reveal: string;
  sticker?: string;
  stat: string;
};
export type Photo = {
  id: string;
  chapter: string;
  caption: string;
  date?: string;
  image: string;
  alt: string;
  sticker?: string;
  imaginary?: boolean;
};
export type LilyCategory = "joke" | "memory" | "compliment" | "prediction" | "secret";

export const birthday = {
  recipient: "Sonu",
  sender: "[ADD_SENDER_NAME]",
  birthdayISO: "2026-10-11T00:00:00", // local midnight
  siteTitle: "SONU.EXE",

  countdown: {
    title: "SONU.EXE is still compiling…",
    subtitle: "Unlocks on October 11. No peeking. (Fine, peek.)",
    peekLabel: "Peek early anyway",
    lateNote: "Opened late? The kingdom forgives you. Mostly.",
  },

  nav: { next: "Continue", back: "Back", replay: "Replay from the start", skip: "Skip" },

  chapters: [
    "Secret Invitation",
    "OH. IT'S YOU.",
    "SECURITY IS A JOKE",
    "The Benefits of Knowing Me",
    "The Friendship Documentary",
    "The Lily Heist",
    "The Birthday Ceremony",
    "The Plot Twist: I Mean It",
    "Epilogue: The Royal Portrait",
  ],

  invitation: {
    title: "A Secret Invitation",
    subtitle: "Sonu, you've been summoned. Unfortunately for you, I'm involved.",
    letterHeading: "A Secret Invitation",
    letterBody: "[ADD_INVITATION_COPY]",
    letterFallback: `To Her Most Matcha-Devoted Majesty, Sonu,

Hear ye, hear ye!

It has come to my attention that it is thy birthday. Naturally, I took this personally.

Whilst ordinary peasants may resort to sending a mere text message, I, a man of extraordinary intellect and deeply questionable priorities, have prepared something far more elaborate.

Thou hast been summoned to an experience of unparalleled magnificence, questionable historical accuracy, and an alarming amount of effort invested by someone who should frankly know better.

Consider this thy official invitation to witness the greatness of the Crown.

Attendance is mandatory. Gratitude is expected. Matcha is strictly prohibited until further notice.

Now, enough standing about looking important.

Open the envelope, Your Majesty. The king has places to be.

By order of the Most Important Man in Thy Browser History.`,
    button: "Accept the summons",
  },

  welcome: {
    title: "OH. IT'S YOU.",
    subtitle: "The birthday girl has arrived. Everyone act surprised.",
    announcement: "HER MAJESTY HAS LOGGED IN.",
    message: "The kingdom was peaceful for approximately three seconds. Then you arrived.",
    sticker: "/assets/photos/birthdaysticker.png",
    stickerCaption: "the source of the kingdom's problems",
    dancers: [
      "/assets/gifs/gifcraft-cat.gif",
      "/assets/gifs/gifcraft-cat2.gif",
      "/assets/gifs/gifcraft-cat3.gif",
      "/assets/gifs/gifcraft-aligator.gif",
      "/assets/gifs/gifcraft-cat2.gif",
      "/assets/gifs/gifcraft-aligator.gif",
      "/assets/gifs/gifcraft-cat.gif",
      "/assets/gifs/gifcraft-cat3.gif",
    ],
    ticker:
      "BREAKING: DIGNITY HAS LEFT THE PALACE · CATS ARE NOW IN CHARGE · THE ROYAL STAFF IS UNDERQUALIFIED ·",
    closing: "Please remain calm. The royal staff clearly cannot.",
    button: "Fine, what's next? →",
  },

  security: {
    title: "DEPARTMENT OF BIRTHDAY SECURITY",
    subtitle: "Form BDAY-11/10 · Identity verification required",
    intro: `Hold it right there.

Before you proceed, the Royal Department of Birthday Affairs must establish that you are, in fact, Sonu.

Because if I've built this entire thing for the wrong person, I'm deleting the internet.

Answer carefully. I am watching.

Not literally. Don't get excited. The surveillance budget was denied.`,
    questions: [
      {
        label: "QUESTION 01 — STATE YOUR BUSINESS",
        prompt: "Why have you entered this establishment?",
        answers: [
          {
            label: "It's my birthday.",
            response:
              "Correct. Unfortunately, knowing basic facts about yourself is not an achievement. Your birthday privileges remain under review.",
          },
          {
            label: "I heard there was cake.",
            response:
              "Finally, someone who understands the economy. You may proceed to the dessert department.",
          },
          {
            label: "I came to see you.",
            response:
              "...Oh?\n\nThe court would like to remind the applicant that statements of this nature may be used as evidence at a later date.\n\nThe royal stenographer is typing unusually slowly.",
          },
        ],
      },
      {
        label: "QUESTION 02 — THE HIGHLY SCIENTIFIC ASSESSMENT",
        prompt: "Who is the most important man in your browser history?",
        answers: [
          {
            label: "You, obviously.",
            response:
              "At last. Literacy. Critical thinking. A functioning civilisation. I knew this education system had potential.",
          },
          {
            label: "Google.",
            response: "Google cannot build you a birthday website. Checkmate, search engine.",
          },
          {
            label: "Some guy on YouTube.",
            response:
              "GUARDS.\n\nREMOVE HER FROM THE PREMISES.\n\n...Actually, wait. We need her to finish the birthday website.\n\nBring her back.",
          },
        ],
      },
    ] as Question[],
    questionFallback: "Security question pending clearance.",
    responseFallback: "Answer logged. Suspicious, but accepted.",
    finalPrompt: "THE ROYAL COURT REQUIRES A STATEMENT.",
    finalQuestion:
      "Do you admit that your life has been made at least 17% more entertaining by my existence?",
    percentageNote:
      "Percentage calculated by the person who benefits from the findings. Peer review pending.",
    yes: "YES, YOUR MAJESTY",
    no: "NO.",
    noTaunts: [
      "Oh, we're doing this?",
      "Sonu. Be serious for one second in your life.",
      "Fine. I shall not force thee to acknowledge my greatness.\n\nI shall simply record thy refusal in the royal archives and remember it until the end of time.\n\nThe king is reportedly handling this maturely.",
    ],
    noResponse:
      "The court reminds the applicant that all answers are voluntary, but some will be remembered by the king until the collapse of civilisation.",
    yesResponse: "I knew you were intelligent.\n\nIt's one of your few redeeming qualities.",
    approved: "ANSWER ACCEPTED UNDER PROTEST",
    backgroundCheck: "BACKGROUND CHECK: 0% TRUSTWORTHY",
    birthdayPrivileges: "BIRTHDAY PRIVILEGES: 100% RESTORED",
    clearance: [
      "Identity confirmed: Sonu.",
      "Threat level: Birthday girl.",
      "Matcha dependency: Classified.",
      "Hindi proficiency: An ongoing investigation.",
      "Ego levels: Concerning.",
      "Access granted: Because the king has other things to do.",
    ],
    accessGranted: "ACCESS GRANTED",
    button: "PROCEED, PEASANT →",
    footer: "(That's you. I'm the king.)",
  },

  benefits: {
    title: "The Benefits of Knowing Me",
    subtitle: "Annual Report · Birthday Edition · Definitely Not Biased",
    disclaimer:
      "Prepared by me. Reviewed by me. Approved by me. Any complaints may be directed to me, where they will be ignored.",
    numbersHeading: "THE NUMBERS SPEAK FOR THEMSELVES",
    stats: [
      {
        value: "1,204%",
        fallback: "1,204%",
        label: "Increase in unsolicited memes you've received.",
        note: "",
      },
      {
        value: "0.3 seconds",
        fallback: "0.3 seconds",
        label: "My reply time when there's gossip.",
        note: "Suddenly, I don't believe in slow replies.",
      },
      { value: "∞", fallback: "∞", label: "Times I've been right.", note: "Source: trust me bro." },
    ],
    cards: [
      {
        title: "Emotional Support",
        icon: "heart",
        front: "Tap to reveal",
        reveal: `Basically, free therapy. With bullying.

You get to yap about literally anything, and I'll listen. Even when the story has 17 unnecessary side characters and absolutely no plot.

I'll give you advice, help you overthink the situation, tell you you're being stupid, and then help you anyway.

Because apparently, I have chosen this life for myself.

Customer review:

"He called me dumb and then helped me fix the problem. 10/10 service. Unfortunately, he's aware of his value."

Disclaimer: I will bring this up whenever you annoy me. This is a legally binding arrangement.`,
        stat: "24/7 hotline",
        sticker: "certified",
      },
      {
        title: "Premium Entertainment",
        icon: "tv",
        front: "Tap to reveal",
        reveal: `Boredom? Never heard of her.

Imagine having access to my brain for free.

Actually, don't. Some of the stuff going on in there probably violates several international treaties.

Your benefits include:

- Random memes that make absolutely no sense until 3 AM.
- Unnecessary commentary on literally everything.
- Opinions nobody asked for but everyone desperately needs.
- A professional yapper available for extended nonsense sessions.
- The occasional genuinely good idea. Those are rare, so please appreciate them.

Netflix could never.

At least Netflix has a monthly subscription fee. I just have an ego and unlimited things to say.`,
        stat: "no ads, all chaos",
        sticker: "5 stars",
      },
      {
        title: "Exclusive Privileges",
        icon: "crown",
        front: "Tap to reveal",
        reveal: `Girl, do you understand the deal you've got?

Let's review.

You know a guy who is funny, intelligent, emotionally available on a suspiciously case-by-case basis, and humble enough to list all his own qualities.

You get premium nonsense, unsolicited assistance, questionable life advice, and a personalised birthday website because apparently a normal birthday message wasn't enough.

WHO DOES THIS?

Normal people send cake emojis.

I have apparently established a digital monarchy.

Your membership includes:

- Lifetime access to my nonsense.
- Unlimited opportunities to bully me.
- Occasional wisdom disguised as stupidity.
- The privilege of saying "I know him" and having that be factually correct.

Membership is non-transferable. Mostly because I don't think anyone else would put up with this.`,
        stat: "members only",
        sticker: "VIP",
      },
    ] as Benefit[],
    finePrint: `Honestly, you're welcome.

I would say you're lucky to know me, but I fear your ego might become as unbearable as mine.

Anyway, happy birthday, Your Majesty. Please enjoy your complimentary lifetime subscription to having me around.

Refunds unavailable. The king has left the premises.`,
    softCard: {
      title: "A VERY SMALL, VERY OFFICIAL NOTE",
      reveal:
        "Jokes aside, I'm genuinely glad I got to know you. Life would be a little less entertaining without you in it.\n\n— The most important man in your browser history ♡",
      fallback:
        "Jokes aside, I'm genuinely glad I got to know you. Life would be a little less entertaining without you in it.\n\n— The most important man in your browser history ♡",
    },
    revealFallback: "Benefit details are classified. Ask the management.",
    button: "Roll the documentary",
  },

  documentary: {
    title: "The Friendship Documentary",
    subtitle: "A scrapbook in several questionable acts",
    imaginaryLabel: "Imaginary edit — not a real photo",
    photos: [
      {
        id: "pic1",
        chapter: "",
        caption: "",
        image: "/assets/photos/pics1.png",
        alt: "Sonu and a friend in matching red outfits",
      },
      {
        id: "pic2",
        chapter: "",
        caption: "",
        image: "/assets/photos/pics2.png",
        alt: "Sonu and a friend together on a boat at sunset",
      },
      {
        id: "pic3",
        chapter: "",
        caption: "",
        image: "/assets/photos/pics3.png",
        alt: "Two moments with Sonu and friends at a cafe",
      },
      {
        id: "pic4",
        chapter: "",
        caption: "",
        image: "/assets/photos/pics4.png",
        alt: "Two playful group selfies with Sonu and friends",
      },
    ] as Photo[],
    captionFallback: "Caption coming soon",
    button: "Begin the heist",
  },

  lilies: {
    game: {
      heading: "The Lily Heist",
      opening:
        "Your Majesty, the royal garden is in chaos. The lilies are floating, the matcha supply is unsecured, and the king has somehow made himself a target. Your mission: recover the flowers, secure the matcha, collect the golden bonus tokens, and absolutely do not let the king get away with his nonsense.",
      controls: "Drag back to aim. Release to shoot. Arrows refill as you play.",
      roundSeconds: 120,
      armButton: "ARM THE BOW →",
      resultsHeading: "THE KING HAS BEEN DEFEATED.",
      resultsEscapeHeading: "THE KING ESCAPED. THE GARDEN DIDN'T.",
      kingHitEnding:
        "The lilies are recovered. The matcha supply is secure. His Majesty's dignity is nowhere to be found.\n\nAnd somehow, even after being shot approximately seventeen times, he still thinks you're cute.\n\nSome men simply cannot learn.",
      kingMissEnding:
        "The lilies are recovered. The matcha supply is secure. His Majesty escaped the arrows and is being unbearably smug about it.\n\nThe court is investigating how he still has any dignity left.",
      ending: "Happy birthday, Sonu. The kingdom is lucky to have you. ♡",
      replay: "PLAY AGAIN",
      continueButton: "CLAIM YOUR ROYAL VICTORY →",
      points: { lily: 10, matcha: 20, bonus: 30, king: 50 },
      reactions: {
        lily: [
          "A flower secured. The royal florist can finally sleep.",
          "One lily down. The king is pretending this was all part of the plan.",
        ],
        matcha: [
          "THE ROYAL TREASURY HAS BEEN ROBBED.",
          "Matcha acquired. Financial stability has left the kingdom.",
        ],
        bonus: [
          "Bonus token secured. The royal treasurer has started sweating.",
          "Shiny loot recovered. The kingdom's budget remains a mystery.",
        ],
        king: [
          "OW. You could've just said you wanted my attention, Sonu.",
          "Damn, girl. Nice aim. Didn't know I was your type of target.",
          "Not you attacking the one man who made you an entire birthday website. Ungrateful. Adorable, but ungrateful.",
          "If this is how you flirt, I fear for my physical safety.",
          "You really saw the lilies, the matcha, and the compliments and chose violence. Interesting.",
          "That was personal. Was it the face? Understandable, honestly.",
          "You have my attention. The arrow was honestly unnecessary.",
          "Girl, I'm literally standing here looking cute. Have some respect.",
        ],
      },
    },
  },

  ceremony: {
    title: "The Birthday Ceremony",
    subtitle: "Every queen deserves fire. Controlled, candle-sized fire.",
    light: "Light the candles",
    countdown: ["3", "2", "1"],
    lit: "Make a wish, then blow.",
    micButton: "Blow into the mic",
    micExplain: "Uses your microphone only to hear a blow. Nothing is recorded or sent anywhere.",
    micDenied: "No microphone? No problem. Use the button instead.",
    manualButton: "Blow them out",
    out: "Wish received. Processing…",
    envelopeLabel: "There's one more thing.",
    button: "Open the envelope",
  },

  letter: {
    salutation: "happy birthday, sonuuuu ❤️🎀",
    salutationFallback: "Dear Sonu,",
    body: `okay first of all, how are you getting older already??? like who allowed this to happen. i genuinely refuse to believe that you're supposed to be a year older because in my head you're still the same little cutie who needs to be protected from literally everything and everyone, including her own questionable decisions 😭

but jokes apart, happy birthday, sonu. i really really hope you have the best day ever because you genuinely deserve so much happiness. and i don't mean that in the usual birthday wish way where people just say things because it's someone's birthday. i actually mean it.

i hope this year brings you so many good things. i hope you get everything you've been working towards, all the things you've been wishing for, and even the things you haven't told anyone about yet. i hope you have more reasons to be happy, more moments where you laugh until you can't breathe, more days where everything just feels right, and fewer days where you have to overthink everything. and whenever things do get difficult, i hope you remember that you don't have to have everything figured out all the time. you're allowed to take your time, make mistakes, change your mind, and just exist without putting so much pressure on yourself.

also, i really hope you know how adorable you are. and no, i'm not saying this just because it's your birthday and i'm supposed to be nice to you. unfortunately, this is a year-round problem. the specs, the curls, the little moles, your expressions, the way you get excited about things, the way you talk about matcha like it's a fundamental human necessity 😭😭 there's just so much about you that makes you YOU, and i genuinely don't think you realise how cute you can be without even trying.

and yes, before you ask, i will continue being annoying about it. you brought this upon yourself.

but honestly, one thing i'm really glad about is that i got to know you. out of all the people in this world, somehow our paths crossed, and now i have all these little memories and random things that remind me of you. and i think that's pretty special. i don't think every person we meet ends up becoming someone we remember in the smallest, most random moments of our day, but you're definitely someone who does that for me.

sometimes it's literally the most insignificant thing that reminds me of you, and suddenly i'm smiling at my phone like an idiot. and then i realise how stupid i look and have to get back to whatever i was doing 😭

i really like the little moments we've had together. even the ones that probably didn't seem like a big deal at the time. the conversations, the random nonsense, the teasing, and just being around you. i don't think every memory has to be some huge, extraordinary thing to mean something. sometimes it's just the fact that you were there that makes it memorable.

and i hope we get to make a lot more of those memories.

i also hope that this year you become even more confident in yourself and see yourself a little more kindly. because i know i can sit here and tell you a million times how pretty, cute, talented, or wonderful you are, but what matters more is that you get to see those things in yourself too. i hope you never feel like you have to be a certain way to be appreciated, or that you have to earn the good things that come into your life. you deserve to be happy on the days when you're doing amazing, and you deserve just as much love and kindness on the days when you're not feeling like yourself.

and please never lose the little things that make you who you are. your weirdness, your expressions, your excitement over random things, your little habits, all of it. even the things you might think are silly. especially those, actually. they're part of what makes you so lovely to know.

okay enough emotional nonsense because you're probably going to read this and bully me for being sappy 😭 but it's your birthday, so you're legally required to tolerate me.

i hope you eat lots of good food, get lots of presents, take a million pictures, have the prettiest day, and get spoiled exactly as much as you deserve. i hope your matcha is perfect, your lilies are pretty, and absolutely nothing ruins your mood today. and if something does, tell me who it is. i just want to talk. very peacefully, obviously.

happy birthday once again, sonu. ❤️

i'm really glad you were born, and i'm really glad i got to know you. i hope this next year is kind to you, makes you happy in ways you don't expect, and gives you so many little things to look forward to.

now go enjoy your birthday, birthday girl. and remember that no matter how old you get, you'll still be an adorable little idiot to me. some things are simply never going to change. 😭🎀❤️`,
    bodyFallback:
      "This letter is still being written by hand.\n\nIt will be here soon — and it will be worth the wait.",
    signature: "",
    signatureFallback: "",
    postscript: "[ADD_POSTSCRIPT]",
    button: "One last thing",
  },

  portrait: {
    title: "The Royal Portrait",
    subtitle: "A souvenir for Her Majesty.",
    explain:
      "If you'd like, I'll ask your browser for camera access to take a Polaroid. The photo stays on your device — nothing is uploaded or saved anywhere unless you download it.",
    startButton: "Take my portrait",
    skipButton: "Skip the portrait",
    capture: "Capture",
    retake: "Retake",
    download: "Download",
    unavailable: "Camera unavailable or permission denied. The crown fits anyway.",
    caption: "Sonu · 11.10.2026 · Long may she reign",
    finalTitle: "Happy Birthday, Sonu.",
    finalBody: "[ADD_FINAL_MESSAGE]",
    finalFallback: "Thank you for playing. Now go eat actual cake.",
  },

  audio: {
    music: "/assets/audio/Nessa%20Barrett%20-%20Love%20Looks%20Pretty%20On%20You%20Lyrics.mp3",
    heartfelt: "/assets/audio/Nessa%20Barrett%20-%20Love%20Looks%20Pretty%20On%20You%20Lyrics.mp3",
  },
};

export type BirthdayContent = typeof birthday;
