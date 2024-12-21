import React from "react";
import DeleteProject from "./_components/delete-project";
import { db } from "@/db";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function Settings({ params: { projectId } }: Props) {
  const project = await db.query.projectsTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, projectId),
  });

  return (
    <div>
      <h3 className="text-2xl font-semibold">Settings</h3>
      <div className="mt-5">
        <DeleteProject
          projectId={projectId}
          projectName={
            project?.name as string
          } /* enforcing type string because project validation is already being done on the layout.tsx */
        />
      </div>
    </div>
  );
}
