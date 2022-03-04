# Bug

### Not every artist has an album/single because they may only have "appears on" which I'm not tracking

- Example: K9999
- This causes the app to always show the artist as having unviewed albums but the viewed albums for that artist is empty
- This implies we've never looked at them before and we should

### If a user tires to view an artist that has no albums fetched yet and their token is expired, make a nicer error

### Artist/album art is not always the right proportion

- Example: Mihka!
- Sometimes we show squished, and other times we show default no-image-found image

# Feature

### Refresh token without signing out/in

### Update followed artists

### User-generated genres with editor to update

### Method to perform actions on albums

- Play right in my webapp now?
- How can I better display data

### Show any sort of stats anywhere?

- relocate refresh genre button maybe
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
- What is the impact of having artistId on an album?

# Tech Debt

### Standardize error handling

- Can have helpers for error responses on BE
- Maybe have a fetch wrapper for the FE that will toast an error

### Getting latest albums for an artist should be a shared function

- Usages:
- artistId
- all (maybe)
- refresh

### Mark as Viewed should be a post

### Rate limiting (not an issue yet)

- Can check headers in web api response
- If doing requests in a for loop, can retry and wait
