import React from 'react';
import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'; // Needed as there is a use navigate inside the component
import userEvent from '@testing-library/user-event'
import Navbar from '../components/Navbar';

// Test Case for the Navbar component
describe('Navbar', () => {
  /*
  Test case that checks the component that is rendered when the user is not logged in (logged in prop is false) which in turn
  should render the home button, Settings button where upon clicking will open a menu with the Login and Register button in the settings menu and
  a message that says Welcome Guest
  */
  it('render the navbar where the user is not logged in', async () => {
    render(
    <Router>
       <Navbar loggedIn={false}/>
    </Router>
    );

    // Check that there is a home button in the navbar
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toBeInTheDocument();

    // Check that there is the settings button
    const settingsButton = screen.getByLabelText(/Open Settings/i);
    expect(settingsButton).toBeInTheDocument();

    // Simulate a click on the settings button to to open the menu
    userEvent.click(settingsButton);

    // Check if the setting menu appeared
    const settingsMenu = await screen.findByRole('menu');
    expect(settingsMenu).toBeInTheDocument();

    // Check if message in the setting menu is welcome guest
    const welcomeGuestText = screen.getByText(/Welcome Guest/i);
    expect(welcomeGuestText).toBeInTheDocument();

    // screen.logTestingPlaygroundURL();
    // Check for the existence of the login button in the setting menu
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();

    // Check for the existence of the register button in the setting menu
    const registerButton = screen.getByText(/Register/i);
    expect(registerButton).toBeInTheDocument();

    // Ensure that there is no logout button
    const logOutbutton = screen.queryByText(/Logout/i);
    expect(logOutbutton).toBeNull();
  });

  /*
  Test case that checks the component that is rendered when the user is logged in (logged in prop is true) which in turn
  should render the home button, hosted listing button Settings button where upon clicking will open a menu with the Logout button in the settings menu and
  a message that says Welcome Username where the username is whatever name it is before the userEmail in the localstorage
  */
  it('render the navbar where the user is not logged in', async () => {
    localStorage.setItem('userEmail', 'TestName@gmail.com');
    render(
    <Router>
       <Navbar loggedIn={true}/>
    </Router>
    );

    // Set the test name in local storage which should be displayed later in the settings menu
    // Check that there is a home button in the navbar
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toBeInTheDocument();

    // Check that there is the settings button
    const settingsButton = screen.getByLabelText(/Open Settings/i);
    expect(settingsButton).toBeInTheDocument();

    // Simulate a click on the settings button to to open the menu
    userEvent.click(settingsButton);

    // Check if the setting menu appeared
    const settingsMenu = await screen.findByRole('menu');
    expect(settingsMenu).toBeInTheDocument();

    /*
    Check if message in the setting menu is welcome [userName] where the username is any text before the '@' in the email that
    is retrieved from the localstorage
    */
    const welcomeUserText = screen.getByText(/Welcome TestName/i);
    expect(welcomeUserText).toBeInTheDocument();

    // screen.logTestingPlaygroundURL();
    // Check for the existence of the logout button in the setting menu
    const logOutButton = screen.getByText(/Logout/i);
    expect(logOutButton).toBeInTheDocument();

    // Ensure that there is no register button
    const registerButton = screen.queryByText(/Register/i);
    expect(registerButton).toBeNull();

    // Ensure that there is no login button
    const loginButton = screen.queryByText(/Login/i);
    expect(loginButton).toBeNull();
    localStorage.removeItem('userEmail');
  });
})
