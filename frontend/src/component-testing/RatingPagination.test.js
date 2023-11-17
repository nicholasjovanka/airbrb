import React from 'react';
import { render, screen } from '@testing-library/react'
import RatingPagination from '../components/RatingPagination';

const fakeRatings = [ // Fake Rating Array used for testing
  {
    user: 'email1@testmail.com',
    comment: 'Review 1',
    rating: 5,
    postedOn: '2023-11-01'
  },
  {
    user: 'email2@testmail.com',
    comment: 'Review 2',
    rating: 4,
    postedOn: '2023-11-02'
  }
]

// Test Case for the Rating Pagination Component
describe('RatingPagination', () => {
  /*
  Test to ensure that the ratings passed to the component is properly rendered by the RatingPagination component, and since the
  there is only 6 ratings that is passed, there should only be 1 page. Also check for cases where if the rating has no comment then
  display the no comment text for that review
  */
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    render(<RatingPagination ratingArray={fakeRatings}/>);
    // Check that all the data is properly rendered by the pagination
    const firstDataConsumerName = screen.getByText(/email1@testmail.com/i);
    expect(firstDataConsumerName).toBeInTheDocument();

    const firstDataComment = screen.getByText(/Review 1/i);
    expect(firstDataComment).toBeInTheDocument();

    const firstDataRating = screen.getByRole('img', { name: /5 Stars/i });
    expect(firstDataRating).toBeInTheDocument();

    const firstDataPostDate = screen.getByText(/01\/11\/2023/i);
    expect(firstDataPostDate).toBeInTheDocument();

    const secondDataConsumerName = screen.getByText(/email2@testmail.com/i);
    expect(secondDataConsumerName).toBeInTheDocument();

    const secondDataComment = screen.getByText(/Review 2/i);
    expect(secondDataComment).toBeInTheDocument();

    const secondDataRating = screen.getByRole('img', { name: /4 Stars/i });
    expect(secondDataRating).toBeInTheDocument();

    const secondDataPostDate = screen.getByText(/02\/11\/2023/i);
    expect(secondDataPostDate).toBeInTheDocument();

    // ensure That there is only one page by checking the existence of the page 1 button and confirming that there is no page 2 button

    const firstPageButton = screen.getByRole('button', { name: /page 1/i });
    expect(firstPageButton).toBeInTheDocument();

    const secondPageButton = screen.queryByRole('button', { name: /page 2/i });
    expect(secondPageButton).toBeNull();
  });

  /*
  Test where the rating array that is supplied to the component has more than 6 data as the RatingPagination component paginates
  every 6 data which means that if there is 13 data supplied there should be 3 pages
  */
  it('Render the message modal on screen when its open prop is set to true along with its close icon button and close button', async () => {
    const threePageFakingRatingData = [
      {
        user: 'email1@testmail.com',
        comment: 'Review 1',
        rating: 5,
        postedOn: '2023-11-01'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
      {
        user: 'email2@testmail.com',
        comment: 'Review 2',
        rating: 4,
        postedOn: '2023-11-02'
      },
    ]
    render(<RatingPagination ratingArray={threePageFakingRatingData}/>);

    // Ensure that there is 3 pages
    const firstPageButton = screen.getByRole('button', { name: /page 1/i });
    expect(firstPageButton).toBeInTheDocument();

    const secondPageButton = screen.getByRole('button', { name: /page 2/i });
    expect(secondPageButton).toBeInTheDocument();

    const thirdPageButton = screen.getByRole('button', { name: /page 3/i });
    expect(thirdPageButton).toBeInTheDocument();

    // Ensure that there is no fourth page
    const fourthPageButton = screen.queryByRole('button', { name: /page 4/i });
    expect(fourthPageButton).toBeNull();
  });
})
