# Access token expired

- First try to refresh automatically
  - https://next-auth.js.org/tutorials/refresh-token-rotation
- If that doesn't work send them to /signin and they'll get a new token

# Provide UI indicator if token is expired so user doesn't need to find out on their own

# Rate limiting

- Can check headers in web api response
- If doing requests in a for loop, can retry and wait

# Clicking artist opens artist page with albums

- Albums should already be in the db, but if not need to fetch
- Provide way to go back

# Filter out viewed albums from album view on artist

# Method to perform actions on albums

- Mark as viewed
- Play in spotify app
- Play in spotify web player
- Play right in my webapp now?
- Add to playlist

# Show any sort of stats anywhere?
