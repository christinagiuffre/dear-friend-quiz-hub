/** Boredom activity catalogue — tags drive hard filters and soft ranking. */

export const boredomActivities = [
  // ── Stay in · alone · low energy · short · free ──
  {
    id: 'comfort-film-short',
    title: 'Comfort watch — one episode',
    description: 'One episode or twenty minutes of something you already love. Blanket optional.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'off', mode: 'consume', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'five-min-doodle',
    title: 'Five-minute doodle',
    description: 'Timer on. Draw shapes, patterns or nonsense for five minutes. No judging.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'off', mode: 'create', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'tea-ritual',
    title: 'Five-minute tea or snack ritual',
    description: 'Make a drink or snack and sit without your phone for five minutes.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'off', mode: 'consume', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'stretch-five',
    title: 'Gentle five-minute stretch',
    description: 'Slow stretches by a window or on the floor. No workout pressure.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'game-round',
    title: 'One quick game round',
    description: 'A single round of a phone, card or board game. Stop when the round ends.',
    tags: { location: 'in', social: 'alone', energy: 'medium', mental: 'on', mode: 'consume', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'medium' },
  },

  // ── Stay in · medium/long ──
  {
    id: 'new-recipe',
    title: 'Try a simple new recipe',
    description: 'Five ingredients or fewer. Imperfect results still count.',
    tags: { location: 'in', social: 'alone', energy: 'medium', mental: 'on', mode: 'create', time: 'medium', cost: 'low-cost', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'space-refresh',
    title: 'Refresh a small space',
    description: 'Rearrange one shelf or corner. Add one thing that makes you smile.',
    tags: { location: 'in', social: 'alone', energy: 'medium', mental: 'off', mode: 'create', time: 'medium', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'playlist-make',
    title: 'Make a mood playlist',
    description: 'Build a playlist for how you want to feel, not how you feel now.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'on', mode: 'create', time: 'medium', cost: 'free', novelty: 'medium', stimulation: 'medium' },
  },
  {
    id: 'read-chapter',
    title: 'Read one chapter',
    description: 'One chapter only — then decide if you want more.',
    tags: { location: 'in', social: 'alone', energy: 'low', mental: 'on', mode: 'consume', time: 'medium', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'dance-break',
    title: 'Three-song dance break',
    description: 'Put on three songs you can’t sit still to. Move however you like.',
    tags: { location: 'in', social: 'alone', energy: 'active', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'high' },
  },

  // ── Go out · alone · active · explore · paid ──
  {
    id: 'photo-walk',
    title: 'Themed photo walk',
    description: 'Pick a theme (yellow things, textures, dogs) and photograph five examples.',
    tags: { location: 'out', social: 'alone', energy: 'active', mental: 'on', mode: 'explore', time: 'medium', cost: 'free', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'podcast-walk',
    title: 'New walking route + podcast',
    description: 'Walk a street you’ve never taken with one podcast episode.',
    tags: { location: 'out', social: 'alone', energy: 'active', mental: 'off', mode: 'explore', time: 'medium', cost: 'free', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'tiny-adventure',
    title: 'Five-minute tiny adventure',
    description: 'Walk to the end of the street and back a different way. That counts.',
    tags: { location: 'out', social: 'alone', energy: 'active', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'nature-time',
    title: 'Ten minutes in nature',
    description: 'Sit in a garden, park or near a tree. No phone. Just notice.',
    tags: { location: 'out', social: 'alone', energy: 'chill', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'medium', stimulation: 'low' },
  },

  // ── Go out · ambient · paid-friendly ──
  {
    id: 'solo-cafe',
    title: 'Solo café visit',
    description: 'A drink somewhere cosy. People-watching optional, chatting not required.',
    tags: { location: 'out', social: 'ambient', energy: 'chill', mental: 'off', mode: 'consume', time: 'medium', cost: 'low-cost', novelty: 'medium', stimulation: 'low' },
  },
  {
    id: 'new-cafe',
    title: 'Visit a new café or bakery',
    description: 'Try somewhere you’ve noticed but never been. Sit in for twenty minutes.',
    tags: { location: 'out', social: 'ambient', energy: 'chill', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'cinema-film',
    title: 'See a film at the cinema',
    description: 'Pick something that looks fun — no need for it to be “important”.',
    tags: { location: 'out', social: 'ambient', energy: 'chill', mental: 'off', mode: 'consume', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'museum-visit',
    title: 'Visit a museum or exhibition',
    description: 'Wander one gallery or exhibition at your own pace. Leave when you’ve had enough.',
    tags: { location: 'out', social: 'ambient', energy: 'medium', mental: 'on', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'gallery-wander',
    title: 'Browse a gallery or art space',
    description: 'Look without pressure to understand everything. Stay as long as feels right.',
    tags: { location: 'out', social: 'ambient', energy: 'medium', mental: 'on', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'market-browse',
    title: 'Wander a market or bookshop',
    description: 'Browse without a purchase plan. Optional small treat if you want one.',
    tags: { location: 'out', social: 'ambient', energy: 'medium', mental: 'on', mode: 'explore', time: 'medium', cost: 'low-cost', novelty: 'medium', stimulation: 'medium' },
  },
  {
    id: 'library-visit',
    title: 'Browse the library',
    description: 'Wander the shelves, read a chapter in a corner, people-watch quietly.',
    tags: { location: 'out', social: 'ambient', energy: 'low', mental: 'on', mode: 'explore', time: 'medium', cost: 'free', novelty: 'familiar', stimulation: 'low' },
  },
  {
    id: 'mystery-door',
    title: 'Step inside somewhere new',
    description: 'Enter a shop or building you’ve always walked past. Just look around.',
    tags: { location: 'out', social: 'ambient', energy: 'medium', mental: 'on', mode: 'explore', time: 'short', cost: 'free', novelty: 'new', stimulation: 'medium' },
  },

  // ── Go out · active · paid ──
  {
    id: 'bowling',
    title: 'Go bowling or mini-golf',
    description: 'A playful hour that gets you moving without a big social commitment.',
    tags: { location: 'out', social: 'ambient', energy: 'active', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'skating',
    title: 'Try skating or an activity session',
    description: 'Book a beginner session — roller skating, climbing taster or similar.',
    tags: { location: 'out', social: 'ambient', energy: 'active', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'escape-room',
    title: 'Try an escape room or puzzle experience',
    description: 'A focused hour of curiosity and movement. Bring a friend or go solo if allowed.',
    tags: { location: 'out', social: 'connect', energy: 'active', mental: 'on', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'hire-bike',
    title: 'Hire a bike or scooter for an hour',
    description: 'Explore a route you don’t usually take. Stop whenever you like.',
    tags: { location: 'out', social: 'alone', energy: 'active', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'sunset-walk',
    title: 'Sunset walk somewhere new',
    description: 'Walk to a viewpoint or open space for the golden hour.',
    tags: { location: 'out', social: 'alone', energy: 'active', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'new', stimulation: 'medium' },
  },

  // ── Social · connect ──
  {
    id: 'call-someone',
    title: 'Call someone for ten minutes',
    description: 'A short, easy chat with someone you like.',
    tags: { location: 'in', social: 'connect', energy: 'medium', mental: 'off', mode: 'explore', time: 'short', cost: 'free', novelty: 'familiar', stimulation: 'medium' },
  },
  {
    id: 'coffee-catchup',
    title: 'Coffee catch-up with someone',
    description: 'Invite one person for a low-pressure drink somewhere nearby.',
    tags: { location: 'out', social: 'connect', energy: 'medium', mental: 'off', mode: 'explore', time: 'medium', cost: 'low-cost', novelty: 'familiar', stimulation: 'medium' },
  },
  {
    id: 'creative-workshop',
    title: 'Try a creative workshop',
    description: 'Pottery taster, printmaking, cooking class — something hands-on with others.',
    tags: { location: 'out', social: 'connect', energy: 'medium', mental: 'on', mode: 'create', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'restaurant-try',
    title: 'Try a new restaurant or food spot',
    description: 'Share a meal somewhere neither of you has been before.',
    tags: { location: 'out', social: 'connect', energy: 'medium', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'bookshop-pick',
    title: 'Browse a bookshop and pick a book',
    description: 'Wander together, each choose something that catches your eye.',
    tags: { location: 'out', social: 'connect', energy: 'medium', mental: 'on', mode: 'explore', time: 'medium', cost: 'low-cost', novelty: 'new', stimulation: 'medium' },
  },

  // ── Create at home / out ──
  {
    id: 'craft-hour',
    title: 'One-hour craft or DIY project',
    description: 'Finish something small — a card, a playlist cover, a plant repot.',
    tags: { location: 'in', social: 'alone', energy: 'medium', mental: 'on', mode: 'create', time: 'medium', cost: 'low-cost', novelty: 'new', stimulation: 'medium' },
  },
  {
    id: 'cook-together',
    title: 'Cook something new together',
    description: 'Pick a simple recipe and make it with someone. Mess is allowed.',
    tags: { location: 'in', social: 'connect', energy: 'medium', mental: 'on', mode: 'create', time: 'medium', cost: 'low-cost', novelty: 'new', stimulation: 'medium' },
  },

  // ── Wellness · paid ──
  {
    id: 'spa-pool',
    title: 'Visit a pool, spa or wellness session',
    description: 'A restorative hour — swim, sauna or similar if available near you.',
    tags: { location: 'out', social: 'ambient', energy: 'chill', mental: 'off', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'low' },
  },
  {
    id: 'local-event',
    title: 'Check out a local event',
    description: 'Look up what’s on nearby — a talk, market, fair or community event.',
    tags: { location: 'out', social: 'ambient', energy: 'medium', mental: 'on', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
  {
    id: 'beginner-class',
    title: 'Book a one-off beginner class',
    description: 'Dance, yoga, language, art — something you’ve been curious about.',
    tags: { location: 'out', social: 'ambient', energy: 'active', mental: 'on', mode: 'explore', time: 'medium', cost: 'paid', novelty: 'new', stimulation: 'high' },
  },
]
