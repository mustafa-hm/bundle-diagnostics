# Oats Bundle Diagnostics

This repository includes a script to diagnose bundle issues, a database to track them, and a UI to view them.

### Script

The script fetches potential issues from BigQuery, then uses the Recharge API to verify the issues are real and not just data out of sync. Issues are stored to the database.


### Frontend

A simple app that displays diagnosed issues.

## Development

Clone this repo, and run:

```bash
yarn
yarn script:start
yarn frontend:dev
```

## Copyright

2022 Oats Overnight
