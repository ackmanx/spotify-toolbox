# Data Flow

1. Not logged in
   1. Session authentication is `unauthenticated`
   2. No data is sent to the UI
   3. No spotify access token alert
2. User logs in
   1. It doesn't matter if SAT is valid unless you interact with Spotify directly
   2. User is shown the currently-saved list of followed artists with unviewed albums
   3. Data does not include album data, only artist data
3. User clicks on an artist
   1. Get albums for artist from DB
   2. If albums is empty, make a call to Spotify to get all albums for that artist
      1. Save them in DB
   3. User is shown currently-saved list of unviewed albums
4. SAT - User updates followed artists from root page
   1. Show loading screen
   2. Ask spotify for updated followed artists
   3. Add new artists to DB
      1. We are not adding any album data here
      2. New artists won't have any album IDs, which will trigger a pull when that artist page is hit
   4. Need to rebuild genre-to-artist structure afterwards
   5. Update artists state in React
   6. End the loading screen, display new results
5. SAT - User updates albums from an artist page
   1. Show loading screen
   2. Get fresh list of all albums for artist
   3. Update that artist's album IDs in DB
   4. Add each album to DB, one document per album
   5. Update React state, hide loading screen
6. User marks album as viewed
   1. Just add that to user data

# Database

- User
- Artist
  - Album IDs
- Album

This structure allows me to not transfer so much data over the wire that I'll not use

# React

Data loading will happen on the client to keep server data over the wire minimal

Will need api endpoints for these actions, instead of using server side props
