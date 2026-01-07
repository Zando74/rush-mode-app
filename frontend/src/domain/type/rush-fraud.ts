export type ItemAttachment = {
  id: number;
  quantity: number;
};

export type Mail = {
  playerName: string;
  sender: string;
  goldTaken: number;
  attachments: ItemAttachment[];
  timestamp: number;
};

export type Trade = {
  playerName: string;
  giver: string;
  goldReceived: number;
  items: ItemAttachment[];
  timestamp: number;
};

export type RushFraud = {
  id: string;
  name: string;
  mails: Mail[];
  trades: Trade[];
  open: boolean;
};
