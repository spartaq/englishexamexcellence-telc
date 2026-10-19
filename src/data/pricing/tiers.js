// Pricing Tiers Configuration for Hungary Market

export const PRICING_TIERS = {
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    title: 'Completely Free',
    price: {
      amount: 0,
      currency: 'Ft',
      period: null
    },
    description: 'All content free, no account required',
    features: [
      'Full access to all mock exams (B1/B2/C1)',
      'All skill exercises and reading drills',
      'All vocabulary and grammar drills',
      'Unlimited practice — no limits',
      'AI-powered results and feedback',
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
    description: 'Save your progress — free to register',
    features: [
      'Everything in Bronze',
      'Progress tracking across sessions',
      'Saved vocabulary list (My Words)',
      'Personalised study insights',
    ],
    cta: 'Register Free',
    ctaLink: '/telc/b2',
    popular: true
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