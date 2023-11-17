import React from 'react';
import { render, screen } from '@testing-library/react'
import MessageModal from '../components/MessageModal';

// Test Case for the MessageModal component
describe('MessageModal', () => {
  // Test case for opening the message modal
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    render(<MessageModal open={true}/>);

    // Checks if the modal appear on screen
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    // Check if the close icon button is rendered in the message modal
    const closeIconButton = screen.getByRole('button', { name: /close-modal-icon-button/i });
    expect(closeIconButton).toBeInTheDocument();
    // Check if the bottom close button is rendered in the message modal
    const closeButton = screen.getByRole('button', { name: /close-modal-button/i });
    expect(closeButton).toBeInTheDocument();
  });

  // Test case for modifying the Message Modal header and content
  it('Render the Appropriate Title and Message based on the header and content prop that is passed', async () => {
    render(<MessageModal header={'Test Title'} content={'Modal Content Testing'} open={true} />);

    // Wait for the dialog to appear on screen first
    await screen.findByRole('dialog');

    // Check if the Message Modal Title is currently displaying the text passed through the header prop
    const modalHeaderText = screen.getByLabelText(/Test Title/i);
    expect(modalHeaderText).toBeInTheDocument();

    // Check if the Message Modal Body/Content is currently displaying the text passed through the content prop
    const modalContentText = screen.getByText(/Modal Content Testing/i);
    expect(modalContentText).toBeInTheDocument();
  });
})
