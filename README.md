# IntelliInspect 🛠️

**IntelliInspect** is a full-stack project built for predictive inspection using an integrated web frontend, backend API, and machine learning service.  
The system is containerized with Docker Compose for seamless development and deployment.

---

## 📂 Project Structure
intelliinspect/
│── frontend-angular/ (Angular app - UI)
│── backend-dotnet/ (ASP.NET Core Web API)
│── ml-service-python/ (FastAPI ML service)
│── docker-compose.yaml (Service orchestration)
│── README.md (Documentation)



---

## 🚀 Tech Stack
- **Frontend** → Angular (SCSS styling, routing enabled)  
- **Backend** → ASP.NET Core Web API with Swagger  
- **ML Service** → Python (FastAPI, scikit-learn / XGBoost planned)  
- **Containerization** → Docker + Docker Compose  

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/shridharbhat04/intelliinspect.git
cd intelliinspect

2. Prerequisites
Make sure you have installed:
Docker Desktop
Git

3. Run the Project with Docker Compose
docker-compose up --build

4. Access Services
Frontend (Angular) → http://localhost:4200

Backend (Swagger UI) → http://localhost:5000/swagger

ML Service (FastAPI Docs) → http://localhost:8000/docs

👨‍💻 Development Notes
Run Only Frontend (Angular)
cd frontend-angular/intelliinspect-frontend
ng serve

Run Only Backend (ASP.NET Core)
cd backend-dotnet/IntelliInspectBackend
dotnet run

Run Only ML Service (FastAPI)
cd ml-service-python
uvicorn main:app --reload --port 8000

✅ Current Status
 Docker Compose setup for all services
 Frontend builds successfully with Angular
 Backend runs with Swagger UI
 ML service (FastAPI) running with docs
 Repository cleaned with .gitignore
 ML model integration (XGBoost/LightGBM)
 Backend ↔ ML service integration
 Real dataset ingestion & streaming simulation

📌 Next Steps
Integrate ML models for predictive inspection
Connect backend with ML service for inference
Add synthetic timestamp augmentation for dataset
Enable real-time streaming loop



