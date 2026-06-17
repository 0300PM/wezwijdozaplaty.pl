import { useState, useMemo } from 'react';

const obligationTypes = [
  'Niezapłacona faktura VAT',
  'Czynsz najmu',
  'Opłaty eksploatacyjne',
  'Wynagrodzenie za wykonane zlecenie',
  'Umowa o dzieło',
  'Sprzedaż towaru',
  'Dostawa usług',
  'Pożyczka prywatna',
  'Umowa najmu lokalu',
  'Szkoda majątkowa',
  'Kara umowna',
  'Zaliczka / zadatek',
  'Inne'
];

const initialState = {
  creditorName: '',
  creditorAddress: '',
  debtorName: '',
  debtorAddress: '',
  obligationType: 'Niezapłacona faktura VAT',
  documentNumber: '',
  amount: '',
  documentDate: '',
  dueDate: '',
  bankAccount: '',
  city: '',
  isFinal: false,
  interest: false,
  capitalization: false,
  collectionCosts: false,
  registryWarning: false,
  joint: false
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

function formatCurrency(amount) {
  const n = Number(amount);
  if (isNaN(n)) return amount;
  return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Generator() {
  const [form, setForm] = useState(initialState);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDownload = async (format) => {
    setError('');
    setInfo('');

    if (!form.creditorName || !form.debtorName || !form.amount) {
      setError('Uzupełnij wymagane pola: wierzyciel, dłużnik oraz kwotę.');
      return;
    }

    const url = `/api/generate/${format}`;
    const setter = format === 'pdf' ? setLoadingPdf : setLoadingDocx;
    setter(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Błąd generowania dokumentu.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `wezwanie-do-zaplaty.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setInfo('Dokument został pobrany pomyślnie.');
    } catch (err) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setter(false);
    }
  };

  const preview = useMemo(() => {
    const title = form.isFinal ? 'OSTATECZNE PRZEDSĄDOWE WEZWANIE DO ZAPŁATY' : 'WEZWANIE DO ZAPŁATY';
    const currentDate = new Date().toLocaleDateString('pl-PL');
    const amount = formatCurrency(form.amount);

    return (
      <div className="preview-document">
        <h2>{title}</h2>
        <p style={{ textAlign: 'right' }}>{form.city ? `${form.city}, ` : ''}{currentDate}</p>

        <div className="field">
          <strong>Wierzyciel:</strong>
          {form.creditorName && <div>{form.creditorName}</div>}
          {form.creditorAddress && <div style={{ whiteSpace: 'pre-line' }}>{form.creditorAddress}</div>}
        </div>

        <div className="field">
          <strong>Dłużnik:</strong>
          {form.debtorName && <div>{form.debtorName}</div>}
          {form.debtorAddress && <div style={{ whiteSpace: 'pre-line' }}>{form.debtorAddress}</div>}
        </div>

        <div className="field">
          <strong>Przedmiot zobowiązania:</strong>
          <div>
            W związku z zaległym zobowiązaniem wynikającym z rodzaju: {form.obligationType}
            {form.documentNumber ? `, dokument nr ${form.documentNumber}` : ''}
            {form.documentDate ? ` z dnia ${formatDate(form.documentDate)}` : ''}, dłużnik zobowiązany jest 
            do zapłaty na rzecz wierzyciela kwoty <strong>{amount} PLN</strong>.
          </div>
        </div>

        <div className="field">
          <strong>Szczegóły płatności:</strong>
          <div>
            Termin płatności upłynął {formatDate(form.dueDate)}. Kwotę należną w wysokości {amount} PLN należy 
            uiścić na rachunek bankowy: {form.bankAccount || '(brak numeru konta)'}.
          </div>
        </div>

        {form.interest && (
          <div className="field">
            <strong>Odsetki ustawowe za opóźnienie</strong>
            <div>W przypadku braku zapłaty w terminie, zastrzegamy sobie prawo do naliczenia odsetek ustawowych za opóźnienie w spłacie zgodnie z obowiązującymi przepisami prawa.</div>
          </div>
        )}

        {form.capitalization && (
          <div className="field">
            <strong>Kapitalizacja odsetek</strong>
            <div>Zastrzegamy sobie prawo do żądania kapitalizacji odsetek, tj. naliczania odsetek od zaległych odsetek w przypadku dalszego zwlekania z zapłatą.</div>
          </div>
        )}

        {form.collectionCosts && (
          <div className="field">
            <strong>Koszty windykacji</strong>
            <div>W przypadku konieczności podjęcia działań windykacyjnych, wierzyciel będzie uprawniony do dochodzenia od dłużnika zwrotu uzasadnionych kosztów windykacji.</div>
          </div>
        )}

        {form.registryWarning && (
          <div className="field">
            <strong>Ostrzeżenie o wpisie do rejestru dłużników</strong>
            <div>W przypadku braku zapłaty w wyznaczonym terminie, wierzyciel rozważy zgłoszenie dłużnika do narodowych i międzynarodowych rejestrów dłużników (BIG, KRD, ERIF), co może wpłynąć na zdolność kredytową i wizerunek dłużnika.</div>
          </div>
        )}

        {form.joint && (
          <div className="field">
            <strong>Wezwanie solidarne</strong>
            <div>Niniejsze wezwanie skierowane jest do dłużników solidarnych, zaś zapłata całości lub części zobowiązania przez jednego z dłużników zwalnia pozostałych w zakresie spełnienia świadczenia.</div>
          </div>
        )}

        <div className="field">
          <strong>Wezwanie i termin zapłaty</strong>
          <div>Zwracam się z wezwaniem do zapłaty powyższej kwoty w terminie 7 dni od dnia otrzymania niniejszego pisma. Po bezskutecznym upływie tego terminu zastrzegam sobie prawo do skierowania sprawy na drogę sądową lub do profesjonalnej windykacji, bez konieczności wydawania dodatkowych wezwań.</div>
        </div>

        <div className="field" style={{ marginTop: '2rem' }}>
          <div>Z poważaniem,</div>
          <div>{form.creditorName || '(podpis wierzyciela)'}</div>
        </div>
      </div>
    );
  }, [form]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Generator wezwania do zapłaty</h1>
        <p className="section-subtitle">
          Wypełnij poniższy formularz, a następnie pobierz gotowe wezwanie do zapłaty w wybranym formacie. 
          Podgląd aktualizuje się automatycznie.
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {info && <div className="alert alert-info">{info}</div>}

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="form-section">
              <div className="form-section-title">Dane wierzyciela</div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Pełna nazwa / Imię i nazwisko <span className="required">*</span></label>
                  <input
                    type="text"
                    name="creditorName"
                    value={form.creditorName}
                    onChange={handleChange}
                    placeholder="Np. Firma Sp. z o.o. lub Jan Kowalski"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Adres</label>
                  <textarea
                    name="creditorAddress"
                    value={form.creditorAddress}
                    onChange={handleChange}
                    placeholder="Ulica, kod pocztowy, miasto"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Dane dłużnika</div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Pełna nazwa / Imię i nazwisko <span className="required">*</span></label>
                  <input
                    type="text"
                    name="debtorName"
                    value={form.debtorName}
                    onChange={handleChange}
                    placeholder="Np. Przedsiębiorstwo XYZ Sp. z o.o. lub Anna Nowak"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Adres</label>
                  <textarea
                    name="debtorAddress"
                    value={form.debtorAddress}
                    onChange={handleChange}
                    placeholder="Ulica, kod pocztowy, miasto"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Szczegóły zobowiązania</div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Rodzaj zobowiązania</label>
                  <select name="obligationType" value={form.obligationType} onChange={handleChange}>
                    {obligationTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Numer dokumentu</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={form.documentNumber}
                    onChange={handleChange}
                    placeholder="Np. FV/2024/06/123"
                  />
                </div>
                <div className="form-group">
                  <label>Kwota (PLN) <span className="required">*</span></label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data dokumentu</label>
                  <input
                    type="date"
                    name="documentDate"
                    value={form.documentDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Termin płatności</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Dane do płatności</div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Numer konta bankowego</label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={form.bankAccount}
                    onChange={handleChange}
                    placeholder="XX XXXX XXXX XXXX XXXX XXXX XXXX"
                  />
                </div>
                <div className="form-group">
                  <label>Miasto wystawienia</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Np. Warszawa"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Opcje dodatkowe</div>
              <div className="checkbox-grid">
                <label className="checkbox-card">
                  <input type="checkbox" name="isFinal" checked={form.isFinal} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Ostateczne przedsądowe wezwanie do zapłaty</span>
                    <span className="checkbox-desc">Zwiększa formalną wagę dokumentu.</span>
                  </span>
                </label>

                <label className="checkbox-card">
                  <input type="checkbox" name="interest" checked={form.interest} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Nalicz odsetki ustawowe za opóźnienie</span>
                    <span className="checkbox-desc">Klauzula o odsetkach ustawowych.</span>
                  </span>
                </label>

                <label className="checkbox-card">
                  <input type="checkbox" name="capitalization" checked={form.capitalization} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Kapitalizacja odsetek</span>
                    <span className="checkbox-desc">Odsetki od zaległych odsetek.</span>
                  </span>
                </label>

                <label className="checkbox-card">
                  <input type="checkbox" name="collectionCosts" checked={form.collectionCosts} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Dołącz informację o kosztach windykacji</span>
                    <span className="checkbox-desc">Możliwość dochodzenia kosztów.</span>
                  </span>
                </label>

                <label className="checkbox-card">
                  <input type="checkbox" name="registryWarning" checked={form.registryWarning} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Dodaj ostrzeżenie o wpisie do rejestru dłużników</span>
                    <span className="checkbox-desc">Uprzedź o wpisie do BIG.</span>
                  </span>
                </label>

                <label className="checkbox-card">
                  <input type="checkbox" name="joint" checked={form.joint} onChange={handleChange} />
                  <span className="checkbox-text">
                    <span className="checkbox-title">Wezwanie solidarne</span>
                    <span className="checkbox-desc">Dla wielu dłużników solidarnych.</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-title">Podgląd dokumentu</div>
            {preview}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn"
                onClick={() => handleDownload('pdf')}
                disabled={loadingPdf || loadingDocx}
              >
                {loadingPdf ? <span className="spinner" /> : 'Pobierz PDF'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleDownload('docx')}
                disabled={loadingPdf || loadingDocx}
              >
                {loadingDocx ? <span className="spinner" /> : 'Pobierz DOCX'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generator;
