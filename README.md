# Kairo dashboard

This is the Kairo dashboard application

## Quick start (pnpm)

1. Install Node.js (v20+ recommended).

2. Install pnpm globally:

   ```bash
   npm install -g pnpm
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

   Open http://localhost:3000 in your browser.

5. Build for production:

   ```bash
   pnpm build
   pnpm start
   ```

## Environment variables

Create a `.env.local` in the project root to set local environment values. See the require environment variables names in `.env.sample`. The project reads these environment variables in `next.config.ts`:
