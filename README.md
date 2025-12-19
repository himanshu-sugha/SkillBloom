# 🌱 SkillBloom - AI-Powered Micro-Learning That Grows With You

> Plant your learning seeds today, harvest knowledge tomorrow.

---

## 1. What is SkillBloom?

SkillBloom is an **AI-powered micro-learning platform** that:

1. **Generates personalized lessons** using Mistral AI in just 5 minutes
2. **Visualizes progress** as a beautiful 3D garden with growing plants
3. **Gamifies learning** with XP, streaks, and achievement badges
4. **Tracks daily goals** that reset and adapt each day
5. **Creates quizzes** to reinforce what you've learned

---

## 2. Problem Statement

Traditional learning platforms fail to keep users engaged:

| Problem | Impact |
|---------|--------|
| **Overwhelming content** | Users feel paralyzed by long courses |
| **No visual progress** | Hard to see how far you've come |
| **Generic lessons** | One-size-fits-all doesn't work |
| **Easy to abandon** | No motivation to return daily |
| **Boring interfaces** | Learning feels like a chore |

**The Cost:**
- 90% of online learners never finish their courses
- Average attention span is now just 8 seconds
- Users need dopamine hits to stay engaged

**SkillBloom solves this** with 5-minute AI lessons, gamified progress, and a visual garden metaphor that makes learning feel like nurturing something beautiful.

---

## 3. Features & Implementation

| Feature | How It Works | Location |
|---------|--------------|----------|
| **3D Garden** | Three.js visualization with growing plants | `src/components/Garden3D.tsx` |
| **AI Lessons** | Mistral AI generates personalized content | `src/lib/mistral.ts` |
| **Daily Goals** | Clickable goals that persist with localStorage | `src/app/garden/page.tsx` |
| **Quiz System** | AI-generated questions from lesson content | `src/app/api/generate-quiz/` |
| **Confetti** | Celebration effects on lesson completion | `src/lib/confetti.ts` |
| **Add Skills** | Modal to plant new skills in your garden | `src/app/garden/page.tsx` |

---

## 4. How It Works (User Flow)

```
+-------------------------------------------------------------+
|  1. ONBOARD                                                 |
|  --> Choose your skill, set daily time goal (5/10/15 min)   |
+-------------------------------------------------------------+
|  2. PLANT YOUR SEED                                         |
|  --> Your skill appears as a seed in your 3D garden         |
+-------------------------------------------------------------+
|  3. LEARN DAILY                                             |
|  --> AI generates personalized 5-min micro-lessons          |
+-------------------------------------------------------------+
|  4. COMPLETE QUIZZES                                        |
|  --> Answer questions to reinforce learning                 |
+-------------------------------------------------------------+
|  5. WATCH IT GROW                                           |
|  --> Seed → Sprout → Growing → Blooming → Flourishing 🌺    |
+-------------------------------------------------------------+
```

---

## 5. Plant Growth System

Your skills grow based on lessons completed:

### 5.1 Growth Stages
| Stage | Progress | Visual | Color |
|-------|----------|--------|-------|
| 🌱 Seed | 0-19% | Small pot | Brown |
| 🌿 Sprout | 20-39% | Tiny leaves | Light Green |
| 🪴 Growing | 40-59% | Multiple leaves | Green |
| 🌸 Blooming | 60-79% | Flower petals | Pink |
| 🌺 Flourishing | 80-100% | Full bloom | Purple/Pink |

### 5.2 XP System
| Action | XP Earned |
|--------|-----------|
| Complete a lesson | +50 XP |
| Pass a quiz | +30 XP |
| Daily streak | +20 XP |
| Perfect quiz score | +25 XP bonus |

---

## 6. AI Capabilities

Powered by **Mistral AI** for intelligent content generation:

| Feature | Description |
|---------|-------------|
| **Lesson Generation** | Creates structured lessons with concepts and examples |
| **Quiz Creation** | Generates multiple-choice questions from lesson content |
| **Personalization** | Adapts difficulty based on skill level |
| **Explanations** | Provides detailed explanations for quiz answers |

### What AI Generates
- Lesson title and introduction
- 3-5 key concepts with examples
- Practice exercise with hints
- Summary for retention
- Quiz questions with explanations

---

## 7. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI** | Mistral AI API |
| **3D Graphics** | Three.js, @react-three/fiber |
| **Animations** | Framer Motion |
| **Effects** | canvas-confetti |
| **Icons** | Lucide React |
| **Storage** | localStorage |

---

## 8. Quick Start

### Option 1: Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/himanshu-sugha/SkillBloom.git
cd SkillBloom

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Add your Mistral API key to .env.local

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Option 2: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/himanshu-sugha/SkillBloom)

Add `MISTRAL_API_KEY` in Vercel's environment variables.

### Prerequisites
- Node.js 18+
- Mistral AI API key (free tier available)

---

## 9. Project Structure

```
skillbloom/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-lesson/route.ts    # AI lesson endpoint
│   │   │   └── generate-quiz/route.ts      # AI quiz endpoint
│   │   ├── garden/page.tsx                 # Dashboard with 3D garden
│   │   ├── learn/page.tsx                  # Learning experience
│   │   ├── onboarding/page.tsx             # Setup wizard
│   │   ├── about/page.tsx                  # About page
│   │   ├── globals.css                     # Design system
│   │   ├── layout.tsx                      # Root layout
│   │   └── page.tsx                        # Landing page
│   ├── components/
│   │   ├── Garden3D.tsx                    # Three.js garden
│   │   ├── Animations.tsx                  # Reusable animations
│   │   ├── AchievementBadge.tsx            # Gamification badges
│   │   ├── LoadingScreen.tsx               # Beautiful loader
│   │   └── Toast.tsx                       # Notification system
│   └── lib/
│       ├── mistral.ts                      # AI integration
│       └── confetti.ts                     # Celebration effects
├── .env.example                            # Environment template
└── README.md                               # This file
```

---

## 10. API Endpoints

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/generate-lesson` | POST | `{ skill, level }` | `{ lesson: {...} }` |
| `/api/generate-quiz` | POST | `{ skill, lessonContent, numQuestions }` | `{ quiz: [...] }` |

---

## 11. Architecture

```
+-------------------------------------------------------------+
|                      FRONTEND (Next.js)                     |
+-------------------------------------------------------------+
|  Pages                                                      |
|  [Landing] [Onboarding] [Garden] [Learn] [About]            |
+-------------------------------------------------------------+
|  Components                                                 |
|  [Garden3D] [Animations] [Toast] [LoadingScreen]            |
+-------------------------------------------------------------+
|  API Routes (Serverless)                                    |
|  +-------------------+  +------------------+                |
|  | generate-lesson   |  | generate-quiz    |                |
|  +-------------------+  +------------------+                |
+-------------------------------------------------------------+
|  External Services                                          |
|  [Mistral AI API] [localStorage]                            |
+-------------------------------------------------------------+
```

---

## 12. Screenshots

| Landing Page | 3D Garden | Learning |
|--------------|-----------|----------|
| Beautiful hero | Interactive plants | AI lessons |

---

## 13. Author

**Himanshu Sugha**  
Email: himanshusugha@gmail.com  
GitHub: [@himanshu-sugha](https://github.com/himanshu-sugha)

---

## 14. License

MIT License

---

<p align="center">
  <b>🌱 SkillBloom - Where Skills Grow 🌺</b>
  <br>
  <i>Plant today, harvest tomorrow</i>
</p>
