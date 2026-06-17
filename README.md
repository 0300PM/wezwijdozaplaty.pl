# Wezwij do Zapłaty

Darmowa aplikacja webowa do generowania wezwań do zapłaty w formacie **PDF** i **DOCX**. 
Projekt składa się z frontendu w **React + Vite** oraz backendu w **Node.js + Express**.

## Funkcje

- Darmowy generator wezwań do zapłaty (bez rejestracji, bez bazy danych)
- Podgląd dokumentu na żywo
- Pobieranie w formacie PDF i DOCX
- Wiele rodzajów zobowiązań do wyboru
- Opcje dodatkowe: odsetki ustawowe, kapitalizacja, koszty windykacji, BIG, wezwanie solidarne, wezwanie ostateczne przedsądowe
- Sekcje: O nas, FAQ, RODO, Polityka prywatności, Regulamin, Terms of Service
- Blog z 5 artykułami SEO

## Wymagania

- Node.js w wersji 18 lub nowszej
- npm

## Instalacja i uruchomienie

> **Ważne:** Po pobraniu projektu należy zainstalować zależności. Bez tego backend i frontend nie wstaną.

```bash
# 1. Zainstaluj wszystkie zależności
npm run install:all

# 2. Uruchom backend i frontend jednocześnie
npm run dev
```

Jeśli `npm run install:all` nie działa, zainstaluj ręcznie:

```bash
cd /home/user/wezwij-do-zaplaty
npm install
cd backend && npm install
cd ../frontend && npm install
```

Po uruchomieniu:
- Frontend dostępny pod adresem: http://localhost:5173
- Backend dostępny pod adresem: http://localhost:3001
- Vite automatycznie przekierowuje żądania `/api` do backendu na porcie 3001

## Struktura projektu

```
wezwij-do-zaplaty/
├── backend/          # Node.js + Express + pdfmake + docx
│   ├── server.js
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
└── package.json
```

## Endpointy API

- `POST /api/generate/pdf` — generuje wezwanie do zapłaty w formacie PDF
- `POST /api/generate/docx` — generuje wezwanie do zapłaty w formacie DOCX
- `GET /api/health` — sprawdzenie statusu backendu

## Wersja produkcyjna

W środowisku produkcyjnym backend automatycznie serwuje zbudowane pliki frontendu z katalogu `frontend/dist`. 
Aby uruchomić produkcyjnie:

```bash
npm run build
npm start
```

## SEO i dostępność

- Opisy meta na stronie głównej
- Przyjazne adresy URL (`/generator`, `/o-nas`, `/blog`, `/faq`, `/regulamin`, `/rodo`)
- Przejrzysty, responsywny interfejs
- Teksty zoptymalizowane pod wyszukiwarki

## Rozwiązywanie problemów

### Generowanie nie działa / strona się nie ładuje

Sprawdź, czy zainstalowałeś wszystkie zależności:

```bash
cd /home/user/wezwij-do-zaplaty
npm run install:all
```

Następnie upewnij się, że porty 3001 (backend) i 5173 (frontend) są wolne, a potem uruchom:

```bash
npm run dev
```

### Błąd `EADDRINUSE` - port zajęty

```bash
fuser -k 3001/tcp
fuser -k 5173/tcp
npm run dev
```

## Uwagi prawne

Treści generowane przez aplikację mają charakter informacyjny i nie stanowią indywidualnej porady prawnej. 
W przypadku wątpliwości lub skomplikowanych spraw zaleca się konsultację z prawnikiem.
