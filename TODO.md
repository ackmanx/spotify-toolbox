# Refresh only a single artist

# Method to perform actions on albums

- Play right in my webapp now?
- Add to playlist

# Show any sort of stats anywhere?

- maybe put in the menu drawer?
- followed artists
- access token expires
- username

# UI mode - view all followed artists

- in this mode, can mark an overlay on an artist to show that it's got new albums

# UI mode - view all albums from artist

- in this mode, can mark an overlay on an album to show that it's new

# Style the sign in page?

# Use session `status` for auth considerations over `data`?

# Rate limiting

- Can check headers in web api response
- If doing requests in a for loop, can retry and wait

# Bug

If a new user signs in and has the same followed artists, looks like I'm creating duplicates in the db during seed
this is because getServerSideProps is being called twice for some reason and race condition allows dupes
