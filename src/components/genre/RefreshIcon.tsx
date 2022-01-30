import React, { forwardRef } from 'react'

const RefreshIcon = forwardRef<SVGSVGElement>((props, ref) => (
  <svg
    width='50px'
    height='50px'
    viewBox='0 0 100 100'
    xmlns='http://www.w3.org/2000/svg'
    ref={ref}
    {...props}
  >
    <path
      d='M53.891 11.922c-.387 0-.77 0-1.156.012-.88.011-1.758.039-2.633.082-7.543.363-15.141 1.797-22.195 4.832-7.063 3.039-13.543 7.715-18.246 13.957-2.121 2.816-4.023 6.152-4.535 10.027-.09.668-.133 1.347-.125 2.03v11.689c0 1.332.191 2.676.613 3.988.633 1.97 1.781 3.809 3.445 5.196 1.442 1.203 3.114 1.937 4.77 2.367 1.652.426 3.281.554 4.82.582 3.074.054 5.832-.235 8.207.16 4.238.703 8.164 3.582 11.746 6.96 3.602 3.4 7.137 7.454 11.941 10.34 5.848 3.513 12.914 4.692 19.582 3.458 6.66-1.23 12.75-4.817 17.176-9.887C91.953 72.387 94.7 65.5 94.977 58.43c.016-.406.02-.812.02-1.219V45.523c.011-6.687-2.176-13.32-6.2-18.676-4.437-5.91-10.84-9.996-17.676-12.297-5.593-1.882-11.445-2.61-17.23-2.625zm.14 4.898c.41 0 .82.012 1.231.02 4.91.121 9.754.816 14.301 2.348 6.047 2.035 11.598 5.636 15.32 10.594 3.555 4.734 5.43 10.773 5.2 16.69-.231 5.919-2.575 11.794-6.473 16.259-3.707 4.246-8.875 7.27-14.38 8.289-5.495 1.015-11.41.015-16.167-2.84-3.946-2.367-7.282-6.098-11.102-9.703-3.844-3.625-8.477-7.266-14.305-8.23-3.27-.544-6.278-.176-8.918-.223-1.32-.024-2.563-.137-3.68-.426-1.11-.285-2.11-.758-2.863-1.387-.864-.719-1.543-1.77-1.918-2.933-.375-1.172-.47-2.493-.293-3.809.347-2.645 1.754-5.277 3.59-7.719 4.105-5.449 9.882-9.656 16.27-12.406 6.394-2.75 13.413-4.098 20.495-4.437 1.23-.059 2.465-.09 3.696-.082zm-.023 4.672c-1.14-.011-2.293.02-3.449.078-6.64.32-13.109 1.582-18.871 4.063-5.738 2.469-10.844 6.23-14.383 10.926-1.566 2.082-2.496 4.043-2.691 5.516-.094.714-.024 1.351.109 1.769.125.39.36.691.46.773.102.082.462.301 1.044.454.605.156 1.48.257 2.59.277 2.23.039 5.48-.395 9.597.285 7.344 1.215 12.652 5.578 16.746 9.441 4.032 3.805 7.18 7.223 10.301 9.098 3.72 2.23 8.536 3.063 12.914 2.25 4.403-.816 8.688-3.305 11.711-6.77 3.18-3.644 5.133-8.546 5.325-13.366.187-4.82-1.38-9.856-4.266-13.703-3.043-4.055-7.785-7.192-13.074-8.973-4.004-1.348-8.379-1.996-12.922-2.106a36.853 36.853 0 0 0-1.14-.015zm11.387 20.07.004.004c4.59 0 8.313 2.77 8.313 6.184s-3.723 6.183-8.313 6.183c-2.207 0-4.32-.652-5.879-1.812-1.558-1.16-2.433-2.73-2.433-4.371s.875-3.215 2.433-4.375c1.559-1.156 3.676-1.809 5.88-1.809z'
      fillRule='evenodd'
    />
  </svg>
))

RefreshIcon.displayName = 'RefreshIcon'

export default RefreshIcon