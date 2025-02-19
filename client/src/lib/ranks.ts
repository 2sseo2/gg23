export interface Rank {
  name: string;
  requiredClicks: number;
  color: string;
}

export const ranks: Rank[] = [
  { name: "Beginner Beater", requiredClicks: 0, color: "text-gray-500" },
  { name: "Bronze Beater", requiredClicks: 5000, color: "text-amber-700" },
  { name: "Silver Beater", requiredClicks: 10000, color: "text-slate-400" },
  { name: "Gold Beater", requiredClicks: 15000, color: "text-yellow-500" },
  { name: "Platinum Beater", requiredClicks: 20000, color: "text-cyan-400" },
  { name: "Diamond Beater", requiredClicks: 25000, color: "text-blue-500" },
  { name: "Master Beater", requiredClicks: 30000, color: "text-purple-500" },
  { name: "Legendary Beater", requiredClicks: 35000, color: "text-red-500" },
];

export function getRankFromClicks(clicks: number): Rank {
  return ranks.reduce((prev, curr) => {
    if (clicks >= curr.requiredClicks) return curr;
    return prev;
  });
}