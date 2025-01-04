import { cn } from "@/lib/utils";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  projectName: string;
}

export default function Notification({
  name,
  description,
  icon,
  color,
  projectName,
  time,
}: Item) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-[100px] w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex h-full">
        {/* Left colored bar */}
        <div className="w-1" style={{ backgroundColor: color }} />

        <div className="flex flex-1 gap-3 p-4">
          {/* Icon circle */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: color }}
          >
            <span className="text-lg text-white">{icon}</span>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium sm:text-lg">{name}</span>
              <span className="text-xs text-gray-500">{time}</span>
            </div>

            <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
              {description}
            </p>

            {projectName && (
              <span className="mt-3 text-xs text-gray-500">{projectName}</span>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
