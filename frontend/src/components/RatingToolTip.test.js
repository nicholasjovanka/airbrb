import React from 'react';
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RatingTooltip from './RatingTooltip';
import { Button } from '@mui/material';

// Test Case for the RatingToolTip component
describe('RatingToolTip', () => {
  /*
  Have to put a box inside the Tooltip component as the material ui tooltip component require a child where if we hover on the child
  then the tooltip will appear
  */
  const ToolTipComponent = ({ passedListing, openRatingModalFunction }) => (
    <RatingTooltip passedListing={passedListing}>
      <Button>
        Tool Tip Test
      </Button>
    </RatingTooltip>
  );
  it('render the tooltip when user hover on the Test Button', async () => {
    const fakeListingObject = {
      averageRating: 4,
      reviews: [],
      title: 'Listing A'
    }
    render(<ToolTipComponent passedListing={fakeListingObject}/>);
    // Simulate Hover on the button to bring the tooltip out
    userEvent.hover(screen.getByRole('button', { name: /tool tip test/i }));
    const tip = await screen.findByRole('tooltip');
    // Checks if the tooltip appear
    expect(tip).toBeInTheDocument();
  });

  it('render the "no reviews found" text on the tooltip if the reviews list is empty', async () => {
    const fakeListingObject = {
      averageRating: 4,
      reviews: [],
      title: 'Listing A'
    }
    render(<ToolTipComponent passedListing={fakeListingObject}/>);
    // Simulate Hover on the button to bring the tooltip out
    userEvent.hover(screen.getByRole('button', { name: /tool tip test/i }));
    await screen.findByRole('tooltip');

    // Checks if the No Reviews Found message is displayed in the tooltip
    const typography = screen.getByLabelText(/No Reviews Found/i);
    expect(typography).toBeInTheDocument();
  });

  it('render the Average rating, percentage of each rating category and it absolute term based on the passed reviews array inside the fake listing object', async () => {
    const fakeListingObject = {
      averageRating: 4.8,
      reviews: [
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 5,
        },
        {
          rating: 4,
        },
        {
          rating: 4,
        }
      ],
      title: 'Listing A'
    }
    render(<ToolTipComponent passedListing={fakeListingObject}/>);
    userEvent.hover(screen.getByRole('button', { name: /tool tip test/i }));
    await screen.findByRole('tooltip');

    /*
    See if the Mui Rating component (The Rating Star image) is currenty
    displaying itself as 5 stars (this is this way since MUI will round the ratings inputted to its component
    so in this case since the average rating that is passed is 4.8 its gonna round it into 5 and have an aria-label attribute of 5 stars on its span)
    */
    const MUIRatingComponent = screen.getByRole('img', { name: /5 Stars/i });
    expect(MUIRatingComponent).toBeInTheDocument();

    const averageRatingText = screen.getByLabelText(/4.8 out of 5/i);
    expect(averageRatingText).toBeInTheDocument(); // See if the averageRating is displayed in the tooltip
    // Check if rating whose value is 5 is displayed as 80% with 8 ratings and rating whose value is 4 is displayed 20% with 2 ratings
    const fiveStarRatingsPercentageText = screen.getByLabelText(/80%/i);
    const fiveStarRatingsAbsoluteTermText = screen.getByLabelText(/8 reviews/i);
    expect(fiveStarRatingsPercentageText).toBeInTheDocument();
    expect(fiveStarRatingsAbsoluteTermText).toBeInTheDocument();
    const fourStarRatingsPercentageText = screen.getByLabelText(/20%/i);
    const fourStarRatingsAbsoluteTermText = screen.getByLabelText(/2 reviews/i);
    expect(fourStarRatingsPercentageText).toBeInTheDocument();
    expect(fourStarRatingsAbsoluteTermText).toBeInTheDocument();
  })
})
