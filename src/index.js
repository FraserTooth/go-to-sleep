const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const fetch = require("node-fetch");

async function run() {
  try {
    const githubToken = core.getInput("GITHUB_TOKEN");
    const customMessage = core.getInput("message");
    const { context } = github;

    const octokit = new Octokit({ auth: githubToken });

    const senderObject = context.payload.sender;

    const senderAPIURL = senderObject.url;
    const userDataResponse = await fetch(senderAPIURL);
    const userData = await userDataResponse.json();
    const userLocation = userData.location;

    console.log(context.payload);

    let timestamp = new Date();
    let timezone;
    const timezoneRegex = /[\+\-]\d\d:\d\d/gm;

    if (context.payload.commits) {
      timestamp = context.payload.commits.map((commit) => {
        timezoneString = timezoneRegex.exec(commit.timestamp)[0];

        [tzHours, tzMinutes] = timezoneString.split(":").map(Number);

        const time = new Date(commit.timestamp);
        const hour = time.getHours();
        const mins = time.getMinutes();

        console.log(hour, mins);

        const timeshift =
          tzHours > 0 ? tzHours + tzMinutes / 60 : tzHours - tzMinutes / 60;

        const totalHour = hour + mins / 60 + timeshift;
        const timeInLocation = totalHour >= 24 ? totalHour - 24 : totalHour;

        const outOfBounds = timeInLocation < 9 || 19 > timeInLocation;

        const timefacts = {
          time,
          timezoneString,
          outOfBounds,
        };

        console.log(`Its currently ${timeInLocation} where you are.`);

        if (outOfBounds) {
          console.log(
            `You are very naughty working outside of work hours, get some rest!`
          );
        }

        return timefacts;
      });
    }

    // if (context.payload.review) {
    //   if (context.payload.action === "submitted") {
    //     const issueNumber = context.payload.pull_request.number;
    //     const repository = context.payload.repository;

    //     const reviewObject = context.payload.review;

    //     const commentAuthor = reviewObject.user.login;

    //     const message = customMessage
    //       ? customMessage
    //       : `<img src="https://media.giphy.com/media/3ohzdQ1IynzclJldUQ/giphy.gif" width="400"/> </br>
    //                                   Hey @${commentAuthor}! 👋 <br/> PRs and issues should be safe environments but your comment: <strong>"${toxicComment}"</strong> was classified as potentially toxic! 😔</br>
    //                                   Please consider spending a few seconds editing it and feel free to delete me afterwards! 🙂`;

    //     return octokit.issues.createComment({
    //       owner: repository.owner.login,
    //       repo: repository.name,
    //       issue_number: issueNumber,
    //       body: message,
    //     });
    //   }
    // }
    // if (context.payload.comment) {
    //   if (
    //     context.payload.action === "created" ||
    //     context.payoad.action === "edited"
    //   ) {
    //     const issueNumber = context.payload.issue.number;
    //     const repository = context.payload.repository;
    //     const octokit = new github.GitHub(githubToken);

    //     const comments = [];
    //     const commentsObjects = [];

    //     const latestComment = context.payload.comment;
    //     comments.push(latestComment.body);
    //     commentsObjects.push(latestComment);

    //     const commentAuthor = commentsObjects[index].user.login;
    //     toxicComment = commentsObjects[index].body;
    //     const message = customMessage
    //       ? customMessage
    //       : `<img src="https://media.giphy.com/media/3ohzdQ1IynzclJldUQ/giphy.gif" width="400"/> </br>
    //                                   Hey @${commentAuthor}! 👋 <br/> PRs and issues should be safe environments but your comment: <strong>"${toxicComment}"</strong> was classified as potentially toxic! 😔</br>
    //                                   Please consider spending a few seconds editing it and feel free to delete me afterwards! 🙂`;

    //     return octokit.issues.createComment({
    //       owner: repository.owner.login,
    //       repo: repository.name,
    //       issue_number: issueNumber,
    //       body: message,
    //     });
    //   }
    // }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
