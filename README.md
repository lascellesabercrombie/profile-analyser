# GitHubble

## Summary

An app to analyse GitHub profiles using the GitHub API. Some of the data are visualised for the user with Chart.js.

## Background 

The final project for Founders and Coders' pre-apprenticeship part-time course. Details [here](https://learn.foundersandcoders.com/course/syllabus/pre-apprenticeship/projects/project/). I opted for this project because I was interested in working more with APIs and promises, and in beginning to learn about using code to visualise data.

## User Stories

- I want to search a user by GitHub handle and find some interesting information about their use of GitHub
- I want to be able to see a user’s starred projects
- I want to be able to see their recent activity
- I want to see what their most popular repos are 
- I want to be able to see who they’ve collaborated with
- I like to interpret information through charts and want the information to be available in that form
- I am a visually impaired user and want to use the app with a screen-reader

## User Journey

- User lands on the page
- User enters a name
- User clicks search
- User is presented with information
- User can follow links to users and repos in the starred section
- User can click a user's repo to see a graph of contributors
- User can enter a new search

## Design

I kept it fairly simple, since the charts were intended to be the main visual pull. That said, after I came up with the title, I included a couple more nods to space exploration. The grey of the background and the blue bordering the user's profile picture were both pinched from the website of the British Interplanetary Society.

## Further Steps

- It needs quite a bit of work to make it more accessible. This would include loading the data in tabulated form as well as in charts. I think a dynamically generated prose summary of some of the key information shown on the charts should also be possible.
- I was testing manually while making this. Some automatic tests would be useful.
- The activity chart has an 'undefined' section that could be broken up further to yield more information
- It could be fun to allow the user to choose what type of graph they want the data to be presented in
- There could be more visual cues that the repo names in the list are clickable and what that click will do
- More error messages: putting in a name that does not have an attached profile currently gives no feedback.
