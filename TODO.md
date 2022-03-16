# Bug

### If a user tires to view an artist that has no albums fetched yet and their token is expired, make a nicer error

### No error message for 404 on mark as viewed but it looks like it works

### Duplicate album removal not working on artist refresh here

https://www.ialreadysawthat.com/artist/0hprEC0nsWuQPSHag1O2Vi

### Artist still showing up in genre's artist list even though no albums

I Thought I fixed th is

https://www.ialreadysawthat.com/artist/37awA8DFCAnCCL7aqYbDnD

https://www.ialreadysawthat.com/artist/5JpmFYHmzG3e2GUKL8gEx4

# Feature

### Mark all albums as viewed for an artist (helpful with Singles)

### Refresh token without signing out/in

### User-generated genres with editor to update

### Album menu

- Play right in my webapp now?
- How can I better display data

### Have link to artist's spotify page

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
