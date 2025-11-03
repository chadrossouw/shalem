function getCsrfTokenFromCookie() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

async function safeFetch(url, options = {}) {
  // Default options with credentials included
  let authToken = window.sessionStorage.getItem('auth_token');
  
  const defaultOptions = {
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };
  if(authToken){
      defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Merge options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  if(!authToken){
    let csrfToken = getCsrfTokenFromCookie();
    if(!csrfToken){
        let baseUrl = import.meta.env.VITE_BASE_URL;
        await fetch(`${baseUrl}sanctum/csrf-cookie`, { 
          credentials: 'same-origin',
          method: 'GET'
        });
        csrfToken = getCsrfTokenFromCookie();
        if(url == `${baseUrl}sanctum/csrf-cookie`){
            return;
        }
    }
    
    // Send both XSRF and CSRF tokens for maximum compatibility
    if (csrfToken) {
      mergedOptions.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  
  let response;
  try {
    response = await fetch(url, mergedOptions);
    if(!response.ok){
        throw {status: response.status, message: response.statusText};
    }
  } catch (error) {
    // if error is 419 or 401 
    console.log('Request failed with error:', error);
    if (error.status === 419 || error.status === 401) {
      window.location.href='/?error=auth';
    }
    throw error;
  }
  return response;
}

export { safeFetch };