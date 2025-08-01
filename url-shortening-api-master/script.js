const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const errorMessage = document.getElementById('error-message');
const resultsContainer = document.getElementById('results');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

const BITLY_API_KEY = '1ccbe801f3476ae1860441e0e7972eceb8db08a2';
const BITLY_API_URL = 'https://api-ssl.bitly.com/v4/shorten';

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Input listener (optional)
urlInput.addEventListener('input', function(event) {
  console.log(event.target.value);
});

// Form Submission
urlForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = urlInput.value.trim();

  if (!url) {
    showError('Please add a link');
    return;
  }

  if (!isValidURL(url)) {
    showError('Please enter a valid URL');
    return;
  }

  clearError();

  const submitButton = urlForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Shortening...';
  submitButton.disabled = true;

  try {
    
    const response = await fetch(BITLY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BITLY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        long_url: url,
        domain: "bit.ly"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Bitly API error');
    }

    const shortUrl = data.link;
    addResultItem(url, shortUrl);
    urlInput.value = '';

  } catch (error) {
    showError('Could not shorten the link. Please try again.');
    console.error('Error shortening URL:', error);
  } finally {
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function showError(message) {
  errorMessage.textContent = message;
  urlInput.classList.add('error');
}

function clearError() {
  errorMessage.textContent = '';
  urlInput.classList.remove('error');
}

function addResultItem(originalUrl, shortUrl) {
  const resultItem = document.createElement('div');
  resultItem.className = 'result-item';

  const originalLink = document.createElement('div');
  originalLink.className = 'original-link';
  originalLink.textContent = originalUrl;

  const shortenedLink = document.createElement('div');
  shortenedLink.className = 'shortened-link';

  const shortUrlElement = document.createElement('a');
  shortUrlElement.className = 'short-url';
  shortUrlElement.href = shortUrl;
  shortUrlElement.target = '_blank';
  shortUrlElement.textContent = shortUrl;

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-btn';
  copyButton.textContent = 'Copy';

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      });

      copyButton.textContent = 'Copied!';
      copyButton.classList.add('copied');

      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.classList.remove('copied');
      }, 3000);
    });
  });

  shortenedLink.appendChild(shortUrlElement);
  shortenedLink.appendChild(copyButton);

  resultItem.appendChild(originalLink);
  resultItem.appendChild(shortenedLink);

  resultsContainer.prepend(resultItem);

  saveToLocalStorage(originalUrl, shortUrl);
}

function saveToLocalStorage(originalUrl, shortUrl) {
  let shortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  shortenedUrls.push({ original: originalUrl, short: shortUrl });
  localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
}

function loadFromLocalStorage() {
  const shortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  shortenedUrls.forEach(item => {
    addResultItem(item.original, item.short);
  });
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);