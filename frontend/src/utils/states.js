import React from 'react'

export const StoreContext = React.createContext(null)

const states = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [openModal, setOpenModal] = React.useState(false);
  const [modalHeader, setModalHeader] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');
  const store = {
    loggedIn: [loggedIn, setLoggedIn],
    modalHeader: [modalHeader, setModalHeader],
    modalMessage: [modalMessage, setModalMessage],
    openModal: [openModal, setOpenModal]
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default states;
