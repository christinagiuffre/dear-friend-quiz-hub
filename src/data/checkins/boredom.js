const boredom = {
  id: 'help-my-boredom',
  type: 'boredom',
  title: 'What Would Help My Boredom?',
  subtitle: 'Four quick decisions — three tailored ideas.',
  description:
    'Not all boredom needs the same cure. Four quick choices, three ideas that fit.',
  supporting: 'Not all boredom needs the same cure. Four quick choices, three ideas that fit.',
  meta: 'About 2 min · No sign-up',
  duration: '2 min',
  accent: 'amber',
  art: 'spark',
  category: 'feel-better',
  startLabel: 'Let’s find something',
  playful: true,

  trustPoints: [
    'No sign-up',
    'Three tailored suggestions',
    '“Nope, try again” if nothing fits',
  ],

  questions: [
    {
      id: 'b-energy',
      prompt: 'What kind of energy do you have?',
      questionType: 'single',
      options: [
        { id: 'en-very-low', label: 'Very little. Keep it easy.' },
        { id: 'en-calm', label: 'Calm, but awake' },
        { id: 'en-movement', label: 'Restless. I need to move.' },
        { id: 'en-high', label: 'Plenty. Give me something engaging.' },
        { id: 'en-unsure', label: 'I’m not sure' },
      ],
    },
    {
      id: 'b-setting',
      prompt: 'Where and with whom?',
      questionType: 'single',
      options: [
        { id: 'set-home-solo', label: 'At home by myself' },
        { id: 'set-home-with', label: 'At home with someone' },
        { id: 'set-out-solo', label: 'Out by myself' },
        { id: 'set-out-with', label: 'Out with someone' },
        { id: 'set-around', label: 'Around people, but no pressure to talk' },
        { id: 'set-flex', label: 'I don’t mind. Surprise me.' },
      ],
    },
    {
      id: 'b-cravings',
      prompt: 'What are you craving? (Pick up to two)',
      questionType: 'multi',
      maxSelect: 2,
      options: [
        { id: 'crave-comfort', label: 'Comfort' },
        { id: 'crave-movement', label: 'Movement' },
        { id: 'crave-creativity', label: 'Creativity' },
        { id: 'crave-exploration', label: 'Exploration' },
        { id: 'crave-mental', label: 'Mental stimulation' },
        { id: 'crave-connection', label: 'Connection' },
        { id: 'crave-switch-off', label: 'Complete switch-off' },
        { id: 'crave-novelty', label: 'Something different' },
        { id: 'crave-unsure', label: 'I genuinely don’t know' },
      ],
    },
    {
      id: 'b-limits',
      prompt: 'Practical limits',
      questionType: 'compound',
      options: {
        time: [
          { id: 'time-5', label: 'About 5 minutes' },
          { id: 'time-hour', label: 'Up to an hour' },
          { id: 'time-few', label: 'A few hours' },
          { id: 'time-open', label: 'No real limit' },
        ],
        budget: [
          { id: 'budget-free', label: 'Free only' },
          { id: 'budget-small', label: 'A small spend is fine' },
          { id: 'budget-more', label: 'Happy to spend more for a good idea' },
          { id: 'budget-flex', label: 'I don’t mind' },
        ],
      },
    },
  ],
}

export default boredom
