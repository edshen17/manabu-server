/**
 * Gets host based off of env
 * @returns Object containg information about dev/production host urls (used mainly for redirecting)
 */
const getHost = (type) => {
    if (type == 'client') {
        if (process.env.NODE_ENV != 'production') {
            return 'http://localhost:8080' 
        } else {
            return 'https://manabu.sg' 
        }
    }
    else if (type == 'server') {
        if (process.env.NODE_ENV != 'production') {
            return 'http://localhost:5000'
        } else {
            return 'https://manabu.sg'
        }
    }
    
}


module.exports = getHost;