import { render } from '@testing-library/react';
import App from './App';

test('renders App component without crashing', () => {
  render(<App />);
  // This basic test just ensures the component renders without throwing
});