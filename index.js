const core = require('@actions/core');
const fetch = require('node-fetch');

// most @actions toolkit packages have async methods
async function run() {
  try { 
    const commit_sha = core.getInput('commit_sha');
    const target_branch = core.getInput('target_branch');
    const github_token = core.getInput('github_token');
    const repository = core.getInput('repository');
    console.log(`Merging ${commit_sha} to ${repository}/${target_branch}`);
    console.log("");

    let query = 'query($owner:String!, $name:String!){repository(owner: $owner, name: $name) {id}}';
    let variables = { owner: repository.split("/")[0], name: repository.split("/")[1] };

    let response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${github_token}`,
      }
    }).then(function(response) {
      return response.json();
    });
    console.log(response);

    const repositoryId = response['data']['repository']['id'];

    query = 'mutation($repositoryId:ID!, $base:String!, $head:String!) {mergeBranch(input:{repositoryId:$repositoryId, base:$base, head:$head}) {mergeCommit {id}}}';
    variables = { repositoryId, base: target_branch, head: commit_sha };

    response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${github_token}`,
      }
    }).then(function(response) {
      return response.json();
    });
    console.log(response);
    console.log(`Done! Merge commit: ${response['mutation']['mergeBranch']['mergeCommit']['id']}`)
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
