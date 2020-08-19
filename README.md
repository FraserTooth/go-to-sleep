# go-to-sleep-action

Stop coding and go to sleep!

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## How to use

_If you do not have any Github actions already set up in your repo, start by creating a .github/workflows folder._

Inside your workflows folder, create a new .yml file, for example `main.yml` and copy the following lines:

```yml
on:
  [
    push,
    pull_request,
    pull_request_review,
    pull_request_review_comment,
    issues,
    issue_comment,
  ]

jobs:
  go_to_sleep_job:
    runs-on: ubuntu-latest
    name: Go To Sleep-o-tron
    steps:
      - name: GTFTSleep
        id: hello
        uses: FraserTooth/go-to-sleep-action@master
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          custom_message: "GTFT Sleep!"
```

`GITHUB_TOKEN` is **required** but two other parameters are optional:

## Testing

Locally, run `npm install` to get everything up and running

Download [act](https://github.com/nektos/act) and use the following commands to test locally

```bash

act -e ./test/<testFileYouWantToTry.json>

```

Make sure to run `npm run build` before testing locally
