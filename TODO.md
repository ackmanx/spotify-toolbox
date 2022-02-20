# Refresh only a single artist

# Update followed artists

# Remove duplicate new albums if same name

- Need to migrate viewedAlbums to include the album name too
- Need to update user document usages of viewedAlbums
- Update refresh genre
- Update artist albums page api call

# Bug - If a user tires to view an artist that has no albums and their token is expired, make a nicer error

# Mark as Viewed should be a post

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

# Rate limiting (not an issue yet)

- Can check headers in web api response
- If doing requests in a for loop, can retry and wait
