# Oats Bundle Diagnostics

This repository includes a script to diagnose bundle issues, a database to track them, and a UI to view them.

### Script

The script fetches potential issues from BigQuery, then uses the Recharge API to verify the issues are real and not just data out of sync. Issues are stored to the database.


### Frontend

A simple app that displays diagnosed issues.

## Development

Make sure you have supabase installed, then run:

```bash
yarn
supabase start
supabase db reset
supabase status
```

Now, create a `.env` file with your credentials. You will need to obtain both BigQuery credentials and a Recharge API token.

```txt
BIG_QUERY_CREDENTIALS=xxx
RECHARGE_API_TOKEN=xxx
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=xxx
VITE_SUPABASE_SERVICE_KEY=xxx
```

### Running

To run the processes:

```bash
yarn script:start
yarn frontend:dev
```

## Copyright

2022 Oats Overnight
