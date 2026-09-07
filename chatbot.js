(function () {
  var widget = document.createElement('section');
  widget.className = 'chatbot';
  widget.setAttribute('aria-label', 'Security assistant');
  widget.innerHTML = '' +
    '<div class="chatbot-panel" hidden>' +
      '<div class="chatbot-header">' +
        '<div><strong>Security Assistant</strong><span>Usually replies instantly</span></div>' +
        '<button class="chatbot-close" type="button" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chatbot-messages" aria-live="polite">' +
      '</div>' +
      '<form class="chatbot-form">' +
        '<label class="sr-only" for="chatbot-input">Type your message</label>' +
        '<input id="chatbot-input" type="text" placeholder="Type your message..." autocomplete="off" required>' +
        '<button type="submit" aria-label="Send message">Send</button>' +
      '</form>' +
    '</div>' +
    '<button class="chatbot-launcher" type="button" aria-expanded="false" aria-controls="security-chat-panel">' +
      '<span class="chatbot-launcher-icon" aria-hidden="true">&#9993;</span><span>Chat with us</span>' +
    '</button>';
  widget.querySelector('.chatbot-panel').id = 'security-chat-panel';
  document.body.appendChild(widget);

  var panel = widget.querySelector('.chatbot-panel');
  var launcher = widget.querySelector('.chatbot-launcher');
  var closeButton = widget.querySelector('.chatbot-close');
  var form = widget.querySelector('.chatbot-form');
  var input = widget.querySelector('#chatbot-input');
  var messages = widget.querySelector('.chatbot-messages');
  var chatStorageKey = 'securityAgencyChatHistory';
  var chatOpenStorageKey = 'securityAgencyChatOpen';
  var chatHistory = readChatHistory();

  function readChatHistory() {
    var savedChat;
    try {
      savedChat = JSON.parse(window.localStorage.getItem(chatStorageKey));
    } catch (error) {
      savedChat = null;
    }
    if (Array.isArray(savedChat) && savedChat.length) return savedChat;
    return [{
      text: 'Hello. How can we help with your security needs today?',
      type: 'agent'
    }];
  }

  function saveChatHistory() {
    try {
      window.localStorage.setItem(chatStorageKey, JSON.stringify(chatHistory));
    } catch (error) {
      // Chat still works when browser storage is unavailable.
    }
  }

  function readChatOpenState() {
    try {
      return window.localStorage.getItem(chatOpenStorageKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  function saveChatOpenState(isOpen) {
    try {
      window.localStorage.setItem(chatOpenStorageKey, String(isOpen));
    } catch (error) {
      // Chat still works when browser storage is unavailable.
    }
  }

  function renderChatHistory() {
    messages.innerHTML = '';
    chatHistory.forEach(function (savedMessage) {
      renderMessage(savedMessage.text, savedMessage.type);
    });
    messages.scrollTop = messages.scrollHeight;
  }

  function renderMessage(text, type) {
    var message = document.createElement('div');
    message.className = 'chatbot-message chatbot-message--' + type;
    message.textContent = text;
    messages.appendChild(message);
  }

  renderChatHistory();

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    launcher.setAttribute('aria-expanded', String(isOpen));
    launcher.classList.toggle('is-open', isOpen);
    saveChatOpenState(isOpen);
    if (isOpen) input.focus();
  }

  setOpen(readChatOpenState());

  function addMessage(text, type) {
    chatHistory.push({ text: text, type: type });
    renderMessage(text, type);
    saveChatHistory();
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(text) {
    var question = text.toLowerCase();
    if (question.indexOf('service') !== -1 || question.indexOf('guard') !== -1) {
      return 'We provide 24/7 guarding, event security, VIP protection, and surveillance solutions. Visit our Services page for details.';
    }
    if (question.indexOf('career') !== -1 || question.indexOf('job') !== -1 || question.indexOf('apply') !== -1) {
      return 'We are always interested in dedicated professionals. Visit our Career page to learn more about joining the team.';
    }
    if (question.indexOf('contact') !== -1 || question.indexOf('quote') !== -1 || question.indexOf('price') !== -1) {
      return 'Please visit Contact Us so our team can discuss your needs and prepare the right assistance.';
    }
    return 'Thanks for reaching out. Ask about our services, careers, or contacting the team, and I will point you in the right direction.';
  }

  launcher.addEventListener('click', function () {
    setOpen(panel.hidden);
  });
  closeButton.addEventListener('click', function () {
    setOpen(false);
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addMessage(text, 'visitor');
    input.value = '';
    window.setTimeout(function () {
      addMessage(getReply(text), 'agent');
    }, 250);
  });
  window.addEventListener('storage', function (event) {
    if (event.key === chatStorageKey) {
      chatHistory = readChatHistory();
      renderChatHistory();
    }
  });
}());