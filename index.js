const core = require('@actions/core');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const source_branch = core.getInput('source_branch');
    const target_branch = core.getInput('target_branch');
    console.log(`Merging ${source_branch} to ${target_branch}`);

  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
