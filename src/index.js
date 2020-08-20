const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const fetch = require("node-fetch");

function convertGithubTIme(
  timestamp,
  timezoneString = null,
  custom_timezone = null
) {
  let tzHours, tzMinutes;
  if (custom_timezone) {
    [tzHours, tzMinutes] = custom_timezone.split(":").map(Number);
  } else {
    [tzHours, tzMinutes] = timezoneString.split(":").map(Number);
  }

  const time = new Date(timestamp);
  const hour = time.getHours();
  const mins = time.getMinutes();

  const timeshift =
    tzHours > 0 ? tzHours + tzMinutes / 60 : tzHours - tzMinutes / 60;

  const totalHour = hour + mins / 60 + timeshift;
  const timeInLocation = totalHour >= 24 ? totalHour - 24 : totalHour;

  const outOfBounds = timeInLocation < 9 || 19 < timeInLocation;

  return {
    time,
    timeInLocation,
    outOfBounds,
  };
}

async function run() {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");
    const { context } = github;
    const event = context.eventName;
    const repository = context.payload.repository;

    const octokit = new Octokit({ auth: githubToken });

    const message =
      core.getInput("custom_message") ||
      "Its quite late, maybe you should go to sleep!";

    console.log(`Event Type: ${event}`);
    // console.log(context.payload);
    // console.log("Context");
    // console.log(context);
    // console.log("Payload");
    // console.log(JSON.stringify(context.payload, undefined, 2));

    let custom_timezone = core.getInput("timezone");
    const timezoneRegex = /[\+\-]\d\d:\d\d/gm;

    /* Event Types
    //   push - commits 
    //   pull_request - opened pr
    //   pull_request_review - reviewed pr
    //   pull_request_review_comment,
    //   issues - new issue
    //   issue_comment - comment on issue OR pr itself
    */

    // A Push Event is the Only Event where we can easily find out the person's timezone from the data
    if (event === "push" && context.payload.commits) {
      context.payload.commits.forEach((commit) => {
        const timezoneString = timezoneRegex.exec(commit.timestamp)[0];

        ({ time, timeInLocation, outOfBounds } = convertGithubTIme(
          commit.timestamp,
          timezoneString
        ));

        console.log(`Its currently ${timeInLocation} where you are.`);

        if (outOfBounds) {
          octokit.repos.createCommitComment({
            owner: repository.owner.login,
            repo: repository.name,
            commit_sha: commit.id,
            body: message,
          });
        }
      });
      return; // Finish
    }

    // Need Custom Timestamp to proceed
    if (!custom_timezone) return;

    if (event === "pull_request" && context.payload.pull_request) {
      ({ time, timeInLocation, outOfBounds } = convertGithubTIme(
        commit.timestamp,
        null,
        custom_timezone
      ));

      console.log(`Its currently ${timeInLocation} where you are.`);

      if (outOfBounds) {
        octokit.issues.createComment({
          owner: repository.owner.login,
          repo: repository.name,
          issue_number: context.payload.pull_request.number,
          body: message,
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

module.exports = run;
