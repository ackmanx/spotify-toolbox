# Tech Debt

### Initial load should only return genres

- On click of a genre we can get artists then or do init on that genre
- Can delete the local storage for genre visibility, but keep ability to collapse
- Default to all collapsed every time

### Getting latest albums for an artist should be a shared function

- Usages:
- artistId
- all (maybe)
- refresh

### Mark as Viewed should be a post

### Rate limiting (not an issue yet)

- Can check headers in web api response
- If doing requests in a for loop, can retry and wait

# Feature

### Refresh only a single artist

### Update followed artists

### User-generated genres with editor to update

### Method to perform actions on albums

- Play right in my webapp now?

### Show any sort of stats anywhere?

- maybe put in the menu drawer?
- followed artists
- access token expires
- username

### UI mode - view all followed artists

- in this mode, can mark an overlay on an artist to show that it's got new albums

### UI mode - view all albums from artist

- in this mode, can mark an overlay on an album to show that it's new

# Consideration

### Should artistId be stored in the album collection?

- There are often multiple artists and the albums can be published on both of their artist pages

# Bug

### If a user tires to view an artist that has no albums and their token is expired, make a nicer error

### Artist/album art is not always the right proportion

- Example: Mihka!
