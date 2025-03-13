import { screen, render } from '@testing-library/react';
import HomeHero from './homeHero';

test('it should render home hero', () => {
  render(<HomeHero />);

  const homeHero = screen.getByTestId('homeHero');
  expect(homeHero).toBeInTheDocument();
});
