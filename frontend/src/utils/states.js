import React from 'react'

export const StoreContext = React.createContext(null)

const states = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const store = {
    loggedIn: [loggedIn, setLoggedIn],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default states;
