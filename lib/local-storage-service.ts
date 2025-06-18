// Tipos de dados que podem ser armazenados localmente
type StorageKey = "pacientes" | "avaliacoes" | "secoes" | "mif" | "pendingSync"

// Interface para operações pendentes
interface PendingOperation {
  id: string
  operation: "insert" | "update" | "delete"
  table: string
  data: any
  timestamp: number
}

// Prefixo para as chaves no localStorage
const STORAGE_PREFIX = "pts_form_"

// Funções auxiliares para trabalhar com localStorage
const getItem = <T>(key: StorageKey): T | null => {
  if (typeof window === "undefined") return null
  
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage: ${error}`)
    return null
  }
}

const setItem = <T>(key: StorageKey, value: T): void => {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error)
  }
}

// Gerenciamento de operações pendentes
export const addPendingOperation = (
  operation: "insert" | "update" | "delete",
  table: string,
  data: any
): void => {
  const pendingOperations: PendingOperation[] = getPendingOperations()
  
  const newOperation: PendingOperation = {
    id: crypto.randomUUID(),
    operation,
    table,
    data,
    timestamp: Date.now()
  }
  
  pendingOperations.push(newOperation)
  setItem("pendingSync", pendingOperations)
}

export const getPendingOperations = (): PendingOperation[] => {
  return getItem<PendingOperation[]>("pendingSync") || []
}

export const clearPendingOperation = (id: string): void => {
  const pendingOperations = getPendingOperations()
  const filtered = pendingOperations.filter(op => op.id !== id)
  setItem("pendingSync", filtered)
}

// Funções para trabalhar com dados offline
export const getLocalPacientes = () => getItem<any[]>("pacientes") || []
export const setLocalPacientes = (pacientes: any[]) => setItem("pacientes", pacientes)

export const getLocalAvaliacoes = () => getItem<any[]>("avaliacoes") || []
export const setLocalAvaliacoes = (avaliacoes: any[]) => setItem("avaliacoes", avaliacoes)

export const getLocalSecoes = () => getItem<any[]>("secoes") || []
export const setLocalSecoes = (secoes: any[]) => setItem("secoes", secoes)

export const getLocalMif = () => getItem<any[]>("mif") || []
export const setLocalMif = (mif: any[]) => setItem("mif", mif)

// Limpar todos os dados locais (útil para logout)
export const clearAllLocalData = (): void => {
  if (typeof window === "undefined") return
  
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key))
}

// Verificar se há dados pendentes de sincronização
export const hasPendingSyncData = (): boolean => {
  const pendingOperations = getPendingOperations()
  return pendingOperations.length > 0
}
