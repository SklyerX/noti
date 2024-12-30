import type { Icons } from "@/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
    {
      title: "Installation",
      items: [
        {
          title: "Node.js",
          href: "/docs/installation/node",
          items: [],
        },
      ],
    },
    {
      title: "API",
      items: [
        {
          title: "Retrieve",
          href: "/docs/api/retrieve",
          items: [],
        },
        {
          title: "Send",
          href: "/docs/api/send",
          items: [],
        },
        {
          title: "Usage",
          href: "/docs/api/usage",
          items: [],
        },
      ],
    },
    {
      title: "SDK",
      items: [
        {
          title: "Node.js",
          href: "/docs/sdk/node",
          items: [],
        },
      ],
    },
  ],
};
