// src/data/reading/drills/verbs-1.js

export const drill1Data = {
  id: 'drill-1',
  type: 'token-select',
  title: 'Tense & Voice Analysis',
  xpReward: 150,
  instruction: 'Identify all instances of the Present Perfect and the Passive Voice.',
  content: [
    "Fair games?",
    "For seventeen days every four years the world is briefly arrested by the captivating, dizzying spectacle of athleticism, ambition, pride and celebration on display at the Summer Olympic Games. After the last weary spectators and competitors have returned home, however, host cities are often left awash in high debts and costly infrastructure maintenance. The staggering expenses involved in a successful Olympic bid are often assumed to be easily mitigated by tourist revenues and an increase in local employment, but more often than not host cities are short changed and their taxpayers for generations to come are left settling the debt.",
    "Olympic extravagances begin with the application process. Bidding alone will set most cities back about $20 million, and while officially bidding only takes two years (for cities that make the shortlist), most cities can expect to exhaust a decade working on their bid from the moment it is initiated to the announcement of voting results from International Olympic Committee members. Aside from the financial costs of the bid alone, the process ties up real estate in prized urban locations until the outcome is known. This can cost local economies millions of dollars of lost revenue from private developers who could have made use of the land, and can also mean that particular urban quarters lose their vitality due to the vacant lots. All of this can be for nothing if a bidding city does not appease the whims of IOC members – private connections and opinions on government conduct often hold sway (Chicago’s 2012 bid is thought to have been undercut by tensions over U.S. foreign policy).",
    "Bidding costs do not compare, however, to the exorbitant bills that come with hosting the Olympic Games themselves. As is typical with large-scale, one-off projects, budgeting for the Olympics is a notoriously formidable task. Los Angelinos have only recently finished paying off their budget-breaking 1984 Olympics; Montreal is still in debt for its 1976 Games (to add insult to injury, Canada is the only host country to have failed to win a single gold medal during its own Olympics). The tradition of runaway expenses has persisted in recent years. London Olympics managers have admitted that their 2012 costs may increase ten times over their initial projections, leaving tax payers 20 billion pounds in the red."
  ].join('\n\n'),
  
  correctTokens: [
    // Passive Voice instances
    "is briefly arrested",
    "are often left",
    "are often assumed",
    "be easily mitigated",
    "are short changed",
    "is initiated",
    "is known",
    "is thought",
    "to have been undercut",
    
    // Present Perfect instances
    "have returned",
    "have only recently finished",
    "has persisted",
    "have admitted"
  ]
};