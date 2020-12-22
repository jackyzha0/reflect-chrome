import { Storage } from './types'
import { addMinutes } from './util'

// helper function to retrive chrome storage object
// usage:
//
// getStorage(null).then(storage => {
//     ...
// })
export function getStorage(): Promise<Storage> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (storage) => {
      if (chrome.runtime.lastError !== undefined) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(storage)
      }
    })
  })
}

// helper function to set fields in chrome storage
// usage:
//
// getStorage({enableBlobs: false}).then(storage => {
//     ...
// })
export function setStorage(key: Storage): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(key, () => {
      if (chrome.runtime.lastError !== undefined) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

// Add a single url to blocklist (does nothing if url is already in list)
export function addToBlocked(url: string): void {
  getStorage().then((storage) => {
    // only add if not in list
    if (!storage.blockedSites.includes(url)) {
      storage.blockedSites.push(url) // urls.hostname
      setStorage({ blockedSites: storage.blockedSites }).then(() => {
        console.log(`${url} added to blocked sites`)
      })
    }
  })
}

// Remove single url from blocklist (does nothing if url is not in list)
export function removeFromBlocked(url: string): void {
  getStorage().then((storage) => {
    let blockedSites: string[] = storage.blockedSites

    // remove url from blockedSites
    blockedSites = blockedSites.filter((e) => e !== url)

    // sync with chrome storage
    setStorage({ blockedSites: blockedSites }).then(() => {
      console.log(`removed ${url} from blocked sites`)
    })
  })
}

// Add a single url to whitelist with associated whitelist duration
// (replaces any existing entries)
export function addToWhitelist(url: string, minutes: number): void {
  getStorage().then((storage) => {
    let whitelistedSites: { [key: string]: string } = storage.whitelistedSites
    let expiry: Date = addMinutes(new Date(), minutes)
    whitelistedSites[url] = expiry.toJSON()

    setStorage({ whitelistedSites: whitelistedSites }).then(() => {
      console.log(`${url} added to whitelisted sites`)
    })
  })
}
