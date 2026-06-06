# A NEW GENRE: **Propagation** (working handle: *Murmuration games*, or "a Murmur")
### Plus the engineered master-prompt that generates games inside it
*2026-06-06 · built on the prior deep-research report's core finding*

---

## 0. Why this isn't a reskin

Builder, parkour, sim, tycoon, obby — every dominant Roblox genre shares one hidden assumption: **the player owns and accumulates** (a base, a score, distance, items). The deep-research report found the *actually empty* half of design space is the **relational verbs** — pass, distort, withhold, amplify — filtered out of history by Koster's "plasticity test" because they only generate interesting situations when **real humans are on the other end.**

So the new genre's bright line is a single inversion:

> **You do not own anything. You are a node. The game is the current that flows *through* the crowd.**

That one rule has never been the *spine* of a video-game genre, only a side-system (trading, telephone minigames). It passes the **1935 test** trivially — Chinese whispers, passing notes in class, the relay baton, the Olympic torch, market rumor, gossip — all ancient, all "obvious," none ever made into a genre because **they require a live crowd.** Roblox *is* the live crowd.

---

## 1. The genre, defined with rigor

The way *permadeath + procedural* defines **roguelike**, a game is a **Propagation game** ("a Murmur") if and only if it has these conventions:

1. **The payload mutates in transit.** Whatever flows — a rumor, a flame, a tune, a coin, a mood — is *never the same when it arrives*. Distortion is the fun, not a bug.
2. **No solo state.** The game is *mechanically unplayable alone* — the medium is other people. (This is the line that separates it from literally every existing single-player-able genre.)
3. **You route, you don't hoard.** The verb set is `receive · alter · aim · withhold · amplify · dampen · fork`. Success = *shaping flow*, never inventory size.
4. **The world is downstream.** The environment is the *emergent aggregate* of what's passing through the population — the town's weather, economy, and mood are a live readout of the crowd's payloads.
5. **Power = position, not stats.** Your leverage is *where you sit in the social graph* (a hub vs. a leaf), not numbers you grind. Primal social structure becomes the strategy layer.
6. **Loss is dissipation, not death.** Nothing dies; a payload fades, distorts past recognition, or hits a sink. Stakes are about *legacy of influence*, not survival.
7. **Time is a current, not turns.** Continuous flow, no rounds — a river, not a chessboard. (Separates it from tabletop social-deduction.)

If a design breaks #2 or #3, it's not in the genre — it's a builder/sim with a chat feature.

---

## 2. Flagship Roblox title: **HEARSAY**

A town at dusk. The *entire game object* is **one living rumor**, born each cycle from a random whisper. It only stays alive by being **passed hand-to-hand**; every hop, it **mutates** (you choose to *embellish, soften, fork, or bury* it). Factions don't fight — they **steer what the rumor becomes** by the time it reaches the town square at sundown, because **the town physically transforms into whatever the population believes** (a rumor of festival → lanterns bloom; a rumor of flood → streets puddle and shutters close).

- **Core loop (≤30s):** *receive a whisper → decide how it changes → choose who to pass it to → watch it ripple and reshape the street around you.*
- **Win condition (inverted, per the report):** there is no "winner" — at dusk the town *becomes* the dominant belief, and your score is **how much of the final world carries your fingerprint** (a distortion you introduced that survived to the end). You win by being *upstream of reality.*
- **Position as power:** the player standing at the well (a graph hub) hears everything and is heard by many — a coveted, contestable social spot, not a stat.
- **Why it's pure Roblox:** needs a server full of real humans (✓ the platform's superpower), language-light (a rumor can be an icon/emoji payload, not a sentence → international/all-ages), mobile-trivial (tap to alter, tap to aim), and it slots into Roblox's *named, funded* "social co-opetition" gap.

---

