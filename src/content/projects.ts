export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  stack: string[];
  status: string;
  objective: string;
  built: string;
  contribution: string;
  architecture: string[];
  details: string[];
  results: string;
  limitations: string;
  repo?: string;
  demo?: string;
  demoAccessNote?: string;
  image?: string;
  video?: {
    src: string;
    poster: string;
    duration: string;
    description: string;
  };
  art: string;
};
const github = "https://github.com/hanamaraddi9620adi/";
export const projects: Project[] = [
  {
    slug: "bangalore-house-prices",
    title: "Bangalore House Price Prediction",
    category: "Machine learning / Data analysis",
    summary:
      "From a housing dataset to a predictive model. A datathon-winning team project grounded in analysis and evaluation.",
    stack: ["Python", "Pandas", "Scikit-learn"],
    status: "Datathon project · Team PRIME",
    objective:
      "Explore how structured housing data can support house-price prediction in Bengaluru.",
    built:
      "A data preparation, exploratory analysis, model training and evaluation workflow comparing Linear Regression and Random Forest.",
    contribution:
      "Worked with Team PRIME on data preparation, analysis, training and evaluation during DataVerse AI Datathon 2026. Individual task ownership beyond this team contribution has not been documented.",
    architecture: [
      "Housing dataset",
      "Preparation & EDA",
      "Regression models",
      "R² / MAE / RMSE",
    ],
    details: [
      "Analyzed the structured housing dataset before model training.",
      "Trained Linear Regression and Random Forest using Scikit-learn.",
      "Evaluated predictions with R-squared, mean absolute error and root mean squared error.",
    ],
    results:
      "Linear Regression achieved an R² of 0.6323. Team PRIME was the winning team at DataVerse AI Datathon 2026.",
    limitations:
      "The notebook and dataset were not supplied. MAE, RMSE and Random Forest scores are not published here because their values could not be verified. R² is not a percentage accuracy score.",
    art: "housing",
  },
  {
    slug: "swinglens",
    title: "SwingLens",
    category: "Full-stack / Financial research",
    summary:
      "Market charts, computed stock analysis and AI-assisted research, brought together in a focused application. Explore the app and watch my walkthrough.",
    stack: ["Python", "FastAPI", "React"],
    status: "Deployed research application · Video walkthrough",
    objective:
      "Make stock-chart research easier to explore by connecting market data, calculated indicators and explanations in one interface.",
    built:
      "A stock-research application with a Python/FastAPI backend and React interface. The supplied recording demonstrates the market overview, research conversations and chart-analysis workflow.",
    contribution:
      "Developed SwingLens as a personal project and supplied the recorded product walkthrough featured below.",
    architecture: [
      "React interface",
      "FastAPI endpoints",
      "Market data & indicator calculations",
      "Research explanations",
    ],
    details: [
      "The inspected analysis-engine source includes RSI, ATR and swing-pivot calculations.",
      "The project separates calculated numerical facts from AI-generated explanations.",
      "The supplied walkthrough shows the application in use; its interface may differ from the latest deployed version.",
    ],
    results:
      "A deployed application and a 7-minute, 26-second recorded walkthrough. No investment returns or prediction-accuracy figures are claimed.",
    limitations:
      "For research and education. Market-data availability and AI responses depend on their providers. Charts and explanations are not investment advice. The portfolio does not independently validate financial outputs.",
    repo: github + "swinglens",
    demo: "https://swinglens-cyan.vercel.app/",
    image: "/images/projects/swinglens-market-preview.webp",
    video: {
      src: "/videos/swinglens-walkthrough.mp4",
      poster: "/images/projects/swinglens-market-preview.webp",
      duration: "7:26",
      description:
        "My recorded explanation of SwingLens, including its market overview, research interface and stock-chart workflow.",
    },
    art: "swinglens",
  },
  {
    slug: "navia",
    title: "NAVIA",
    category: "AI applications / Financial analysis",
    summary:
      "An AI swing trading copilot exploring how financial research can become a more understandable workflow.",
    stack: ["Python", "FastAPI", "React"],
    status: "Hackathon prototype · AMD ACT II",
    objective:
      "Explore AI-assisted financial analysis and swing-trading workflows as a team hackathon project.",
    built:
      "A Python/FastAPI backend and a React-based frontend. Source inspection confirmed an analysis endpoint that delegates a stock symbol to an analysis service.",
    contribution:
      "The public repository README credits Hanamaraddi Kanakannavar for backend development and two teammates for frontend development.",
    architecture: [
      "React interface",
      "FastAPI endpoint",
      "Analysis service",
      "Research response",
    ],
    details: [
      "The /analyze/{symbol} route is implemented in the backend.",
      "The repository contains separate backend and frontend2 source directories.",
      "The frontend package uses React and Next.js.",
    ],
    results:
      "A structured team prototype with backend analysis routing and a React interface. No measured model quality or financial returns are claimed.",
    limitations:
      "Source inspection is not an end-to-end runtime validation. External services and full workflow behavior have not been tested here. Research prototype; not investment advice.",
    repo: github + "AMD_Hackathon",
    art: "navia",
  },
  {
    slug: "employee-management",
    title: "Employee Management System",
    category: "Backend engineering / APIs",
    summary:
      "A Java backend connecting employee records, REST endpoints and a tested Redis caching layer.",
    stack: ["Spring Boot", "MySQL", "Redis"],
    status: "Learning project",
    objective:
      "Build a structured backend for creating, reading, updating and deleting employee records.",
    built:
      "REST APIs backed by Spring Data JPA, Hibernate and MySQL, with Redis caching integration.",
    contribution:
      "Implemented backend CRUD, database integration, application properties, CORS configuration and cache behavior testing, as described in the supplied profile.",
    architecture: [
      "REST client",
      "Spring Boot",
      "JPA / Hibernate",
      "MySQL + Redis",
    ],
    details: [
      "Tested REST endpoints through Postman and Swagger/OpenAPI.",
      "Integrated Redis and tested cache hits and cache misses.",
      "Configured application properties and CORS.",
    ],
    results:
      "Implemented and exercised the documented CRUD and caching workflows. No load-test or latency measurements are available.",
    limitations:
      "Source repository was not supplied. Authentication, role permissions and production deployment are not claimed.",
    art: "systems",
  },
  {
    slug: "crypto-profit-calculator",
    title: "Crypto Profit Calculator",
    category: "FinTech / Web application",
    summary:
      "A focused utility for exploring potential profit, loss, portfolio value and return on investment.",
    stack: ["Web application", "Financial calculations"],
    status: "Personal project",
    objective: "Make basic investment arithmetic easier to explore.",
    built:
      "A calculator for potential profit or loss, investment amount, portfolio value and ROI.",
    contribution:
      "Built the calculator described in the supplied professional profile.",
    architecture: ["User inputs", "Calculation logic", "Profit / loss & ROI"],
    details: [
      "Supports investment amount and portfolio-value calculations.",
      "Reports return on investment.",
    ],
    results:
      "The supplied profile reports a deployed project; a current live destination has not been verified.",
    limitations:
      "Repository and live URL are pending. No exchange connection or investment recommendation is claimed.",
    art: "crypto",
  },
  {
    slug: "phishshield-ai",
    title: "PhishShield AI",
    category: "Cybersecurity / Awareness",
    summary:
      "A team exploration of AI-based phishing awareness, built during a 24-hour hackathon.",
    stack: ["AI", "Cybersecurity awareness"],
    status: "Hackathon project · Zynex",
    objective:
      "Explore AI-based phishing awareness and cybersecurity education.",
    built: "A team project developed for the Zynex 24-Hour Hackathon.",
    contribution:
      "Participated in project development and presentation as a team member.",
    architecture: ["Awareness objective", "Team prototype", "Presentation"],
    details: [
      "Developed as part of a 24-hour team hackathon.",
      "Focused on phishing awareness.",
    ],
    results:
      "Project development and presentation completed as described in the supplied profile.",
    limitations:
      "Source, detection model, dataset and evaluation scores were not available. No technical detection-performance claims are made.",
    art: "shield",
  },
  {
    slug: "quantedge-ai",
    title: "QuantEdge AI",
    category: "Data engineering / FinTech",
    summary:
      "A financial research prototype with a deterministic, simulated market-data provider.",
    stack: ["Python", "FastAPI", "Next.js"],
    status: "Prototype · Simulated data",
    objective:
      "Explore the architecture of a stock-research application using reproducible synthetic market data.",
    built:
      "A repository with a FastAPI API, Next.js interface and mock data provider. Inspected provider code implements quotes, OHLCV ranges and index histories from a generated data store.",
    contribution:
      "Personal repository project. Specific commit-level ownership of individual components has not been established.",
    architecture: [
      "Synthetic data store",
      "Mock provider",
      "FastAPI",
      "Next.js interface",
    ],
    details: [
      "MockMarketDataProvider reads from MockDataStore.",
      "OHLCV methods resample generated data to weekly and monthly intervals.",
      "The README explicitly labels the default data as synthetic.",
    ],
    results:
      "Source supports a reproducible simulated-data research architecture; no real-market performance is reported.",
    limitations:
      "All showcased market data is simulated. Runtime, backtest correctness and deployment have not been verified. Not investment advice.",
    repo: github + "Stock_Market",
    art: "quant",
  },
];
export const repositoryNotes = [
  {
    name: "LaunchLoop AI",
    repo: github + "applybee",
    text: "Positioning experiment project. Source includes an owner-gated route that generates and stores landing-page variants.",
  },
  {
    name: "CareerForge",
    repo:
      github +
      "AI-Powered-Digital-Commerce-Platform-for-Creators-and-Professionals.",
    text: "Career-tool platform under development. Provider-dependent capabilities require separate configuration and verification.",
  },
  {
    name: "DSA Discipline",
    repo: github + "LeetCode-Solutions",
    text: "Learning repository with C and C++ algorithm exercises. Presented as ongoing practice.",
  },
  {
    name: "Sri Ramakrishna Students Home",
    repo: github + "SRKSHome",
    text: "Next.js website project with an implemented database-backed enquiry route. Deployment not verified.",
  },
];
