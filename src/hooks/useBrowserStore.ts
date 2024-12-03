import { useCallback } from 'react'

// Types for the useStore hook's configuration
// Inspiration
// https://gist.github.com/MeetBhingradiya/ee9fcba38dcbd96cad228426728e42b0#file-usestore-tsx
// interface UseStoreType {
//   Key?: string
//   Value?: any
// }

// Types for the useStore hook's return functions
interface UseStoreReturnType {
  Set: (value: any) => void
  Get: () => any
  Remove: () => void
  Clear: () => void
}

/**
 * A Function to use localStorage or sessionStorage in React
 *
 * Example usage:
 * const { Set, Get, Remove, Clear } = useStore("sessionStorage", "myStorageKey");
 * const value = Get();  // Retrieves the stored value
 * Set("newValue");  // Stores the new value
 * Remove();  // Removes the item from storage
 * Clear();  // Clears all storage
 */
function useBrowserStore(
  key: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
): UseStoreReturnType {
  const Set = useCallback(
    (value: any) => {
      if (typeof window !== 'undefined' && window[storeType] && key) {
        window[storeType].setItem(key, JSON.stringify(value))
      }
    },
    [key, storeType]
  )

  const Get = useCallback(() => {
    if (typeof window !== 'undefined' && window[storeType] && key) {
      const item = window[storeType].getItem(key)
      return item ? JSON.parse(item) : null
    }
  }, [key, storeType])

  const Remove = useCallback(() => {
    if (typeof window !== 'undefined' && window[storeType] && key) {
      window[storeType].removeItem(key)
    }
  }, [key, storeType])

  const Clear = useCallback(() => {
    if (typeof window !== 'undefined' && window[storeType] && key) {
      window[storeType].clear()
    }
  }, [storeType])

  return { Set, Get, Remove, Clear }
}

export type { UseStoreReturnType }
export default useBrowserStore
