export interface Rank {
  name: string;
  requiredClicks: number;
  color: string;
}

export const ranks: Rank[] = [
  { name: "Beginner", requiredClicks: 0, color: "text-gray-500" },
  { name: "Clicker", requiredClicks: 50, color: "text-blue-500" },
  { name: "Pro Clicker", requiredClicks: 200, color: "text-green-500" },
  { name: "Master Clicker", requiredClicks: 500, color: "text-purple-500" },
  { name: "Grand Master", requiredClicks: 1000, color: "text-yellow-500" },
  { name: "Legend", requiredClicks: 2000, color: "text-red-500" },
  { name: "Mythical", requiredClicks: 5000, color: "text-pink-500" },
  { name: "God", requiredClicks: 10000, color: "text-orange-500" },
];

export function getRankFromClicks(clicks: number): Rank {
  return ranks.reduce((prev, curr) => {
    if (clicks >= curr.requiredClicks) return curr;
    return prev;
  });
}
