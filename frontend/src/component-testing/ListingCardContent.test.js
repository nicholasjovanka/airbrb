import React from 'react';
import { render, screen } from '@testing-library/react'
import ListingCardContent from '../components/ListingCardContent';

// Fake Listing Object used for testing
const fakeListingObject = {
  title: 'Test Title',
  address: {
    street: 'Test Street',
    city: 'Test City',
    state: 'Test State',
    postcode: 'Test Postcode',
    country: 'Test Country'
  },
  averageRating: 4,
  price: 500,
  reviews: [
    {
      user: 'consumer@gmail.com',
      comment: 'Pretty Nice',
      rating: 4,
      postedOn: '2023-11-16'
    },
    {
      user: 'consumer@gmail.com',
      comment: 'Quite Nice',
      rating: 5,
      postedOn: '2023-11-16'
    },
    {
      user: 'consumer@gmail.com',
      comment: 'What a great place',
      rating: 4,
      postedOn: '2023-11-17'
    },
    {
      user: 'consumer@gmail.com',
      comment: 'Nice place',
      rating: 3,
      postedOn: '2023-11-17'
    },
    {
      user: 'consumer@gmail.com',
      comment: 'Review 1',
      rating: 3,
      postedOn: '2023-11-17'
    },
    {
      user: 'consumer@gmail.com',
      comment: 'Review 1',
      rating: 3,
      postedOn: '2023-11-17'
    }
  ],
  numberOfBeds: 20,
  metadata: {
    bedrooms: [
      {
        type: 'Private',
        beds: 10
      },
      {
        type: 'Private',
        beds: 10
      }
    ],
    amenities: [
      'Gym'
    ],
    type: 'Test Type',
    bathrooms: 10,
  }
}

/*
  Test Case for the ListingCardContent component.
  By default this component will render the information from the listing that is passed as a prop where it will render the listing:
  - Title
  - Type
  - Number of bathrooms
  - Price
  - Address
  - Average Rating
  - Number of reviews

  However the displayPage prop of the component is also responsible for dictating whether the component should display the number of beds
  or number of bedrooms. If the displayPage prop is set to hostedlisting then it will show number of beds, otherwise number of bathroom
*/
describe('ListingCardContent', () => {
  /*
  Test case to check that the component appropriately renders all the listing information, additionaly, also used to test
  where the displayPage prop is not equal to hostedlisting which means that the number of beds should not appear
  */
  it('render the component and ensure that the listing information is rendered and ensure that the number of beds is not rendered', async () => {
    render(<ListingCardContent listing={fakeListingObject} />);

    // Checks if the title rendered
    const listingTitle = screen.getByText(/Test Title/i);
    expect(listingTitle).toBeInTheDocument();

    // Checks if the Listing Type is rendered
    const listingType = screen.getByText(/Test Type/i);
    expect(listingType).toBeInTheDocument();

    // Checks to ensure the number of beds is not rendered
    const numberOfBeds = screen.queryByLabelText(/Number of Beds/i);
    expect(numberOfBeds).toBeNull();

    // Checks to ensure the number of bedroom rendered and the value is correct
    const numberOfBedroom = screen.getByLabelText(/Number of Bedrooms/i);
    expect(numberOfBedroom).toBeInTheDocument();
    const numberOfBedroomText = screen.getByText(/2/i);
    expect(numberOfBedroomText).toBeInTheDocument();

    // Checks if the number of bathroom is rendered
    const numberOfBathroom = screen.getByText(/^10/i);
    expect(numberOfBathroom).toBeInTheDocument();

    // Checks if the listing price is rendered
    const listingPrice = screen.getByText(/500 AUD\/Night/i);
    expect(listingPrice).toBeInTheDocument();

    // Checks if the Address i rendered
    const listingAddress = screen.getByText(/Test Street, Test City, Test State Test Postcode, Test Country/i);
    expect(listingAddress).toBeInTheDocument();

    /*
    See if the Mui Rating component (The Rating Star image) is currenty displaying the average rating which should be in the
    MUI rating component aria label
    */
    const averageRating = screen.getByRole('img', { name: /4 Stars/i });
    expect(averageRating).toBeInTheDocument();

    // Check if the number of reviews is rendered
    const numberOfReviews = screen.getByText(/Test Street, Test City, Test State Test Postcode, Test Country/i);
    expect(numberOfReviews).toBeInTheDocument();
  });

  /*
  Test case to check the component where the displayPage prop is hostedlisting which in this case should
  render the number of beds instead of number of bedroom. Also check when the listings object that is passed
  have 0 reviews
  */
  it('render the component with displayPage prop as hostedlisting and listing object with no reviews', async () => {
    const modifiedListingObject = {
      ...fakeListingObject,
      reviews: []
    }
    render(<ListingCardContent listing={modifiedListingObject} displayPage='hostedlisting' />);

    // Checks to ensure the number of bedroom is not rendered
    const numberOfBedroom = screen.queryByLabelText(/Number of Bedrooms/i);
    expect(numberOfBedroom).toBeNull();

    // Checks to ensure the number of beds is rendered and the value it render is correct
    const numberOfBeds = screen.getByLabelText(/Number of Beds/i);
    expect(numberOfBeds).toBeInTheDocument();
    const numberOfBedsText = screen.getByText(/20/i);
    expect(numberOfBedsText).toBeInTheDocument();

    // Check to ensure that if there is no review that the component will display the no review text
    const noReviewText = screen.getByText(/No Reviews/i);
    expect(noReviewText).toBeInTheDocument();
  });
})
