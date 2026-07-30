# CampusLend

A React + Vite campus gear-sharing site with an item catalogue and MySQL-backed reservation API.

## Run locally

1. Create the database and sample items: `mysql -u root -p < database.sql`
2. Copy `.env.example` to `.env` and update your MySQL credentials.
3. In one terminal run `npm run server`.
4. In another terminal run `npm run dev`.

The web app shows a sample catalogue even before the API is running. Once the API and MySQL database are configured, it loads inventory from MySQL and saves borrow requests in the `reservations` table.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to Settings → Pages.
4. Under Build and deployment, choose GitHub Actions.
5. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will publish the site automatically.
