
export function getStorage(key) {
  return sessionStorage.getItem(key)
}

export function setStorage(key, valur = {}) {
  return sessionStorage.setItem(key, valur)
}

export function removeStorage(key) {
  return sessionStorage.removeItem(key)
}
