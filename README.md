# NotifyHub Web App

Discord notification platform built with Next.js 15, Drizzle ORM, Lucia Auth, and Discord.js

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Database:** [PostgreSQL](https://www.postgresql.org)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Authentication:** [Lucia](https://lucia-auth.com)
- **Discord Integration:** [Discord.js](https://discord.js.org)
- **Deployment:** [Vercel](https://vercel.com)

## Features

- 📊 Modern dashboard to manage notifications
- 🔑 API key management
- 📝 Event history and tracking
- 🎨 Customizable notification templates
- 👥 Team collaboration (coming soon)
- 📈 Usage analytics (coming soon)

## Running Locally

1. Clone the repository

```bash
git clone https://github.com/sklyerx/noti.git
cd noti
```

2. Install dependencies

```bash
pnpm install
```

3. Copy the example environment file

```bash
cp .env.example .env
```

4. Configure environment variables

5. Run the development server

```bash
pnpm dev
```

## Database Setup

Create a new PostgreSQL database and run the migrations:

```bash
pnpm db:migrate
```

## Contributing

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request

## License

[MIT License](./LICENSE)