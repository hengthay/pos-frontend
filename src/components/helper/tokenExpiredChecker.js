const getTokenExpiry = (token) => {
  try {
      // get payload
      const base64Payload = token.split(".")[1];

      // decoded to readable JSON string
      const jsonString = atob(base64Payload);

      // convert to java object
      const payload = JSON.parse(jsonString);

      return payload.exp * 1000; // convert to ms 
  } catch (error) {
    console.log(error);
    return null;
  }
}

const isTokenExpired = (token) => {
  // Get expired date time
  const expiry = getTokenExpiry(token);

  if(!expiry) return true; // if can't get expire force to expire

  return Date.now() >= expiry; // true if expired
}

export { getTokenExpiry, isTokenExpired };