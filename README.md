# Propertist Frontend

React + TypeScript + Vite frontend for the Property Listing API.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The dev server proxies `/v1` to `http://localhost:5000`. Start the backend first:

```bash
cd ../backend
npm run dev
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Property listings with search & filters |
| `/properties/:id` | Property detail + enquiry form |
| `/login` | Login |
| `/register` | Sign up (agent or home seeker) |
| `/add-property` | Agent: create listing |
| `/properties/:id/edit` | Agent: edit own listing |
| `/my-properties` | Agent: manage own listings |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
