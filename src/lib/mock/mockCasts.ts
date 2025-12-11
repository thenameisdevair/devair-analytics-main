// src/lib/mock/mockCasts.ts

export type MockCast = {
  id: string;
  text: string;
  createdAt: string;
  likes: number;
  recasts: number;
  replies: number;
};

export const mockCasts: MockCast[] = [
  {
    id: "1",
    text: "Testing my Farcaster analytics mini app 👀",
    likes: 12,
    recasts: 3,
    replies: 4,
    createdAt: "2025-12-01T12:00:00.000Z",
  },
  {
    id: "2",
    text: "On-chain research is just detective work with better tools.",
    likes: 25,
    recasts: 5,
    replies: 6,
    createdAt: "2025-11-29T18:30:00.000Z",
  },
  {
    id: "3",
    text: "Building a Neynar-powered dashboard for my casts.",
    likes: 8,
    recasts: 1,
    replies: 2,
    createdAt: "2025-11-25T09:15:00.000Z",
  },
];
