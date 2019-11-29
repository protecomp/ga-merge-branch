# Merge action

A javascript github action to merge a head to a branch.

# Usage

```yaml
name: 'Master -> Develop merge'

on:
  push:
    branches:
      - master
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: protecomp/ga-merge-branch@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        target_branch: develop
        commit_sha: ${{ github.sha }}
        repository: ${{ github.repository }}
```
