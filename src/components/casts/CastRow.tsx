// src/components/casts/CastRow.tsx
import { Card, CardContent } from "../ui/Card";
import { computeCastEngagement } from "../../lib/metrics/engagement";

interface CastRowProps {
  text: string;
  createdAt: string;
  likes: number;
  recasts: number;
  replies: number;
  followerCount: number;
}

export function CastRow(props: CastRowProps) {
  const { text, createdAt, likes, recasts, replies, followerCount } = props;

  const { total, rate } = computeCastEngagement(
    { likes, recasts, replies, text, createdAt, id: "" } as any,
    followerCount
  );

  return (
    <Card className="border-white/10 bg-[#111827]">
      <CardContent className="space-y-2">
        {/* Cast text */}
        <p className="text-sm leading-snug">
          {text}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>{new Date(createdAt).toLocaleDateString()}</span>

          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-3">
              <span>❤️ {likes}</span>
              <span>🔄 {recasts}</span>
              <span>💬 {replies}</span>
            </div>
            <div className="flex gap-3">
              <span>Total: {total}</span>
              <span>ER: {rate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
