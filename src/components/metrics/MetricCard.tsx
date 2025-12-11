// src/components/metrics/MetricCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card className="bg-[#111827] border-[#1F2933]">
      <CardHeader className="mb-1">
        <CardTitle className="text-[11px] uppercase tracking-wide text-[#9CA3AF]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold text-[#F9FAFB]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>

        {hint && (
          <CardDescription className="mt-1 text-[#9CA3AF]">
            {hint}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}
