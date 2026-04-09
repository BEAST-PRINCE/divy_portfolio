import json
from typing import Any, Dict, List, Optional


# This content is derived from the text extracted from your resume PDF.
# It is kept structured so the templates can render about/skills/experience
# without duplicating parsing logic in views.
_RESUME_CONTENT: Dict[str, Any] = {
    "name": "Divyanshu Prince",
    "role": "Software Development Engineer",
    "tagline": "Agentic AI workflows, scalable microservices, and data pipelines on GCP.",
    "about": (
        "I build production-grade backend systems and AI-enabled products - "
        "focusing on agentic workflows, reliable microservices, and low-latency data pipelines. "
        "I leverage Python/Java with Django/Spring Boot/FastAPI, and GCP (BigQuery, Firestore) "
        "to ship scalable solutions while accelerating development with AI-augmented tooling."
    ),
    "skills": {
        "languages": ["Python", "Java", "SQL", "Golang", "Dart"],
        "frameworks": ["Spring Boot (MVC)", "Django", "FastAPI"],
        "tools": [
            "Generative AI (LLMs)",
            "Agentic AI (MCP)",
            "Google ADK",
            "GCP (BigQuery, Cloud Firestore)",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "Agile (Scrum)",
            "Cursor",
            "GitHub Copilot",
            "Claude/ChatGPT",
            "PostgreSQL",
            "MySQL",
            "RESTful API Design",
        ],
    },
    "experience": [
        {
            "company": "Accenture",
            "location": "Bangalore, India",
            "title": "Software Development Engineer",
            "period": "February 2025 - Present",
            "bullets": [
                "Engineered self-healing Agentic AI workflows in Python (Google ADK, MCP), automating 45% of Tier-1 support tickets and slashing incident MTTR by 20 minutes.",
                "Utilized AI-augmented development tools (Cursor, Copilot) to accelerate feature delivery and complex refactoring, consistently exceeding sprint velocity benchmarks by 30%.",
                "Developed scalable microservices using Java (Spring Boot), supporting 500+ daily concurrent users with 99.9% system uptime while adhering to RESTful API principles.",
                "Collaborated in an Agile environment to deliver rapid prototypes of AI-integrated features, ensuring alignment with customer needs and high-impact engineering operations.",
            ],
        },
        {
            "company": "Souloxy",
            "location": "Remote",
            "title": "Software Development Engineer Intern",
            "period": "December 2024 - February 2025",
            "bullets": [
                "Designed an idempotent payment microservice using Java and gRPC, processing $500k+ in simulated monthly volume with ensured transactional consistency.",
                "Overhauled PostgreSQL architecture using table partitioning and custom indexing, reducing query latency from 800ms to 120ms for a dataset of 2M+ records.",
                "Containerized application services using Docker, reducing local-to-production deployment conflicts by 90% and standardizing the developer environment.",
                "Authored extensive API documentation, facilitating a 50% faster onboarding process for new backend developers.",
            ],
        },
        {
            "company": "Software Engineer (Freelance)",
            "location": "Remote",
            "title": "Big Data & Full Stack Engineering",
            "period": "February 2023 - Present",
            "bullets": [
                "Orchestrated high-throughput Big Data pipelines on GCP, utilizing Python (Scrapy) to ingest 50,000+ unstructured datasets/day with 99.9% data integrity.",
                "Optimized Google BigQuery warehousing strategies, implementing clustering and partitioning to handle large-scale data analytics for client reporting.",
                "Architected \"Getset,\" a cross-platform logistics app (Flutter) utilizing Firebase and Cloud Firestore for real-time state management and geospatial tracking.",
                "Built and deployed a RESTful backend using Django on GCP Compute Engine, serving analytics data to client dashboards with sub-200ms response times.",
            ],
        },
    ],
    "links": {
        "github": "https://github.com/BEAST-PRINCE",
        "linkedin": "https://www.linkedin.com/in/divyanshu-prince-72ba2a22a/",
        "email": "divyanshuprince764@gmail.com",
        "phone": "+91 89880 31269",
        "location": "Bangalore, India",
    },
}


def get_resume_content() -> Dict[str, Any]:
    """
    Returns structured data for the portfolio pages.
    """

    # Returning a copy keeps templates/services from accidentally mutating.
    return json.loads(json.dumps(_RESUME_CONTENT))

