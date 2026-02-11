import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeByContextChartProps {
  data: Array<{ context: string; duration: number }>;
}

export default function TimeByContextChart({ data }: TimeByContextChartProps) {
  const chartData = data.map((item) => ({
    context: item.context.charAt(0).toUpperCase() + item.context.slice(1),
    minutes: Math.floor(item.duration / 60),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time by Context</CardTitle>
        <CardDescription>How you spend your time across different activities</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="context" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="minutes" fill="oklch(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
