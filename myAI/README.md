# PregWell AI Chatbot

A specialized AI chatbot for pregnancy-related queries, built with RASA and integrated with React Native frontend. The chatbot provides information and support regarding pregnancy, childbirth, and health-related issues.

## Features

- Pregnancy-specific knowledge base
- Real-time chat interface
- Symptom severity checking
- Trimester-based advice
- Health tips and recommendations
- Emergency warning system for severe symptoms

## Prerequisites

- Python 3.8 or higher
- Node.js and npm
- React Native development environment
- RASA 3.6.2

## Installation

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
.\venv\Scripts\activate  # On Windows
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```

3. Train the RASA model:
```bash
rasa train
```

4. Start the RASA server (in separate terminals):
```bash
# Terminal 1: Start RASA server
rasa run --enable-api --cors "*"

# Terminal 2: Start RASA actions server
rasa run actions
```

5. Start the API server:
```bash
python api/endpoints.py
```

### Frontend Integration

1. Import the ChatComponent into your React Native app:
```javascript
import ChatComponent from './frontend/ChatComponent';
```

2. Use the component in your app:
```javascript
<ChatComponent />
```

## Usage

The chatbot can handle various pregnancy-related queries including:
- Pregnancy symptoms
- Prenatal care advice
- Labor and delivery information
- Nutrition and exercise guidance
- Medical complications
- Emotional support

## Security Note

This chatbot is designed to provide general pregnancy-related information and support. It is not a replacement for professional medical advice. Always consult with healthcare providers for medical decisions.

## Customization

You can customize the chatbot by:
- Adding new intents in `data/nlu.yml`
- Creating new stories in `data/stories.yml`
- Modifying responses in `domain.yml`
- Adding custom actions in `actions/actions.py`
- Adjusting the UI in `frontend/ChatComponent.js`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License