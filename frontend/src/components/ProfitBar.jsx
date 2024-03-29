import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { apiCall, getLuxonDayDifference } from '../utils/utils';
import { DateTime } from 'luxon';

/*
Component that is used to render a BarChart containing a specific user profit from all
their listings in the past 30 days

Props Explanation;
- listingIds: Array containing the id of listings that is owned by the user, used to filter out bookings tied to that listing
*/
const ProfitBar = ({ listingIds }) => {
  const [profits, setProfits] = useState(Array(31).fill(0));
  const daysArray = [...Array(31).keys()];

  /*
  useEffect used to get filter out all the bookings whose id is in the listingIds passed in the prop whose status is accepted,
  Then aggregate the booking profit for each day in the past 30 days (0 - 30 days).
  After getting all the profit for each day in the past 30 days, set it to the profits state variable to render the profit to the bar chart
  */
  useEffect(() => {
    const getBookings = async () => {
      const bookings = await apiCall('bookings', 'GET');
      const bookingsWithProfit = bookings.data.bookings.filter((booking) => (listingIds.includes(Number(booking.listingId)) && booking.status === 'accepted'));
      const currentDate = DateTime.now().startOf('day');
      const profitsArray = Array(31).fill(0);
      for (let i = 0; i < daysArray.length; i++) {
        const dateToCheck = currentDate.minus({ days: daysArray[i] });
        for (let x = 0; x < bookingsWithProfit.length; x++) {
          const bookingStartDate = DateTime.fromSQL(bookingsWithProfit[x].dateRange.startDate);
          const bookingEndDate = DateTime.fromSQL(bookingsWithProfit[x].dateRange.endDate);
          if (getLuxonDayDifference(bookingStartDate, dateToCheck) >= 0 && getLuxonDayDifference(dateToCheck, bookingEndDate) >= 0) {
            const pricePerDay = bookingsWithProfit[x].totalPrice / getLuxonDayDifference(bookingStartDate, bookingEndDate);
            profitsArray[daysArray[i]] += pricePerDay
          }
        }
      }
      setProfits(profitsArray);
    }
    getBookings();
  }, [listingIds]);

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: daysArray, label: 'Amount of days ago' }]}
      series={[{ data: profits }]}
      width={900}
      height={400}
      yAxis={[{ label: 'Profit in AUD' }]}
      sx={{
        'g g.MuiChartsAxis-label:nth-of-type(6)': {
          transform: 'translate(-10px,0)'
        },
      }}
    />
  );
}

export default ProfitBar;
