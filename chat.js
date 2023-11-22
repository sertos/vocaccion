// Reemplaza 'YOUR_CHATGPT_API_KEY' con tu clave de API de OpenAI
const apiKey = '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';
const chatDisplay = document.getElementById('chat-display');
const messageInput = document.getElementById('message-input');
const downloadButton = document.getElementById('download-button');
let chatHistory = '';

function sendMessage() {
    const userMessage = messageInput.value;
    if (userMessage.trim() === '') return;

    appendMessage('user', userMessage);
    chatHistory += `User: ${userMessage}\n`;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userMessage }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        const chatGptResponse = data.choices[0].message.content;
        appendMessage('chatbot', chatGptResponse);
        chatHistory += `Chatbot: ${chatGptResponse}\n`;
    })
    .catch(error => console.error('Error:', error));

    messageInput.value = '';
}

function appendMessage(role, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(role);
    messageElement.textContent = content;
    chatDisplay.appendChild(messageElement);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function downloadChatHistory() {
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Agrega un evento al botón de descarga
downloadButton.addEventListener('click', downloadChatHistory);