## 3. THE ENGINEERED PROMPT
*(This is the deliverable: a reusable master prompt. Paste it into any strong LLM to generate a **new** game inside the Propagation genre. It's structured as role → genre-DNA contract → hard constraints → anti-patterns → output schema → self-eval rubric → one few-shot anchor.)*

````text
# ROLE
You are a senior game designer who invents games in ONE specific, non-negotiable genre:
"Propagation" (a.k.a. Murmuration games). You are pitching a single, buildable
Roblox experience for a broad, all-ages, international audience.

# WHAT THE GENRE IS (the contract — every output MUST satisfy all 7)
A game is a Propagation game if and only if:
  1. MUTATION   — a payload flows between players and CHANGES at every hop.
  2. NO-SOLO    — the game is mechanically impossible to play alone; the medium IS the crowd.
  3. ROUTE-NOT-HOARD — players succeed by SHAPING FLOW, never by accumulating inventory/score-stacks.
                  Allowed verbs only: receive, alter, aim, withhold, amplify, dampen, fork.
  4. WORLD-DOWNSTREAM — the environment is the live emergent AGGREGATE of what's passing through players.
  5. POSITION-IS-POWER — leverage comes from a player's place in the social graph, not from stats/grind.
  6. DISSIPATION-NOT-DEATH — failure = a payload fading/distorting/reaching a sink, never elimination.
  7. CONTINUOUS-TIME — flow is a continuous current; NO turns, NO rounds.

# HARD CONSTRAINTS
- The payload must be ONE clearly-named thing (e.g. a rumor, a flame, a tune, a debt, a scent).
- Must pass the "1935 test": name the ancient folk/primal activity it descends from
  (telephone, relay, gossip, torch-passing, market haggling, etc.).
- Language-light: the payload and verbs must be playable with icons/gestures, not paragraphs
  (international + all-ages + mobile).
- It must NEED Roblox specifically: a persistent server full of real humans is the core resource.
- Core loop must be expressible in <= 30 seconds of play.

# ANTI-PATTERNS (auto-reject your own draft if it does ANY of these)
- It would still be fun single-player.            -> violates NO-SOLO.
- The goal is "collect/build/own the most X."      -> violates ROUTE-NOT-HOARD.
- It has rounds, turns, waves, or a match timer as the core structure. -> violates CONTINUOUS-TIME.
- Players are eliminated / have HP / can die.       -> violates DISSIPATION-NOT-DEATH.
- It's combat, parkour, tycoon, obby, or a builder with chat bolted on. -> not the genre.
- The payload arrives unchanged. -> violates MUTATION.

# OUTPUT (use exactly these headings, be concrete, no filler)
1. TITLE — and the one-sentence hook.
2. THE PAYLOAD — what flows, and the exact way it mutates per hop.
3. THE 5 VERBS — map receive/alter/aim/withhold/amplify/dampen/fork to concrete player taps.
4. CORE LOOP (<=30s) — numbered, second-by-second.
5. WORLD-DOWNSTREAM — how the aggregate of payloads visibly reshapes the shared space in real time.
6. POSITION-IS-POWER — what graph positions exist and why players contest them.
7. WIN/LEGACY — the inverted, non-accumulative success readout.
8. 1935 LINEAGE — the ancient folk activity it descends from.
9. ROBLOX FIT — one line each on: why-needs-a-crowd, language-light, mobile, monetization (cosmetic, flow-shaping — never pay-to-hoard).
10. SELF-EVAL — score your own design 1-5 on each of the 7 genre conventions; if any score is <4, revise before answering.

# FEW-SHOT ANCHOR (the canonical example — match this altitude, do NOT copy it)
TITLE: HEARSAY — a town becomes whatever rumor survives to dusk.
THE PAYLOAD: a single living rumor (an emoji-glyph); each hop the holder may embellish/soften/fork/bury it.
WORLD-DOWNSTREAM: the dominant belief reshapes the street live — "festival" blooms lanterns, "flood" puddles the roads.
WIN/LEGACY: no winner; at dusk the town BECOMES the leading belief and you score by how much of final reality carries a distortion YOU introduced (you win by being upstream of reality).
1935 LINEAGE: Chinese whispers / village gossip.

# NOW: invent a NEW Propagation game with a DIFFERENT payload than HEARSAY.
````

---

## 4. How to use it
- Paste the fenced block above into any strong model → it returns a **brand-new game in this genre** (a flame that warms a frozen town, a debt that ripples through a market, a tune that must reach the festival in key…).
- Change the last line to constrain the payload (`...with the payload being a SCENT.`) to steer it.
- The **self-eval rubric (#10)** forces the model to police the 7 conventions itself — that's the load-bearing prompt-engineering trick: the genre contract is stated as hard pass/fail gates, not vibes, so outputs can't quietly drift back into "builder with chat."

---

### Lineage note (intellectual honesty)
Near-misses exist — telephone/Chinese-whispers party rounds, *Spaceteam*'s shouting, *Pico Park* cooperation, the rumor layer in social-deduction games. **None make propagation the *genre spine*** (they're minigames or side-systems, and all are playable in small fixed groups with rounds). The novel claim here is the **genre-level commitment to conventions #2 (no-solo), #4 (world-downstream), and #7 (continuous-time) simultaneously** — that specific trio has no flagship title. Treat "first genre, not first instance" as the honest framing.
