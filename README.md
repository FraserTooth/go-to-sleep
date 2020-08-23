# The Github Go-To-Sleep Action

![Sleepy Time](https://media.giphy.com/media/mguPrVJAnEHIY/giphy.gif)

Stop coding and go to sleep!

## Inputs

### `GITHUB_TOKEN`

**Required**  
Just put `${{ secrets.GITHUB_TOKEN }}` and it should work fine.

### `custom_mesage`

**Optional**  
Put your custom message as a Markdown formatted string:  
e.g. `custom_message: "Oh dear, its very late where you are.\nWe appreciate your hard work but maybe you should go to bed."`

Default: `"Its quite late, maybe you should go to sleep!"`

### `timezone`

**Required for any events other than commits (push)**  
Enter your team's timezone in the ISO format `(+/-)hh:mm`:  
e.g. `timezone: "+09:00"`

## How to use

_If you do not have any Github actions already set up in your repo, start by creating a .github/workflows folder._

Inside your workflows folder, create a new .yml file, for example `main.yml` and copy the following lines:

```yml
on:
  [
    push,
    pull_request,                 # Slightly Supported
    pull_request_review,          # Not Supported
    pull_request_review_comment,  # Not Supported
    issues,                       # Not Supported
    issue_comment,                # Not Supported
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
```

## Testing

Locally, run `npm install` to get everything up and running

Download [act](https://github.com/nektos/act) and use the following commands to test locally

```bash

act -e ./test/<testFileYouWantToTry.json>

```

Make sure to run `npm run build` before testing locally
