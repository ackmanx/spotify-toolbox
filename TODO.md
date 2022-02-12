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

# Bug with dupes

I've got dupes coming back from server props
Two of them for Shirobon
But in the rendered component i see 5 dupes of that artist
This also affects react keys conflicting
This is happening between restarts too
It appears that the first set is correct
Then there's a dupe set rendered w/o hiding artists without new albums
Going to an artist and coming back, that non-hidden set is itself dupes
But the artists don't seem to be in any particular order
