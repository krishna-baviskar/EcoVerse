# 🌿 EcoVerse: AI-Powered Urban Sustainability Platform

EcoVerse is a next-generation, gamified web application designed to make urban sustainability visible, engaging, and rewarding. It leverages real-time environmental data, generative AI, and community-driven challenges to empower citizens to understand and improve their local environment.

## ✨ The Vision

Our cities face invisible environmental challenges like poor air quality and urban heat islands. EcoVerse was built to solve this by:
1.  **Making the Invisible Visible**: Providing a real-time, easy-to-understand **EcoScore** for any city.
2.  **Providing Actionable Guidance**: Using an **AI Eco-Tutor** to explain complex data and suggest personalized, impactful actions.
3.  **Driving Motivation through Gamification**: Turning sustainable actions into a fun and rewarding experience with points, badges, and leaderboards.

Our vision is to foster a global community of "Eco Warriors" who are empowered with the data and tools to collectively transform their cities into healthier, greener eco-paradises.

---

## 🚀 Key Features

-   **Real-Time EcoScore Dashboard**: Aggregates live data (AQI, temperature, humidity) from multiple APIs into a single, comprehensive 0-100 EcoScore for any city.
-   **EcoGPT AI Tutor**: A conversational AI assistant that explains the user's EcoScore, answers any sustainability-related questions, and generates personalized eco-challenges.
-   **AI-Powered Action Validation**: Users log sustainable actions with text and image proof. A multimodal AI model validates the submission to ensure authenticity before awarding points.
-   **Gamified Experience**:
    -   **EcoPoints**: Earn points for completing challenges and logging sustainable actions.
    -   **Leaderboards**: Compete with other users in your community to see who is making the biggest impact.
    -   **Badges & Achievements**: Unlock achievements and badges for reaching milestones and maintaining streaks.
-   **Personalized Challenges**: The AI generates unique, actionable challenges based on the user's location and current EcoScore, targeting the most impactful areas for improvement.
-   **User Profile & Analytics**: A detailed profile page tracks a user's points, rank, badges, and historical performance.
-   **Responsive & Modern UI**: Built with ShadCN UI and Tailwind CSS for a beautiful, intuitive experience on any device.

---

## ⚙️ How It Works: The EcoVerse Flow

The application follows a seamless data and user interaction loop:

1.  **📍 Set Location**: The user provides their city. This is the only input needed to start.
2.  **🌐 Data Aggregation**:
    -   The `predictEcoScore` flow is triggered.
    -   It calls external APIs (**OpenWeatherMap** for temperature/humidity and **WAQI** for Air Quality Index) to fetch real-time environmental data for the user's city.
3.  **🤖 EcoScore Calculation**:
    -   The raw data is processed and normalized into a 0-100 score for each factor (Air Quality, Temperature, Humidity).
    -   These scores are combined using a weighted algorithm to produce the final **EcoScore**.
4.  **📊 Dashboard Visualization**:
    -   The dashboard displays the overall EcoScore, a breakdown of contributing factors, and a condition rating (e.g., "Good", "Moderate").
    -   The AI Tutor, `EcoGPT`, provides an initial explanation and suggests relevant actions.
5.  **💪 User Engagement**:
    -   Users can take on AI-generated challenges or log their own custom sustainable actions.
    -   They provide a description and optional photo/video evidence.
6.  **✅ AI Validation**:
    -   The `validateSustainableAction` flow is triggered.
    -   A client-side check first prevents duplicate submissions.
    -   If the action is new, the image and text are sent to a multimodal AI model (Gemini) which verifies if the evidence matches the claim.
7.  **🏆 Rewards & Progression**:
    -   If the action is validated, the user's `ecoPoints` are updated in Firestore.
    -   The user climbs the leaderboard, works towards new badges, and contributes to their community's overall standing.

---

## 🧠 The EcoScore Algorithm: The Heart of EcoVerse

The EcoScore is the core innovation of EcoVerse. It's a composite metric designed to provide a holistic, at-a-glance measure of a city's environmental health. It turns complex, abstract data into a single, intuitive number that anyone can understand and act upon.

### How the Formula Empowers the Project

-   **Simplifies Complexity**: Environmental data like AQI (Air Quality Index), temperature, and humidity are often presented in different units and scales. The EcoScore normalizes these into a single, universal 0-100 score. An EcoScore of 85 is immediately understandable as "Good," without needing to know what an AQI of 40 means.
-   **Drives Personalization**: The EcoScore and its individual components (like a low air quality score) are used by the AI to generate personalized, high-impact challenges. If a city's score is low due to poor air quality, the AI will suggest challenges related to reducing emissions.
-   **Creates a Benchmark**: The score provides a clear benchmark for users to track their progress. Seeing the EcoScore improve over time provides tangible feedback that their actions are making a difference, which is a powerful motivator.

### The Calculation Process

The score is calculated in two main steps:

#### 1. Data Normalization

Raw data from external APIs is converted into a standardized 0-100 scale, where a higher score is always better.

-   **Air Quality Score (from AQI)**: We assume the worst AQI is 500. The score is inverted so a low AQI results in a high score.
    -   `AirQualityScore = 100 - (AQI / 500 * 100)`
-   **Temperature Score**: Based on proximity to an ideal "comfort" temperature of 24°C.
    -   `TempScore = 100 - (abs(currentTemp - 24) * 4)`
-   **Humidity Score**: Based on proximity to an ideal "comfort" humidity of 55%.
    -   `HumidityScore = 100 - abs(currentHumidity - 55)`

#### 2. Weighted Formula

The normalized scores are combined using a weighted average that prioritizes the factors with the greatest impact on human health and environmental quality. Air quality is given the highest weight.

```
EcoScore = (AirQualityScore × 0.5) + (TempScore × 0.3) + (HumidityScore × 0.2)
```

This final formula results in a single, powerful score that makes the invisible environmental state of a city visible and actionable.

---

## 🛠️ Technology & Architecture

EcoVerse is built on a modern, serverless technology stack.

-   **Frontend**:
    -   **Framework**: [Next.js](https://nextjs.org/) (App Router)
    -   **Language**: [TypeScript](https://www.typescriptlang.org/)
    -   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
    -   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database**:
    -   **Platform**: [Firebase](https://firebase.google.com/)
    -   **Authentication**: Firebase Authentication
    -   **Database**: Cloud Firestore (with real-time listeners)
    -   [OpenWeatherMap API](https://openweathermap.org/api): For temperature and humidity data.
    -   [World Air Quality Index (WAQI) API](https://aqicn.org/api/): For real-time AQI data.

---

## 👨‍💻 Meet the Team

This project was brought to life by a team of passionate developers from IRONHACK.

-   **Krishna Somnath Baviskar**: Lead Developer
-   **Sanket Mohan Kotkar**: Core Developer

---
