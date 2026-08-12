#!/usr/bin/env node
/**
 * Dev-only seed script. Populates the database with 15-20 fake 2000s-MySpace
 * -flavored accounts and randomized interactions between them, purely so the
 * app has visible activity while developing locally.
 *
 * NOT for production use. Never wire this into a deploy pipeline.
 *
 * Usage:
 *   SEED_SCRIPT_CONFIRM=yes npm run seed
 *   SEED_SCRIPT_CONFIRM=yes node --env-file=.env.local scripts/seed.mjs
 *
 * Requires SUPABASE_SECRET_KEY (service role) and NEXT_PUBLIC_SUPABASE_URL
 * in the environment — the same .env.local the app itself uses. The service
 * role key bypasses RLS entirely, which is what lets this script write
 * directly into every table instead of acting through the app's own
 * (friends-only, auth-scoped) server actions.
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Safety guard
// ---------------------------------------------------------------------------

if (process.env.SEED_SCRIPT_CONFIRM !== "yes") {
  console.error(
    "Refusing to run: this seed script writes a batch of fake accounts and\n" +
      "interactions directly into the database. Set SEED_SCRIPT_CONFIRM=yes\n" +
      "if you really mean to run it against the project in NEXT_PUBLIC_SUPABASE_URL.\n\n" +
      "  SEED_SCRIPT_CONFIRM=yes npm run seed\n",
  );
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/seed.js",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Content pools — hand-written 2000s MySpace/scene-kid flavor, not Lorem
// Ipsum or default Faker output.
// ---------------------------------------------------------------------------

// { username, displayName } — usernames stay within the app's own
// ^[a-z0-9_]{3,20}$ constraint; displayName carries the Y2K styling instead.
const ACCOUNTS = [
  { username: "glitterbomb", displayName: "*~*Glitter~*~" },
  { username: "guitarhero04", displayName: "guitarhero04" },
  { username: "xoxo_britney", displayName: "xoxo Britney xoxo" },
  { username: "sk8ter_boi", displayName: "sk8ter boi" },
  { username: "emo_kid_2005", displayName: "emo kid <3" },
  { username: "punkrock_prncss", displayName: "PunkRock Prncss" },
  { username: "myspace_angel", displayName: "MySpace Angel" },
  { username: "xxscene_kidxx", displayName: "xXScene_KidXx" },
  { username: "dashboard_fan", displayName: "dashboard confessional #1 fan" },
  { username: "bandom_babe", displayName: "bandom babe" },
  { username: "its_just_lex", displayName: "its.just.lex" },
  { username: "cute_but_psycho", displayName: "cute but psycho" },
  { username: "emo_princess", displayName: "~*Emo Princess*~" },
  { username: "blink182fan", displayName: "blink182fan" },
  { username: "hot_topic_kid", displayName: "Hot Topic Kid" },
  { username: "livejournal_babe", displayName: "LiveJournal Babe" },
  { username: "xanga_queen", displayName: "Xanga Queen" },
  { username: "razr_flip_kid", displayName: "razr flip kid" },
  { username: "napster_ninja", displayName: "napster ninja" },
  { username: "warped_tour_kid", displayName: "Warped Tour Kid '05" },
];

const TAGLINES = [
  "here for a good time not a long time",
  "MCRmy 4 lyfe",
  "your fave's fave",
  "punk's not dead",
  "single and ready to mingle lol jk",
  "add me if we have 2+ classes together",
  "brb, downloading limewire",
  "currently obsessed with my chem",
  "warped tour changed my life",
  "will trade friendship bracelets for comments",
  "professional away-message writer",
  "if found, return to hot topic",
  "burning cds for my crush rn",
  "captain of the emo squad",
  "too glittery to be stopped",
  "aim status: idle",
  "dial-up but make it fashion",
  "scene queen in training",
  "life is short, glitter is forever",
  "comment my page and i'll comment back i promise",
];

const MOODS = [
  "bored.",
  "listening to fall out boy on repeat",
  "waiting for AIM to load",
  "so over drama rn",
  "at band practice",
  "can't stop thinking about warped tour",
  "eyeliner game strong today",
  "new layout who dis",
  "grounded again lol",
  "burning a mix cd",
  "just got back from hot topic",
  "counting down to the weekend",
  null, // some profiles leave mood blank
  null,
];

const AWAY_MESSAGES = [
  "brb, walking the dog",
  "at band practice, text my cell",
  "grounded, can't talk rn",
  "downloading something, be back in like an hour",
  "sleeping. do not disturb (jk wake me up)",
  "at the mall with friends",
  "homework then i'm back",
  "phone died, on the desktop later",
];

const ABOUT_ME = [
  "I'm just a girl who loves music, glitter, and my best friends. Add me if you're cool!",
  "Guitar player, coffee addict, professional daydreamer. Comment my page and I'll comment back!",
  "Not like the other girls (jk I'm exactly like them). Obsessed with emo bands and Hot Topic.",
  "Skater, gamer, occasional poet. Currently trying to beat my LimeWire download speed record.",
  "Scene kid by night, straight-A student by day. Don't judge my Top 8, it changes weekly.",
  "I live for concerts, sleepovers, and burning mix CDs for my friends. AIM me anytime.",
  "Just here to vibe and post song lyrics as my status. My Chem Romance saved my life fr.",
  "Aspiring rockstar. Currently learning guitar from a VHS tape lol.",
  "I collect band tees and broken hearts. Warped Tour 2005 was the best day of my life.",
  "Certified internet sweetheart. Slide into my comments, not my DMs (we don't have those yet).",
];

const INTEREST_WORDS = [
  "My Chemical Romance",
  "Fall Out Boy",
  "Dashboard Confessional",
  "Blink-182",
  "Paramore",
  "The Used",
  "AFI",
  "Yellowcard",
  "Panic! At The Disco",
  "Taking Back Sunday",
  "AIM away messages",
  "dial-up internet",
  "LimeWire",
  "Napster",
  "burning CDs",
  "Hot Topic",
  "glitter gel pens",
  "friendship bracelets",
  "Warped Tour",
  "skateboarding",
  "disposable cameras",
  "Motorola Razr",
  "Xanga",
  "LiveJournal",
  "MSN Messenger",
  "scene hair",
  "eyeliner",
  "band tees",
  "mix tapes",
];

const LOCATIONS = [
  "Ohio",
  "somewhere in Cali",
  "the burbs",
  "NYC",
  "your mom's basement lol",
  "Jersey",
  "the midwest",
  "Texas, y'all",
  "PNW",
  "Florida (send help)",
  "Cleveland",
  "Chicago suburbs",
  "SoCal",
  "the 216",
  "Pennsylvania",
];

const POST_PHRASES = [
  "just downloaded the new fall out boy album, my life is complete",
  "why does dial-up take FOREVER",
  "burning a mix cd rn, don't tell anyone who it's for",
  "warped tour tickets go on sale tomorrow, who's going!!",
  "new layout, comment and tell me what you think!!",
  "can't sleep, listening to dashboard confessional",
  "my mom won't let me get my lip pierced :(",
  "just changed my away message for the 5th time today",
  "who wants to be my top friend",
  "band practice was insane today",
  "found the best emo playlist ever, comment if you want the link",
  "school is literally the worst, someone save me",
  "got my hair dyed today!! pics soon",
  "currently obsessed with this new band, no one's heard of them yet",
  "aim is being so slow today ugh",
  "just got back from hot topic, spent way too much money",
  "if you're reading this, comment 'xoxo'",
  "my top 8 is about to get shaken up, watch out",
  "does anyone else's away message just say brb for 3 days straight",
  "found my old mixtapes, so much nostalgia rn",
];

const WALL_PHRASES = [
  "omg hey!! love your new layout",
  "just wanted to say hi :)",
  "your top 8 is looking cute today",
  "we need to hang out soon!!",
  "loved your last post, so true",
  "xoxo miss you!!",
  "your icon is so cute where'd you get it",
  "add me to your top 8 pls lol jk...unless",
  "we should burn cds together sometime",
  "saw you at warped tour last week!! so fun",
  "your away message made me laugh so hard",
  "come over later? my mom said it's fine",
];

const MESSAGE_PHRASES = [
  "hey what's up",
  "nm just bored, u?",
  "same lol. wanna hang out later",
  "yeah for sure, what time",
  "idk maybe like 5?",
  "sounds good!! see you then",
  "omg did you see the new layout on the top 8 page",
  "yes it's so cute",
  "we should do that for yours too",
  "fr let's do it this weekend",
  "brb my mom's calling me",
  "kk text me when ur back",
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomSubset(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Random timestamp between `daysAgoMax` and `daysAgoMin` days in the past
// (defaults spread across the last ~6 weeks), so activity doesn't all
// cluster at "now".
function randomBackdate(daysAgoMax = 42, daysAgoMin = 0) {
  const ms = randomInt(daysAgoMin * 86400_000, daysAgoMax * 86400_000);
  return new Date(Date.now() - ms).toISOString();
}

async function insertChunked(table, rows, chunkSize = 200) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`  ! insert into ${table} failed: ${error.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Step 1: accounts
// ---------------------------------------------------------------------------

async function createAccounts() {
  console.log(`Creating ${ACCOUNTS.length} accounts...`);
  const created = [];

  for (const { username, displayName } of ACCOUNTS) {
    const email = `${username}@backspace-seed.test`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: `Seed-${username}-2005!`,
      email_confirm: true,
      user_metadata: { username, display_name: displayName },
    });

    if (error || !data.user) {
      console.error(`  ! could not create ${username}: ${error?.message}`);
      continue;
    }

    // The on_auth_user_created trigger already inserted a bare profile row
    // (see 0001_init.sql) — fill in the rest of the seed flavor now.
    const status = randomChoice(["online", "online", "away", "away", "offline", "offline"]);
    const lastActiveAt = randomBackdate(14, 0);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        tagline: randomChoice(TAGLINES),
        mood_status: randomChoice(MOODS),
        away_message: status === "away" ? randomChoice(AWAY_MESSAGES) : null,
        about_me: randomChoice(ABOUT_ME),
        interests: randomSubset(INTEREST_WORDS, randomInt(4, 7)).join(", "),
        location: randomChoice(LOCATIONS),
        status,
        last_active_at: lastActiveAt,
        profile_views: randomInt(0, 250),
      })
      .eq("id", data.user.id);

    if (updateError) {
      console.error(`  ! could not fill in profile for ${username}: ${updateError.message}`);
      continue;
    }

    created.push({ id: data.user.id, username, displayName });
    console.log(`  + ${username} (${status})`);
  }

  return created;
}

// ---------------------------------------------------------------------------
// Step 2: friendships (~40-60% density, mix of pending/accepted)
// ---------------------------------------------------------------------------

async function createFriendships(accounts) {
  console.log("\nCreating friendships...");

  const pairs = [];
  for (let i = 0; i < accounts.length; i++) {
    for (let j = i + 1; j < accounts.length; j++) {
      pairs.push([accounts[i], accounts[j]]);
    }
  }

  const density = 0.4 + Math.random() * 0.2; // 40-60%
  const connectedPairs = shuffle(pairs).slice(0, Math.round(pairs.length * density));

  const friendshipRows = [];
  const notificationRows = [];
  // adjacency map of ACCEPTED friendships only, used by later steps
  const acceptedFriendsOf = new Map(accounts.map((a) => [a.id, []]));

  for (const [a, b] of connectedPairs) {
    const [requester, recipient] = Math.random() < 0.5 ? [a, b] : [b, a];
    const isAccepted = Math.random() < 0.8; // most connections are settled
    const createdAt = randomBackdate(50, 3);
    const id = crypto.randomUUID();

    friendshipRows.push({
      id,
      requester_id: requester.id,
      recipient_id: recipient.id,
      status: isAccepted ? "accepted" : "pending",
      created_at: createdAt,
      accepted_at: isAccepted ? randomBackdate(3, 0) : null,
    });

    notificationRows.push({
      user_id: recipient.id,
      type: "friend_request",
      actor_id: requester.id,
      reference_id: id,
      created_at: createdAt,
    });

    if (isAccepted) {
      notificationRows.push({
        user_id: requester.id,
        type: "friend_accepted",
        actor_id: recipient.id,
        reference_id: id,
        created_at: randomBackdate(3, 0),
      });
      acceptedFriendsOf.get(requester.id).push(recipient);
      acceptedFriendsOf.get(recipient.id).push(requester);
    }
  }

  await insertChunked("friendships", friendshipRows);
  await insertChunked("notifications", notificationRows);

  const acceptedCount = friendshipRows.filter((f) => f.status === "accepted").length;
  console.log(
    `  + ${friendshipRows.length} friendships (${acceptedCount} accepted, ` +
      `${friendshipRows.length - acceptedCount} pending)`,
  );

  return acceptedFriendsOf;
}

// ---------------------------------------------------------------------------
// Step 3: Top 8, for accounts with 8+ accepted friends
// ---------------------------------------------------------------------------

async function createTop8s(acceptedFriendsOf) {
  console.log("\nPopulating Top 8s...");
  const rows = [];

  for (const [userId, friends] of acceptedFriendsOf) {
    if (friends.length < 8) continue;
    const chosen = randomSubset(friends, 8);
    chosen.forEach((friend, i) => {
      rows.push({ user_id: userId, friend_id: friend.id, position: i + 1 });
    });
  }

  await insertChunked("top8", rows);
  console.log(`  + ${rows.length / 8 || 0} accounts got a full Top 8`);
}

// ---------------------------------------------------------------------------
// Step 4: posts (0-6 per account, backdated over the last several weeks)
// ---------------------------------------------------------------------------

async function createPosts(accounts) {
  console.log("\nCreating posts...");
  const rows = [];

  for (const account of accounts) {
    const postCount = randomInt(0, 6);
    for (let i = 0; i < postCount; i++) {
      rows.push({
        id: crypto.randomUUID(),
        user_id: account.id,
        content: randomChoice(POST_PHRASES),
        gif_url: null,
        created_at: randomBackdate(45, 0),
      });
    }
  }

  await insertChunked("posts", rows);
  console.log(`  + ${rows.length} posts`);
  return rows;
}

// ---------------------------------------------------------------------------
// Step 5: wall comments — only between friends, weighted toward more
// "socially central" accounts (more accepted friends = more wall activity).
// ---------------------------------------------------------------------------

async function createWallComments(accounts, acceptedFriendsOf) {
  console.log("\nCreating wall comments...");
  const rows = [];
  const notificationRows = [];

  for (const account of accounts) {
    const friends = acceptedFriendsOf.get(account.id) || [];
    if (friends.length === 0) continue;

    // More friends -> more people stopping by to leave a comment.
    const commentCount = randomInt(0, Math.min(6, friends.length + 1));
    for (let i = 0; i < commentCount; i++) {
      const author = randomChoice(friends);
      const id = crypto.randomUUID();
      const createdAt = randomBackdate(40, 0);

      rows.push({
        id,
        profile_id: account.id,
        author_id: author.id,
        content: randomChoice(WALL_PHRASES),
        gif_url: null,
        created_at: createdAt,
      });

      notificationRows.push({
        user_id: account.id,
        type: "wall_comment",
        actor_id: author.id,
        reference_id: id,
        created_at: createdAt,
      });
    }
  }

  await insertChunked("wall_comments", rows);
  await insertChunked("notifications", notificationRows);
  console.log(`  + ${rows.length} wall comments`);
}

// ---------------------------------------------------------------------------
// Step 6: post comments — same friends-only spirit as wall comments.
// posts.comment_count is maintained by the on_post_comment_change trigger.
// ---------------------------------------------------------------------------

async function createPostComments(posts, accountsById, acceptedFriendsOf) {
  console.log("\nCreating post comments...");
  const rows = [];
  const notificationRows = [];

  for (const post of posts) {
    if (Math.random() < 0.4) continue; // most posts get zero comments, some get a few

    const author = accountsById.get(post.user_id);
    const friends = acceptedFriendsOf.get(post.user_id) || [];
    if (!author || friends.length === 0) continue;

    const commenters = randomSubset(friends, randomInt(1, Math.min(3, friends.length)));
    for (const commenter of commenters) {
      const id = crypto.randomUUID();
      const createdAt = randomBackdate(35, 0);

      rows.push({
        id,
        post_id: post.id,
        author_id: commenter.id,
        content: randomChoice(WALL_PHRASES),
        gif_url: null,
        created_at: createdAt,
      });

      notificationRows.push({
        user_id: post.user_id,
        type: "post_comment",
        actor_id: commenter.id,
        reference_id: post.id,
        created_at: createdAt,
      });
    }
  }

  await insertChunked("post_comments", rows);
  await insertChunked("notifications", notificationRows);
  console.log(`  + ${rows.length} post comments`);
}

// ---------------------------------------------------------------------------
// Step 7: likes — restricted to friends of the poster, matching the app's
// own feed visibility rules. posts.like_count is trigger-maintained.
// ---------------------------------------------------------------------------

async function createLikes(posts, acceptedFriendsOf) {
  console.log("\nCreating likes...");
  const rows = [];

  for (const post of posts) {
    const friends = acceptedFriendsOf.get(post.user_id) || [];
    const potentialLikers = [...friends, { id: post.user_id }]; // authors can like their own post
    const likeCount = randomInt(0, Math.min(potentialLikers.length, 8));
    const likers = randomSubset(potentialLikers, likeCount);

    for (const liker of likers) {
      rows.push({
        post_id: post.id,
        user_id: liker.id,
        created_at: randomBackdate(30, 0),
      });
    }
  }

  await insertChunked("post_likes", rows);
  console.log(`  + ${rows.length} likes`);
}

// ---------------------------------------------------------------------------
// Step 8: private messages — a handful of short back-and-forth threads
// between a subset of friend pairs.
// ---------------------------------------------------------------------------

async function createMessages(acceptedFriendsOf) {
  console.log("\nCreating message threads...");

  const seenPairs = new Set();
  const threadPairs = [];
  for (const [userId, friends] of acceptedFriendsOf) {
    for (const friend of friends) {
      const key = [userId, friend.id].sort().join(":");
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      if (Math.random() < 0.3) {
        threadPairs.push([userId, friend.id]);
      }
    }
  }

  const rows = [];
  const notificationRows = [];

  for (const [userA, userB] of threadPairs) {
    const messageCount = randomInt(2, 6);
    let sender = Math.random() < 0.5 ? userA : userB;
    let ts = randomBackdate(25, 5);

    for (let i = 0; i < messageCount; i++) {
      const recipient = sender === userA ? userB : userA;
      const id = crypto.randomUUID();
      // Each reply lands a bit later than the last, still backdated overall.
      ts = new Date(new Date(ts).getTime() + randomInt(1, 4) * 3600_000).toISOString();

      rows.push({
        id,
        sender_id: sender,
        recipient_id: recipient,
        content: randomChoice(MESSAGE_PHRASES),
        gif_url: null,
        read_at: Math.random() < 0.6 ? ts : null,
        created_at: ts,
      });

      notificationRows.push({
        user_id: recipient,
        type: "message",
        actor_id: sender,
        reference_id: id,
        created_at: ts,
      });

      sender = recipient; // alternate
    }
  }

  await insertChunked("messages", rows);
  await insertChunked("notifications", notificationRows);
  console.log(`  + ${rows.length} messages across ${threadPairs.length} threads`);
}

// ---------------------------------------------------------------------------
// Step 9: profile visits — gives the new "who visited" log something to show.
// ---------------------------------------------------------------------------

async function createProfileVisits(accounts) {
  console.log("\nCreating profile visits...");
  const rows = [];

  for (const account of accounts) {
    const visitorCount = randomInt(0, 8);
    const possibleVisitors = accounts.filter((a) => a.id !== account.id);
    const visitors = randomSubset(possibleVisitors, visitorCount);

    for (const visitor of visitors) {
      rows.push({
        profile_id: account.id,
        visitor_id: visitor.id,
        visited_at: randomBackdate(20, 0),
      });
    }
  }

  await insertChunked("profile_visits", rows);
  console.log(`  + ${rows.length} profile visits`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Seeding ${SUPABASE_URL} ...\n`);

  const accounts = await createAccounts();
  if (accounts.length === 0) {
    console.error("No accounts were created — stopping.");
    process.exit(1);
  }
  const accountsById = new Map(accounts.map((a) => [a.id, a]));

  const acceptedFriendsOf = await createFriendships(accounts);
  await createTop8s(acceptedFriendsOf);
  const posts = await createPosts(accounts);
  await createWallComments(accounts, acceptedFriendsOf);
  await createPostComments(posts, accountsById, acceptedFriendsOf);
  await createLikes(posts, acceptedFriendsOf);
  await createMessages(acceptedFriendsOf);
  await createProfileVisits(accounts);

  console.log("\nDone. Log in as any seeded account with:");
  console.log("  email:    <username>@backspace-seed.test");
  console.log("  password: Seed-<username>-2005!\n");
}

main().catch((err) => {
  console.error("\nSeed script failed:", err);
  process.exit(1);
});
