const feeling = {
  id: 'why-do-i-feel-weird',
  type: 'simple',
  stepCount: 6,
  title: 'What am I feeling?',
  subtitle: 'Am I bored, overwhelmed or lonely?',
  description: 'A gentle check-in to help you understand what your mind might need today.',
  supporting:
    'A 60-second check-in to help you understand what your mind might need today.',
  meta: 'About 2 min · No sign-up',
  duration: '2 min',
  accent: 'purple',
  art: 'connection',
  category: 'understand',
  startLabel: 'Start check-in',

  trustPoints: [
    'No sign-up',
    'No personal details',
    'No locked results',
    'Just a gentle answer',
  ],

  tiePriority: ['PAUSE', 'GENTLENESS', 'CONNECTION', 'SPARK'],

  questions: [
    {
      id: 'q1',
      prompt: 'What feels most true today?',
      options: [
        { id: 'q1-a', result: 'SPARK', label: 'I feel flat or restless' },
        { id: 'q1-b', result: 'PAUSE', label: 'Everything feels like too much' },
        { id: 'q1-c', result: 'CONNECTION', label: 'I feel a bit alone' },
        { id: 'q1-d', result: 'GENTLENESS', label: 'I’m being hard on myself' },
      ],
    },
    {
      id: 'q2',
      prompt: 'What are you craving most?',
      options: [
        { id: 'q2-a', result: 'SPARK', label: 'Something different or fun' },
        { id: 'q2-b', result: 'PAUSE', label: 'Quiet, space or a proper break' },
        { id: 'q2-c', result: 'CONNECTION', label: 'A message, hug or real conversation' },
        { id: 'q2-d', result: 'GENTLENESS', label: 'Reassurance that I’m doing okay' },
      ],
    },
    {
      id: 'q3',
      prompt: 'What has been hardest today?',
      options: [
        { id: 'q3-a', result: 'SPARK', label: 'Feeling bored, stuck or unmotivated' },
        { id: 'q3-b', result: 'PAUSE', label: 'Too many thoughts, tasks or demands' },
        { id: 'q3-c', result: 'CONNECTION', label: 'Feeling unseen or disconnected' },
        { id: 'q3-d', result: 'GENTLENESS', label: 'Negative self-talk or self-doubt' },
      ],
    },
    {
      id: 'q4',
      prompt: 'What would help most right now?',
      options: [
        { id: 'q4-a', result: 'SPARK', label: 'A small change of scene' },
        { id: 'q4-b', result: 'PAUSE', label: 'Taking one thing off my plate' },
        { id: 'q4-c', result: 'CONNECTION', label: 'Reaching out to someone safe' },
        { id: 'q4-d', result: 'GENTLENESS', label: 'Speaking to myself more kindly' },
      ],
    },
    {
      id: 'q5',
      prompt: 'Which sentence sounds most like you?',
      options: [
        { id: 'q5-a', result: 'SPARK', label: 'I need something to feel a bit more alive' },
        { id: 'q5-b', result: 'PAUSE', label: 'I need everything to slow down' },
        { id: 'q5-c', result: 'CONNECTION', label: 'I don’t want to feel alone in this' },
        { id: 'q5-d', result: 'GENTLENESS', label: 'I need to stop being so hard on myself' },
      ],
    },
    {
      id: 'q6',
      prompt: 'What tiny next step feels possible?',
      options: [
        { id: 'q6-a', result: 'SPARK', label: 'Do one small thing differently' },
        { id: 'q6-b', result: 'PAUSE', label: 'Pause, breathe and simplify' },
        { id: 'q6-c', result: 'CONNECTION', label: 'Send one low-pressure message' },
        { id: 'q6-d', result: 'GENTLENESS', label: 'Replace one harsh thought with a kinder one' },
      ],
    },
  ],

  results: {
    SPARK: {
      id: 'SPARK',
      title: 'You may need a spark.',
      shortLabel: 'Bored or under-stimulated',
      art: 'spark',
      body: [
        'Dear Friend, you may not be lazy or unmotivated. Your mind might just be asking for something a little different today.',
        'When life feels flat, one tiny spark can help. You don’t need to change your whole day. Just add one small moment of colour, movement, play or curiosity.',
      ],
      step: 'Do one small thing differently. Put on music, step outside, colour something, read one page, or give yourself five phone-free minutes.',
      appSuggestion: 'Try Pet Sunny, Count Sheepitos, journaling or affirmations.',
    },
    PAUSE: {
      id: 'PAUSE',
      title: 'You may need a pause.',
      shortLabel: 'Overwhelmed or overloaded',
      art: 'pause',
      body: [
        'Dear Friend, your brain may be waving a white flag today.',
        'That doesn’t mean you’re failing. It means you’re carrying a lot, and even strong people need to refuel.',
      ],
      step: 'Ask yourself: what can I pause, postpone, simplify or put down today?',
      appSuggestion: 'Try a mood check-in, breathing exercise, journal entry or progress tracker.',
    },
    CONNECTION: {
      id: 'CONNECTION',
      title: 'You may need connection.',
      shortLabel: 'Lonely or disconnected',
      art: 'connection',
      body: [
        'Dear Friend, loneliness doesn’t always mean being physically alone. Sometimes it means not feeling seen, heard or understood.',
        'You don’t need a grand gesture. One small moment of connection can help you feel a little less alone.',
      ],
      step: 'Send one low-pressure message, like: “Thinking of you. Fancy a catch-up soon?”',
      appSuggestion: 'Try the journal, affirmations or a gentle check-in.',
    },
    GENTLENESS: {
      id: 'GENTLENESS',
      title: 'You may need gentleness.',
      shortLabel: 'Self-critical or emotionally bruised',
      art: 'gentleness',
      body: [
        'Dear Friend, that harsh voice in your head might feel convincing, but it doesn’t mean it is telling the truth.',
        'You may not need to push harder today. You may need to speak to yourself with a little more care.',
      ],
      step: 'Replace one harsh thought with something kinder, like: “I’m not failing. I’m having a hard moment.”',
      appSuggestion: 'Try affirmations, journaling or a gentle check-in in the app.',
    },
  },
}

export default feeling
