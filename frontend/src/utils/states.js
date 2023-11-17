import React from 'react'

/*
React Context Object that is used to give components access to states object which is used as prop by global components such as
the MessageModal component and the LoadingBackdrop component (These components is in App.jsx).
Additionaly the context also contains the loggedIn state which used to tell the componentsin the application whether the
current user is logged in or not

The modalHeader, modalMessage, and openModal state is tied to the MessageModal componnet where:
1. changing the modalHeader state will change the title displayed in the MessageModal componnet
2. changing the modalMessage state will change the message displayed in the MessageModal component
3. changing the openModal state to true will show the message modal while setting it to false will hide the MessageModal component)

Meanwhile the openBackdrop state is tied to the LoadingBackdrop component where if its set to true then the LoadingBackdrop will show up on screen,
on the other hand setting it to false will hide the LoadingBackdrop component

This Context code is implemented using the design pattern provided by the guide from https://dev.to/nazmifeeroz/using-usecontext-and-usestate-hooks-as-a-store-mnm
which is provided by the COMP6080 lecture slide
*/
export const StoreContext = React.createContext(null);
const states = ({ children }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [modalHeader, setModalHeader] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');
  const store = {
    loggedIn: [loggedIn, setLoggedIn],
    modalHeader: [modalHeader, setModalHeader],
    modalMessage: [modalMessage, setModalMessage],
    openModal: [openModal, setOpenModal],
    openBackdrop: [openBackdrop, setOpenBackdrop],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default states;
