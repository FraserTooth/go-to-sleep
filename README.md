# go-to-sleep-action

Stop coding and go to sleep!

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
who-to-greet: 'Mona the Octocat'

## Testing

Locally, run `npm install` to get everything up and running

Download [act](https://github.com/nektos/act) and use the following commands to test locally

```bash

act -e ./test/<testFileYouWantToTry.json>

```

Make sure to run `npm run build` before testing locally
