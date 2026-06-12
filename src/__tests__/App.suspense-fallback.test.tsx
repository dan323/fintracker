import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { FilterProvider } from '../context/FilterContext';

vi.mock('../utils/transaction', async () => {
  const actual = await vi.importActual<typeof import('../utils/transaction')>('../utils/transaction');
  return {
    ...actual,
    loadFile: vi.fn(() => Promise.resolve([])),
    saveFile: vi.fn(() => Promise.resolve()),
  };
});

import App from '../App';

describe('Suspense loading fallbacks', () => {
  beforeEach(() => {
    // The tests assert Spanish UI strings; pin the locale so a stray
    // localStorage value can never make the suite order-dependent.
    window.localStorage.setItem('fintracker_locale', 'es');
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it.each([
    ['chart', 'Ingresos y Gastos en el tiempo'],
    ['pie', 'Ingresos y Gastos por categorías/cuentas'],
    ['carbon', 'Huella de carbono'],
  ])('shows the translated loading text without a literal $ on the %s tab', (_tab, label) => {
    render(
      <I18nProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </I18nProvider>
    );

    fireEvent.click(screen.getByText(label));

    // The lazy chunk has not resolved yet at this point, so the fallback is
    // on screen. It must be the plain translation, not "$Cargando..." —
    // the JSX previously contained a stray template-string dollar sign.
    expect(screen.getByText('Cargando...')).toBeTruthy();
    expect(screen.queryByText(/\$\s*Cargando/)).toBeNull();
  });
});
