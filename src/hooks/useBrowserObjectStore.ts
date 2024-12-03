import { useCallback, useState } from 'react'
import useBrowserStore from '@/app/common/hooks/useBrowserStore'

interface SessionState {
  [key: string]: any // Allows any type of values for keys, more specific types can be defined if needed
}

function useBrowserObjectStore(
  key: string,
  initialState: SessionState,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) {
  const { Set, Get, Remove, Clear } = useBrowserStore(key, storeType)

  const [state, setState] = useState<SessionState>(() => {
    const storedValue = Get() // Use get function from useStore
    return storedValue ?? initialState
  })

  // Effect to sync state with sessionStorage
  // useEffect(() => {
  //   Set(state) // Use set function from useStore
  // }, [Set])

  const setSessionData = useCallback(
    (updateFunction: (prevState: SessionState) => SessionState) => {
      setState((prevState) => {
        const updatedState = updateFunction(prevState)
        Set(updatedState) // Directly use set from useStore inside update function
        return updatedState
      })
    },
    [Set]
  )

  const removeSessionData = useCallback(() => {
    Remove() // Use remove function from useStore
    setState(initialState)
  }, [Remove, initialState])

  const clearSessionData = useCallback(() => {
    Clear() // Use remove function from useStore
    setState(initialState)
  }, [Remove, initialState])

  return [state, setSessionData, removeSessionData, clearSessionData] as const
}

export default useBrowserObjectStore
