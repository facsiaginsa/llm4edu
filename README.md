# LLM4Edu
Academic Writing Assistance

## Requirement
- Windows / MacOS Operating System (the Office development kit doesn't support linux)
- NodeJS v20.16.0 or later
- NPM v10.8.1 or later
- Microsoft Word

## How to start the backend

Backend is already running in our VM. just run the office add-in with given env

## How to start the office-addin

Install all dependencies
```bash
cd office-addin
npm install
```

Create  `.env` file from `.env.example`
```bash
cp .env.example .env
```

Run the addin
```bash
npm run dev-server 
# Wait until webpack compiled successfully, and then exit
npm start
```
The word application will opened automatically