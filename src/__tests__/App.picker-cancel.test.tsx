import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { FilterProvider } from '../context/FilterContext';

// vi.hoisted because vi.mock factories are hoisted above top-level bindings.
const { loadFileMock, saveFileMock } = vi.hoisted(() => ({
  loadFileMock: vi.fn(),
  saveFileMock: vi.fn(),
}));

vi.mock('../utils/transaction', async () => {
  const actual = await vi.importActual<typeof import('../utils/transaction')>('../utils/transaction');
  return {
    ...actual,
    loadFile: (...args: unknown[]) => loadFileMock(...args),
    saveFile: (...args: unknown[]) => saveFileMock(...args),
  };
});

import App from '../App';

const renderApp = () =>
  render(
    <I18nProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </I18nProvider>
  );

describe('cancelling the file picker', () => {
  beforeEach(() => {
    loadFileMock.mockReset();
    saveFileMock.mockReset();
    // The tests assert Spanish UI strings; pin the locale so a stray
    // localStorage value can never make the suite order-dependent.
    window.localStorage.setItem('fintracker_locale', 'es');
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it('does not show an error banner when the open dialog is dismissed', async () => {
    loadFileMock.mockRejectedValue(new DOMException('user dismissed', 'AbortError'));
    renderApp();

    fireEvent.click(screen.getByText('Subir movimientos'));

    await waitFor(() => expect(loadFileMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
    expect(screen.queryByText('Error al cargar el archivo')).toBeNull();
  });

  it('does not show an error banner when the save dialog is dismissed', async () => {
    saveFileMock.mockRejectedValue(new DOMException('user dismissed', 'AbortError'));
    renderApp();

    fireEvent.click(screen.getByText('Guardar movimientos'));

    await waitFor(() => expect(saveFileMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
    expect(screen.queryByText('Error al guardar el archivo')).toBeNull();
  });

  it('does not show an error banner when the legacy fallback is cancelled', async () => {
    // The <input type="file"> fallback path rejects with a plain Error.
    loadFileMock.mockRejectedValue(new Error('No file selected.'));
    renderApp();

    fireEvent.click(screen.getByText('Subir movimientos'));

    await waitFor(() => expect(loadFileMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
    expect(screen.queryByText('Error al cargar el archivo')).toBeNull();
  });

  it('still shows the error banner on a real load failure', async () => {
    loadFileMock.mockRejectedValue(new Error('corrupted file'));
    renderApp();

    fireEvent.click(screen.getByText('Subir movimientos'));

    expect(await screen.findByText('Error al cargar el archivo')).toBeTruthy();
  });
});
