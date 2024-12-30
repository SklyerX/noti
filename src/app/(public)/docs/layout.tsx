import type { ReactNode } from 'react'
import { DocsNav } from './_components/nav'
import { docsConfig } from '@/config/docs'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-wrapper">
      <div className="px-4 xl:px-6 2xl:px-4 mx-auto max-w-[1536px] flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="border-grid fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
          <div className="no-scrollbar h-full overflow-auto py-4 pr-4 lg:py-6">
            <DocsNav config={docsConfig} />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
