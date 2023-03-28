const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.CHATGPT_API_KEY;
const API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

let conversation = [];

async function sendToChatGPT(message) {
  try {
    const prompt = `The following is a conversation with a chatbot:\n\n${conversation.join('\n')}\nUser: ${message}\nChatbot:`;
    const response = await axios.post(
      API_URL,
      {
        prompt,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.8,
        top_p: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].text.trim();
    conversation.push(`User: ${message}`);
    conversation.push(`Chatbot: ${reply}`);
    return reply;
  } catch (error) {
    console.error('Error fetching GPT-3 response:', error);
    return 'Error: Unable to process your request';
  }
}

function addMessageToChatArea(sender, message) {
    const chatArea = document.getElementById('chat-area');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'User' ? 'user-message' : 'bot-message');
    messageDiv.textContent = `${sender}: ${message}`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
  
  document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (!message) return;
  
    addMessageToChatArea('User', message);
    userInput.value = '';
  
    const reply = await sendToChatGPT(message);
    addMessageToChatArea('Chatbot', reply);
  });