import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ranks, getRankFromClicks } from "@/lib/ranks";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function Game() {
  const [username, setUsername] = useState("");
  const [clicks, setClicks] = useState(0);
  const { toast } = useToast();
  
  const { data: user, isSuccess } = useQuery<User>({
    queryKey: ["/api/users"],
    enabled: false
  });

  const { data: leaderboard } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 5000
  });

  const createUser = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/users", { username });
      return res.json();
    }
  });

  const updateClicks = useMutation({
    mutationFn: async (newClicks: number) => {
      const rank = getRankFromClicks(newClicks).name;
      const res = await apiRequest("POST", `/api/users/${user!.id}/clicks`, {
        clicks: newClicks,
        rank
      });
      return res.json();
    }
  });

  const handleClick = () => {
    if (!user) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    const currentRank = getRankFromClicks(clicks);
    const newRank = getRankFromClicks(newClicks);
    
    if (currentRank.name !== newRank.name) {
      toast({
        title: "Rank Up!",
        description: `You've reached ${newRank.name}!`,
        className: newRank.color
      });
    }
    
    updateClicks.mutate(newClicks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    createUser.mutate();
  };

  useEffect(() => {
    if (user) {
      setClicks(user.clicks);
    }
  }, [user]);

  if (!isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              JerkMate Ranked
            </h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Start Clicking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentRank = getRankFromClicks(clicks);
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];
  const progress = nextRank
    ? ((clicks - currentRank.requiredClicks) /
       (nextRank.requiredClicks - currentRank.requiredClicks)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                Welcome, {user.username}!
              </h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={clicks}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  className={`text-4xl font-bold mt-2 ${currentRank.color}`}
                >
                  {clicks} Clicks
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={currentRank.color}>{currentRank.name}</span>
                {nextRank && <span className={nextRank.color}>{nextRank.name}</span>}
              </div>
              <Progress value={progress} />
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                className="w-32 h-32 rounded-full text-xl"
                onClick={handleClick}
              >
                Click!
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Leaderboard</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard?.map((player, i) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center"
                >
                  <span>
                    {i + 1}. {player.username}
                  </span>
                  <span className={getRankFromClicks(player.clicks).color}>
                    {player.clicks}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
