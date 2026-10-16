# CampusLend

A React + Vite campus gear-sharing site with an item catalogue and MySQL-backed reservation API.

## Run locally

1. Create the database and sample items: `mysql -u root -p < backend/database.sql`.
2. Copy `backend/.env.example` to `backend/.env` and update your MySQL credentials.
3. In one terminal, run `npm ci` and `npm run server` from `backend`.
4. In another terminal, run `npm ci` and then `npm run dev` from `front end`.

The web app shows a sample catalogue even before the API is running. Once the API and MySQL database are configured, it loads inventory from MySQL and saves borrow requests in the `reservations` table.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to Settings → Pages.
4. Under Build and deployment, choose GitHub Actions.
5. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes the frontend in `front end` automatically.
