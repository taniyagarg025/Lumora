export const SPARK_DATA = [
  {
    id: "sunk-cost",
    title: "The Sunk Cost Fallacy",
    category: "Psychology & Decision Making",
    question: "Why does your brain remember embarrassing moments for years?",
    teaser: "A tiny idea worth exploring today.",
    simple: "The Sunk Cost Fallacy is our tendency to follow through on an endeavor if we have already invested time, effort, or money into it, whether or not the current costs outweigh the benefits. Basically, it's throwing good money after bad.",
    detail: "Cognitively, the Sunk Cost Fallacy is driven by loss aversion and a desire not to appear wasteful. When making decisions, rational actors should only weigh future costs against future benefits. However, human beings often factor in historical, unrecoverable costs (sunk costs), leading to irrational escalation of commitment to failing projects or relationships.",
    example: "Imagine you buy a $20 movie ticket. Halfway through the movie, you realize it's terrible. You stay and watch the rest of it because you \"already paid $20.\" The $20 is gone whether you stay or leave. By staying, you are now wasting your time in addition to your money.",
    takeaway: "Base your future decisions on future value, not past investments. What's gone is gone."
  },
  {
    id: "time-perception",
    title: "Proportional Time Perception",
    category: "Neuroscience",
    question: "Why does time seem to move faster as we get older?",
    teaser: "Something fascinating to think about today.",
    simple: "When you are 5 years old, one year represents 20% of your entire life. When you are 50 years old, one year represents only 2% of your life. Because each year is a smaller fraction of your total lived experience, it feels much shorter.",
    detail: "This is known as the proportional theory of time perception. Additionally, the brain encodes new experiences richly, making time feel expansive. As we age and fall into routine, fewer 'novel' memories are formed, meaning our brains have fewer milestones to anchor time, causing weeks and months to blur together rapidly.",
    example: "Think about your first week at a new job or school—it probably felt incredibly long because everything was new. But your 100th week at the same job probably flew by in a blur of routine.",
    takeaway: "To slow down the perception of time, inject novelty into your life. Travel, learn a new skill, or break your routine."
  },
  {
    id: "compound-interest",
    title: "The Magic of Compounding",
    category: "Finance & Math",
    question: "Why does compound interest become so powerful over time?",
    teaser: "A simple math trick that builds empires.",
    simple: "Compound interest is when you earn interest not only on your original money, but also on the interest that money has already earned. It creates a snowball effect where your wealth grows faster and faster over time.",
    detail: "The human brain is wired to understand linear growth (adding 1+1+1), but struggles to intuitively grasp exponential growth (multiplying 1.1 * 1.1 * 1.1). Because compounding is an exponential function, the vast majority of the growth happens at the very end of the time horizon, which consistently surprises human intuition.",
    example: "If you invest $100 a month from age 25 to 65 at an 8% return, you will have contributed $48,000. But your total balance will be over $349,000. Most of that $300,000+ is just interest earning interest.",
    takeaway: "Start early and be consistent. The most important variable in compound growth is time, not the amount of money."
  },
  {
    id: "familiarity-bias",
    title: "The Mere-Exposure Effect",
    category: "Behavioral Psychology",
    question: "Why does our brain prefer familiar ideas?",
    teaser: "A subtle bias controlling your choices.",
    simple: "The mere-exposure effect is a psychological phenomenon by which people tend to develop a preference for things merely because they are familiar with them. We like what we know.",
    detail: "Evolutionarily, familiar things were safe. If you ate a certain berry yesterday and didn't die, it's safer to eat it again today rather than try a new unknown berry. Today, this biological safety mechanism translates into a cognitive bias where we prefer familiar brands, familiar music, and familiar opinions, making us resistant to change and new ideas.",
    example: "Have you ever heard a new song on the radio and thought it was just okay, but after hearing it playing in stores and cars for three weeks, you suddenly find yourself singing along and loving it?",
    takeaway: "Recognize when you are choosing something just because it's familiar. Challenge yourself to actively explore the unfamiliar."
  }
];

export const getDailySpark = () => {
  // Use the day of the year to cycle through sparks deterministically
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return SPARK_DATA[dayOfYear % SPARK_DATA.length];
};
