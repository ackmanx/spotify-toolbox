* Access token expired
  * First try to refresh automatically
    * https://next-auth.js.org/tutorials/refresh-token-rotation
  * If that doesn't work send them to /signin and they'll get a new token
  * Provide UI indicator if token is expired

* Paging with spotify web api
  * They don't do it. Need to do it ourselves

* Rate limiting
  * Can check headers in web api response
  * If doing requests in a for loop, can retry and wait

