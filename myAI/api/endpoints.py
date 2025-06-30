from flask import Flask, request, jsonify
from rasa.core.agent import Agent
from rasa.shared.utils.io import json_to_string
from rasa.utils.endpoints import EndpointConfig
import asyncio
import os

app = Flask(__name__)

# Initialize RASA agent
async def load_agent():
    model_path = './models'
    endpoint = EndpointConfig(url='http://localhost:5055/webhook')
    agent = await Agent.load(model_path, action_endpoint=endpoint)
    return agent

# Create event loop
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

# Load the agent
agent = loop.run_until_complete(load_agent())

@app.route('/webhook', methods=['POST'])
async def webhook():
    try:
        # Get message from request
        message = request.json.get('message')
        sender_id = request.json.get('sender', 'default')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Get response from RASA
        response = await agent.handle_text(message, sender_id=sender_id)
        
        # Format response for React Native
        formatted_response = {
            'text': response[0]['text'] if response else 'I apologize, I could not process that request.',
            'buttons': response[0].get('buttons', []) if response else [],
            'custom': response[0].get('custom', {}) if response else {}
        }

        return jsonify(formatted_response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)