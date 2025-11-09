# OpenMotion: Free, Dev-Friendly Motion-Style Planner

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TheMagicMike/openmotion-clone)

**OpenMotion** is an open-source, personal-use clone inspired by Motion.app's workflow. Deployable on Netlify with a single click after pushing to GitHub.

## Features

- **ChatGPT-powered Quick Add**: Parse tags, duration, priority, due dates from natural language
- **Greedy auto-scheduler**: Smart scheduling with buffers, tag windows, and anchors
- **.ics export/import**: Seamless integration with Google/Apple Calendar
- **Single-user profile**: Optimized for Europe/London timezone, 5-9am deep work, daily gym & incline walk

*This is not affiliated with Motion. It's an open, personal-use clone inspired by the workflow.*

## Quick Start

### 1. Local Development

```bash
npm install
npm run dev
```

### 2. Deploy to Netlify

1. Create a GitHub repo and push these files
2. In Netlify: **New site** → **Import from Git** → select your repo
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (required for AI Quick Add)
5. Click **Deploy**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### 3. Using the App

1. **Quick Add**: Type a natural task, e.g.:
   ```
   Write MMFit blog content #content 60m by Thu 5pm !2
   ```
   The Netlify Function calls ChatGPT to extract JSON:
   ```json
   {
     "title": "Write MMFit blog",
     "tags": ["content"],
     "minutes": 60,
     "priority": 2,
     "due": "2025-11-13T17:00:00Z"
   }
   ```

2. **Export Calendar**: Click **Export .ics**, then import the file into Google Calendar

### 4. Customizing Rules

Edit `defaultProfile` in `src/App.tsx` to customize:
- Working hours
- Deep work windows
- Task priorities
- Time zone settings

## Project Structure

```
openmotion-clone/
├── src/
│   ├── App.tsx           # Main application logic
│   ├── main.tsx          # Entry point
│   └── ... (other React components)
├── netlify/
│   └── functions/        # Serverless functions for AI parsing
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── netlify.toml          # Netlify configuration
├── index.html            # HTML template
└── README.md             # This file
```

## Roadmap: Parity Goals

- [ ] Google/O365 Calendar OAuth write-back via Netlify Functions
- [ ] Live re-plan on calendar webhooks
- [ ] 1-2 domain assistants: buttons that generate domain-specific tasks
- [ ] Timeline: drag-to-resize and snooze
- [ ] Weekly quotas & review dashboard

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build**: Vite 5.4.0
- **Styling**: Inline CSS with custom design system
- **Calendar**: Day.js 1.11.11 for date manipulation
- **Icons**: Lucide React 0.460.0
- **AI**: OpenAI API (ChatGPT) via Netlify Functions
- **Deployment**: Netlify with serverless functions

## Requirements

- Node.js 18+
- npm or yarn
- OpenAI API key (for AI Quick Add feature)

## Contributing

This is a personal-use project. Feel free to fork and customize for your own needs!

## License

MIT License - feel free to use and modify for personal use.

---

**Note**: Remember to add your `OPENAI_API_KEY` as an environment variable in Netlify for the AI Quick Add feature to work.
