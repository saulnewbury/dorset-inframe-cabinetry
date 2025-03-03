'use client'

import { createContext, useContext, useState } from 'react'

// Create context
const ProductListContext = createContext()

// Create provider
export function ProductListProvider({ children }) {
  const [productList, setProductList] = useState([])

  const addToList = (product) => {
    setProductList((prevList) => {
      // Check if product already exists in list to avoid duplicates
      const exists = prevList.some((item) => item.id === product.id)
      if (exists) return prevList
      return [...prevList, product]
    })
  }

  const removeFromList = (productId) => {
    setProductList((prevList) =>
      prevList.filter((item) => item.id !== productId)
    )
  }

  const clearList = () => {
    setProductList([])
  }

  return (
    <ProductListContext.Provider
      value={{ productList, addToList, removeFromList, clearList }}
    >
      {children}
    </ProductListContext.Provider>
  )
}

// Custom hook to use the context
export function useProductList() {
  const context = useContext(ProductListContext)
  if (context === undefined) {
    throw new Error('useProductList must be used within a ProductListProvider')
  }
  return context
}
