export const skills: { group: string; items: string[] }[] = [
  { group: "Programming", items: ["Python", "Spark", "PySpark", "Microsoft SCOPE"] },
  { group: "Query Languages", items: ["SQL", "PySpark", "SCOPE (ADLA)"] },
  {
    group: "Big Data & Cloud",
    items: [
      "Apache Kafka",
      "Spark Structured Streaming",
      "Databricks",
      "Azure Data Lake (ADLS Gen2)",
      "Delta Lake",
      "ADLA",
      "Cosmos",
    ],
  },
  { group: "ML Frameworks", items: ["TensorFlow", "Scikit-learn", "NLTK"] },
  { group: "Data Visualization", items: ["Power BI", "MS Excel", "Seaborn", "Matplotlib"] },
  {
    group: "Statistical Analysis",
    items: ["Hypothesis Testing", "Regression Analysis", "EDA", "Time Series Analysis"],
  },
  { group: "Markup", items: ["HTML"] },
];

export const experience: {
  role: string;
  company: string;
  location: string;
  period: string;
  context?: string;
  bullets: string[];
}[] = [
  {
    role: "Data Analyst",
    company: "Analytics Consulting Firm",
    location: "Chennai",
    period: "November 2024 – Present",
    context: "Subscription & device-engagement analytics for a global gaming & entertainment platform",
    bullets: [
      "Built large-scale distributed data pipelines using Microsoft SCOPE on ADLA and Cosmos clusters to process millions of subscription and device telemetry records.",
      "Engineered end-to-end subscription lifecycle analytics across first-party and partner subscription services — acquisitions, renewals, cancellations, expirations and SKU-level conversions.",
      "Developed bundle conversion logic from event and subscription datasets to track partner-service users converting to the premium subscription tier across multiple SKUs and recurrence IDs.",
      "Built month-over-month acquisition, retention and conversion reports supporting monetization strategy and subscriber growth decisions.",
      "Designed device reactivation analysis identifying inactive devices returning to active usage, with inactivity periods from 1 to 6+ months.",
      "Analyzed Monthly Active Device (MAD) and rolling active-device metrics by integrating usage, application and revenue datasets into consolidated engagement views.",
      "Applied deduplication (ARGMAX, aggregation) and query optimization to improve performance and accuracy on large-scale distributed SCOPE queries.",
      "Completed company boot-camp training and earned the Databricks Data Engineer Associate certification (93.2%) during onboarding (Nov 2024 – Apr 2025).",
    ],
  },
  {
    role: "Project Intern",
    company: "Analytics Firm",
    location: "Bengaluru",
    period: "August 2023 – September 2023",
    bullets: [
      "Built a Retrieval-Augmented Generation (RAG) chatbot using Generative AI to answer queries from uploaded documents.",
      "Developed an NLP-based document summarization bot to extract and condense product review content.",
    ],
  },
];

export const projects: {
  name: string;
  period: string;
  bullets: string[];
  tools: string[];
}[] = [
  {
    name: "Financial Fraud Detection Pipeline",
    period: "January 2025 – March 2025",
    bullets: [
      "Built a real-time fraud detection system ingesting streaming transactions via Apache Kafka and processing them with Spark Structured Streaming on Databricks.",
      "Designed a Medallion architecture (Bronze → Silver → Gold) for transformation, quality control and storage using Delta Lake.",
      "Applied SQL-based anomaly detection and rule-based logic to flag suspicious transactions, with a Power BI real-time monitoring dashboard.",
      "Configured automated email alerting for high-risk transaction events.",
    ],
    tools: ["Databricks", "Apache Kafka", "Spark Structured Streaming", "Delta Lake", "Power BI", "SQL", "Python"],
  },
  {
    name: "University Knowledge Graph",
    period: "December 2023 – April 2024",
    bullets: [
      "Designed an ontology representing university entities (faculties, research papers, schools, departments) and populated a knowledge graph using SPARQL and RDF.",
      "Queried and benchmarked multiple LLMs on the knowledge graph to evaluate retrieval accuracy and response quality.",
      "Optimized SPARQL queries and data representation to improve retrieval accuracy and response time.",
    ],
    tools: ["SPARQL", "RDF", "Knowledge Graphs", "LLMs"],
  },
  {
    name: "Movie Genre Prediction",
    period: "November 2022 – January 2023",
    bullets: [
      "Preprocessed movie plot data using NLP techniques (tokenization, stemming, TF-IDF) and built a multi-label classification model to predict genres.",
      "Evaluated multiple supervised and unsupervised algorithms on accuracy, precision, recall and F1-score; tuned hyperparameters to reduce overfitting.",
    ],
    tools: ["Python", "NumPy", "Pandas", "Scikit-learn", "NLTK", "Matplotlib"],
  },
];

export const education: { school: string; credential: string; detail: string; year: string }[] = [
  {
    school: "Amrita Vishwa Vidyapeetham, Coimbatore",
    credential: "B.Tech – Computer Science and Engineering",
    detail: "CGPA: 7.91 / 10.00",
    year: "2024",
  },
  {
    school: "Sri Vageesha Vidhyashram, Trichy",
    credential: "Senior Secondary (12th)",
    detail: "91.2%",
    year: "2020",
  },
  {
    school: "Sri Vageesha Vidhyashram, Trichy",
    credential: "Higher Secondary (10th)",
    detail: "91.4%",
    year: "2018",
  },
];

export const certifications: { name: string; issuer: string; note?: string }[] = [
  { name: "Databricks Data Engineer Associate", issuer: "Databricks", note: "Scored 93.2%" },
  { name: "Introduction to Big Data with Spark and Hadoop", issuer: "IBM" },
  { name: "Supervised Machine Learning: Regression and Classification", issuer: "DeepLearning.AI" },
  { name: "SQL (Intermediate & Advanced)", issuer: "HackerRank" },
];

export const achievements: string[] = [
  "Cultural Fest Team Coordinator — led the CSE department team to win the University Cultural Fest (2023).",
  "Author of technical articles on Large Language Models published on Medium.",
];
