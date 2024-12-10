import { CreateProjectButton } from "./create-project-modal";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

export default async function Page() {
  const user = await getCurrentUser();

  const projects = await db.query.projectsTable.findMany({
    where: (fields, { eq }) => eq(fields.userId, user?.id as number),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });

  return (
    <div className="mx-auto container mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <CreateProjectButton />
      </div>
      <div className="flex flex-wrap gap-4 mt-5">
        {projects.map((project) => (
          <Link
            className="!w-96 block"
            href={`/dashboard/${project.id}`}
            key={project.id}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {project.id}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Created{" "}
                    {formatDistanceToNowStrict(project.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
