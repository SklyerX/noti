import CreateAPIKey from "./_components/create-api-key";
import { db } from "@/db";
import { columns, type ApiData } from "./_components/table/columns";
import { DataTable } from "./_components/table/data-table";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function Keys({ params: { projectId } }: Props) {
  const apiKeys = await db.query.apiKeysTable.findMany({
    where: (fields, { eq }) => eq(fields.projectId, projectId),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
    columns: {
      id: true,
      name: true,
      isLive: true,
      lastUsedAt: true,
      createdAt: true,
      usage: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">API Keys</h3>
        <CreateAPIKey />
      </div>

      <DataTable columns={columns} data={apiKeys} />
    </div>
  );
}
