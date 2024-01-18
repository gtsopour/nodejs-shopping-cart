import os
import json
import requests
from urllib.parse import urlparse

# Get the environment variables
github_token = os.getenv('GITHUB_TOKEN')
circle_pull_request = os.getenv('CIRCLE_PULL_REQUEST')

# Parse the pull request URL to extract the PR number
pr_number = urlparse(circle_pull_request).path.split('/')[-1]

# Repository information
owner, repo = os.getenv('CIRCLE_PROJECT_USERNAME'), os.getenv('CIRCLE_PROJECT_REPONAME')

# Semgrep output file (assumed to be in JSON format)
semgrep_output_file = 'semgrep_output.json'

# GitHub API URL for posting comments
comments_url = f'https://api.github.com/repos/{owner}/{repo}/issues/{pr_number}/comments'

# Read the Semgrep findings from the output file
with open(semgrep_output_file) as f:
    findings = json.load(f)

# Post a comment for each finding
headers = {
    'Authorization': f'token {github_token}',
    'Accept': 'application/vnd.github.v3+json'
}

for finding in findings['results']:
    message = finding['extra']['message']
    path = finding['path']
    start_line = finding['start']['line']
    comment_body = f'Semgrep finding: {message} at {path}:{start_line}'
    data = {'body': comment_body}
    response = requests.post(comments_url, headers=headers, json=data)
    if response.status_code != 201:
        print(f'Error posting comment: {response.content}')

