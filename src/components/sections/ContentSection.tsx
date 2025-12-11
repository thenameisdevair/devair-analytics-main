// src/components/sections/ContentSection.tsx
import { CastRow } from "../casts/CastRow";

interface ContentSectionProps {
  casts: {
    id: string;
    text: string;
    likes: number;
    recasts: number;
    replies: number;
    createdAt: string;
  }[];
  followerCount: number;
}

export function ContentSection({ casts, followerCount }: ContentSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/50 mb-1">
        Recent casts with engagement.
      </p>

      {casts.map((cast) => (
        <CastRow
          key={cast.id}
          text={cast.text}
          createdAt={cast.createdAt}
          likes={cast.likes}
          recasts={cast.recasts}
          replies={cast.replies}
          followerCount={followerCount}
        />
      ))}

      {casts.length === 0 && (
        <p className="text-xs text-white/60">
          No casts yet. Once you start posting, you’ll see them here.
        </p>
      )}
    </div>
  );
}
