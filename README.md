# LLM4Edu
Academic Writing Assistance

## Requirement
- Windows / MacOS Operating System (the Office development kit doesn't support linux)
- NodeJS v20.16.0 or later
- NPM v10.8.1 or later
- Microsoft Word

## How to start the backend

```bash
cd backend
npm install
node index.js
```

## How to start the office-addin

Install all dependencies
```bash
cd llm4edu
npm install
```

Create  `.env` file from `.env.example`
```bash
cp .env.example .env
```
And then fill the env according to your situation

Run the addin
```bash
npm run dev-server 
# Exit after webpack compiled successfully
npm start
```
The word application will opened automatically