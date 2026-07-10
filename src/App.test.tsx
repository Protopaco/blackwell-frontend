import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '@/App';
import renderWithProviders from '@/test/renderWithProviders';
import mockClients from '@/test/fixtures/clients';
import { clientApi } from '@/api/client';

vi.mock('@/api/client', () => ({
  clientApi: {
    v1GetClients: vi.fn(),
  },
}));

test('renders the landing page when no client is selected', async () => {
  vi.mocked(clientApi.v1GetClients).mockResolvedValue(mockClients);

  renderWithProviders(<App />);

  expect(await screen.findByText('Welcome')).toBeInTheDocument();
});
