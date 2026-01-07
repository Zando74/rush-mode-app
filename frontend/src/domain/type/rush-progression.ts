export type Achievement = {
  playerName: string;
  achievements: string[];
};

export type RushProgression = {
  id: string;
  name: string;
  progressions: Achievement[];
  open: boolean;
};
