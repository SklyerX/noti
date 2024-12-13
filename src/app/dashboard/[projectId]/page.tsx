import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { apiKeysTable, eventTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { RecentEvents } from "./recent-events";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function Page({ params: { projectId } }: Props) {
  const metrics = await getProjectMetrics(projectId);
  const recentEventsMetrics = await getRecentEventsMetrics(projectId);

  const successRate = () => {
    if (metrics.totalEvents === 0) return 0;
    return ((metrics.sentEventsCount / metrics.totalEvents) * 100).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Events (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.failedEventsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeApiKeysCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentEvents metrics={recentEventsMetrics} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const getProjectMetrics = async (projectId: string) => {
  const metrics = await db
    .select({
      totalEvents: sql<number>`count(${eventTable.id})::int`,
      totalEvents24h: sql<number>`count(case when ${eventTable.createdAt} > now() - interval '24 hours' then 1 end)::int`,
      activeApiKeysCount: sql<number>`count(distinct case when ${apiKeysTable.isLive} = true then ${apiKeysTable.id} end)::int`,
      failedEventsCount: sql<number>`count(case when ${eventTable.status} = 'failed' then 1 end)::int`,
      sentEventsCount: sql<number>`count(case when ${eventTable.status} = 'sent' then 1 end)::int`,
    })
    .from(eventTable)
    .leftJoin(apiKeysTable, eq(eventTable.apiKeyId, apiKeysTable.id))
    .where(eq(eventTable.projectId, projectId))
    .execute();

  return metrics[0];
};

const getRecentEventsMetrics = async (projectId: string, days = 7) => {
  const events = await db
    .select({
      date: sql<string>`date_trunc('day', ${eventTable.createdAt})::date`,
      total: sql<number>`count(${eventTable.id})::int`,
      success: sql<number>`count(case when ${eventTable.status} = 'sent' then 1 end)::int`,
      failed: sql<number>`count(case when ${eventTable.status} = 'failed' then 1 end)::int`,
    })
    .from(eventTable)
    .where(
      and(
        eq(eventTable.projectId, projectId),
        sql`${eventTable.createdAt} > now() - interval '7 days'` // Fixed value
      )
    )
    .groupBy(sql`date_trunc('day', ${eventTable.createdAt})`)
    .orderBy(sql`date_trunc('day', ${eventTable.createdAt})`)
    .execute();

  return events;
};
