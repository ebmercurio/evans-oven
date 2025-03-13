/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import TopNav from './TopNav';

test('TopNav renders', async () => {
    render(
        <MemoryRouter>
            <TopNav />
        </MemoryRouter>,
    );

    const topNavLogo = await screen.findByTestId('logoButton');
    expect(topNavLogo).toBeInTheDocument();
});
