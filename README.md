<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Deposition Transcript Mapper

An AI-powered tool to upload deposition or e-Discovery transcripts (PDF/TXT) and automatically extract key facts, admissions, exhibits, and objections into a structured, downloadable format.

View your app in AI Studio: https://ai.studio/apps/drive/1P8wfUwMkTMAxInH-JOueBxAQtff1aX1g

## Features

- **Smart File Upload**: Drag-and-drop or browse to upload PDF or TXT files (up to 50MB)
- **AI-Powered Analysis**: Uses Google's Gemini 2.5 Pro to extract structured information
- **Comprehensive Extraction**:
  - Key facts and admissions with witness attribution
  - Exhibits referenced with descriptions
  - Objections log with rulings
- **Multiple Export Formats**: Download results as JSON or CSV
- **Copy to Clipboard**: Quick sharing of analysis results
- **Accessibility First**: ARIA labels and keyboard navigation support
- **File Size Validation**: Automatic validation with helpful error messages

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your API key:
   - Get your Gemini API key from https://aistudio.google.com/app/apikey
   - Open `.env.local` and replace `your_api_key_here` with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
AIDepositionPro/
├── src/
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── index.html          # Entry HTML file
```

## Build for Production

```bash
npm run build
npm run preview
```
