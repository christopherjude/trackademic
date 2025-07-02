# Trackademic Backend

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the server:
```bash
python main.py
```

The API will be available at http://localhost:8000 with automatic docs at http://localhost:8000/docs

## API Endpoints

- `GET /api/users/me` - Get current user info
- `GET /api/meetings` - Get user's meetings
- `POST /api/meetings` - Create a new meeting
- `GET /api/milestones` - Get user's milestones
- `POST /api/milestones` - Create a new milestone
- `PUT /api/milestones/{id}` - Update a milestone

## Database

The app uses SQLite with the database file `trackademic.db` created automatically.

## Authentication

For development, the app uses mock authentication. In production, it will validate Azure AD JWT tokens.
