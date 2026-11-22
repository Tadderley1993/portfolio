import { createContext, useContext } from 'react'
import type { FsItem } from '../content/fs'

export interface OsContextValue {
  /** Open a file-system item (folder, document, project or app). */
  openItem: (item: FsItem) => void
  /** Leave the computer and open the notebook form. */
  onBook: () => void
  /** Leave the computer. */
  onExit: () => void
  compact: boolean
  /** Touch input: single tap opens items. */
  touch: boolean
}

export const OsContext = createContext<OsContextValue>({
  openItem: () => {},
  onBook: () => {},
  onExit: () => {},
  compact: false,
  touch: false,
})

export const useOs = () => useContext(OsContext)
