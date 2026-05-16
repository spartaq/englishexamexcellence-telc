// Pricing Tiers Configuration for Hungary Market

export const PRICING_TIERS = {
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    title: 'Free Access',
    price: {
      amount: 0,
      currency: 'Ft',
      period: null
    },
    description: 'Try before you buy',
    features: [
      'Free mock test on landing page',
      '2 mock exams per level per month (~6 total)',
      'Limited Atoms (skill exercises)',
      '10 vocabulary words per day',
      'No progress tracking'
    ],
    cta: 'Start Learning',
    ctaLink: '/telc/b2',
    popular: false
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    title: 'Free with Registration',
    price: {
      amount: 0,
      currency: 'Ft',
      period: null
    },
    description: 'Full access - just register',
    features: [
      'Full access to all mocks and drills',
      'Unlimited mock exams (B1/B2/C1)',
      'Full drill exercises library',
      'Unlimited vocabulary practice',
      'Spaced repetition system',
      'Progress tracking',
      'Basic feedback'
    ],
    cta: 'Register Free',
    ctaLink: '/sign-up',
    popular: false
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    title: 'Lifetime Access',
    price: {
      amount: 9000,
      currency: 'Ft',
      period: 'one-time'
    },
    description: 'Pay once, study forever',
    features: [
      'Everything in Silver',
      'AI-powered writing feedback',
      'AI-powered speaking evaluation',
      'Community Forum (ask teachers questions)',
      'Priority support',
      'LIFETIME ACCESS'
    ],
    cta: 'Get Lifetime Access',
    ctaLink: '/contact-for-purchase',
    popular: true
  }
};

export default PRICING_TIERS;