function getCsrfTokenFromCookie() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

async function safeFetch(url, options = {}) {
  // Default options with credentials included
  const defaultOptions = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Referer': window.location.origin
    }
  };

  // Merge options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  // Only add CSRF token for non-GET requests
  if (mergedOptions.method && mergedOptions.method.toLowerCase() !== 'get') {
    const csrfToken = getCsrfTokenFromCookie();
    if(!csrfToken){
        csrfToken = await fetch('/sanctum/csrf-cookie');
    }
    mergedOptions.headers['X-CSRF-Token'] = csrfToken;
  }

  return fetch(url, mergedOptions);
}

export { safeFetch };