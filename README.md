# RoleLens

RoleLens compares a job description with a candidate profile and explains the
evidence behind the comparison without assigning a numerical candidate score.

## Local development

```bash
npm install
npm run dev
```

Create a local `.env.local` file before using the server-side analysis endpoint:

```bash
GEMINI_API_KEY=your_api_key
```

Environment files are ignored by Git. The API key is read only by the server route.

Open [http://localhost:3000](http://localhost:3000) in a browser.

Product requirements and scope are documented in [docs/PACKET.md](docs/PACKET.md).
