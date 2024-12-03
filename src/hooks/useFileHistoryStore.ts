import {useCallback, useState} from 'react'
import useBrowserObjectStore from '@/app/common/hooks/useBrowserObjectStore'

interface SessionState {
    [key: string]: any
}

function useFileHistoryStore() {
    const {Set, Get, Remove, Clear} = useBrowserObjectStore('pdf-conversion-history', {}, 'sessionStorage')

    // To store the incremented ID and its corresponding Blob data
    const [history, setHistory] = useState<SessionState>(() => {
        const storedHistory = Get() // Retrieve the history from storage
        return storedHistory ?? {}
    })

    const addFileToHistory = useCallback((fileName: string, fileBlob: Blob) => {
        // Create an incremental key for each new file
        const newFileId = `file-${Date.now()}` // You can use a more robust counter if needed

        // Create a new entry to save the file
        const newHistory = {
            ...history,
            [newFileId]: {name: fileName, fileBlob}
        }

        setHistory(newHistory)
        Set(newHistory) // Save the updated history in sessionStorage
    }, [history, Set])

    const getFileHistory = useCallback(() => {
        return history
    }, [history])

    const removeFileFromHistory = useCallback((fileId: string) => {
        const newHistory = {...history}
        delete newHistory[fileId]

        setHistory(newHistory)
        Set(newHistory)
    }, [history, Set])

    const clearHistory = useCallback(() => {
        setHistory({})
        Clear() // Clear sessionStorage
    }, [Clear])

    return {
        addFileToHistory,
        getFileHistory,
        removeFileFromHistory,
        clearHistory
    }
}

export default useFileHistoryStore
