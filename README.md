# Status Dashboard

## Run

```bash
yarn start
```

## Deploy

```bash
yarn deploy
```

## Statuses

* All statuses that are not _"Live"_-statuses are collected from Azure DevOps badges.
* All URLs are located in `src/api/urls.ts`
* Any badge can become a status, just add it to the array or URLS in `src/api/urls.ts`
* All _"Live"_-statuses are pinging Marc, reverseproxy or WebPlatform
