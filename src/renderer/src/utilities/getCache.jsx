let cachedConfig = {}

const getCache = async () => {
  try {
    const response = await fetch('/src/assets/config.json')
    cachedConfig = await response.json()
    return cachedConfig
  } catch (error) {
    console.error('Could not load config.json:', error)
    return cachedConfig
  }
}

export default getCache;
