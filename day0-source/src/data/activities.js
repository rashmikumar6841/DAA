// DAY//0 — deterministic activity pool.
// Every activity consumes three resources (time in minutes, money in $, energy in units)
// and returns a "joy" score: the modeled regret-avoidance value of doing it.
// This is the fixed universe of n = 16 candidates every algorithm reasons over.

export const ACTIVITIES = [
  { id: "run", name: "Sunrise Run", cat: "Movement", icon: "\u{1F3C3}", time: 45, money: 0, energy: 6, joy: 58, line: "Cold air, quiet streets, a head start on the day." },
  { id: "coffee", name: "Slow Coffee Ritual", cat: "Nourishment", icon: "\u2615", time: 15, money: 5, energy: 1, joy: 34, line: "No phone. Just the pour and the steam." },
  { id: "deepwork", name: "Deep Work Sprint", cat: "Work", icon: "\u{1F9E0}", time: 120, money: 0, energy: 7, joy: 52, line: "Two hours where the hard problem finally moves." },
  { id: "callmom", name: "Call Mom", cat: "Social", icon: "\u{1F4DE}", time: 30, money: 0, energy: 2, joy: 46, line: "She always asks if you're eating enough." },
  { id: "lunch", name: "Lunch with a Friend", cat: "Social", icon: "\u{1F35C}", time: 75, money: 30, energy: 3, joy: 68, line: "The kind of laugh you can't schedule." },
  { id: "nap", name: "Midday Nap", cat: "Rest", icon: "\u{1F634}", time: 30, money: 0, energy: 1, joy: 40, line: "Twenty minutes that resets the whole afternoon." },
  { id: "museum", name: "Museum Wander", cat: "Adventure", icon: "\u{1F5BC}", time: 90, money: 20, energy: 4, joy: 64, line: "Standing too long in front of one painting." },
  { id: "book", name: "New Book Chapter", cat: "Craft", icon: "\u{1F4D6}", time: 45, money: 0, energy: 2, joy: 36, line: "One more chapter turns into three." },
  { id: "gym", name: "Gym Session", cat: "Movement", icon: "\u{1F3CB}", time: 60, money: 10, energy: 8, joy: 54, line: "The version of you tomorrow will thank today." },
  { id: "market", name: "Farmers Market Trip", cat: "Nourishment", icon: "\u{1F955}", time: 45, money: 35, energy: 3, joy: 58, line: "Tomatoes that still smell like a garden." },
  { id: "guitar", name: "Guitar Practice", cat: "Craft", icon: "\u{1F3B8}", time: 30, money: 0, energy: 3, joy: 44, line: "Same three chords, slightly less clumsy." },
  { id: "dinner", name: "Dinner Out (Splurge)", cat: "Indulgence", icon: "\u{1F37D}", time: 90, money: 55, energy: 3, joy: 78, line: "The dish you'll describe to people for weeks." },
  { id: "walk", name: "Evening Walk", cat: "Movement", icon: "\u{1F307}", time: 30, money: 0, energy: 2, joy: 32, line: "The sky does something it only does at dusk." },
  { id: "movie", name: "Movie Night", cat: "Indulgence", icon: "\u{1F3AC}", time: 120, money: 20, energy: 2, joy: 50, line: "Lights off, world paused for two hours." },
  { id: "journal", name: "Journaling", cat: "Rest", icon: "\u{1F4D3}", time: 15, money: 0, energy: 1, joy: 28, line: "Writing the day down so it doesn't blur." },
  { id: "roadtrip", name: "Spontaneous Road Trip", cat: "Adventure", icon: "\u{1F697}", time: 180, money: 80, energy: 6, joy: 88, line: "No destination, just the next exit that looks interesting." },
];

export const CATEGORY_COLORS = {
  Movement: "cyan",
  Nourishment: "amber",
  Work: "violet",
  Social: "rose",
  Rest: "cyan",
  Adventure: "violet",
  Craft: "amber",
  Indulgence: "rose",
};

// Default + range definitions for the three constraint dials.
export const CONSTRAINTS_CONFIG = {
  time: { label: "Time", unit: "min", min: 120, max: 600, step: 15, default: 360, icon: "\u23F1" },
  money: { label: "Money", unit: "$", min: 0, max: 150, step: 5, default: 80, icon: "\u{1F4B5}" },
  energy: { label: "Energy", unit: "u", min: 10, max: 60, step: 2, default: 34, icon: "\u26A1" },
};

export function defaultConstraints() {
  return {
    time: CONSTRAINTS_CONFIG.time.default,
    money: CONSTRAINTS_CONFIG.money.default,
    energy: CONSTRAINTS_CONFIG.energy.default,
  };
}
