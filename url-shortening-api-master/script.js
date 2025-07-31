// DOM Elements
const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const errorMessage = document.getElementById('error-message');
const resultsContainer = document.getElementById('results');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');

// Bitly API Configuration

const BITLY_API_KEY = '1ccbe801f3476ae1860441e0e7972eceb8db08a2';
const BITLY_API_URL = 'https://api-ssl.bitly.com/v4/shorten';

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Form Submission
urlForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate URL
  const url = urlInput.value.trim();
  if (!url) {
    showError('Please add a link');
    return;
  }
  
  if (!isValidURL(url)) {
    showError('Please enter a valid URL');
    return;
  }
  
  // Clear error message if validation passes
  clearError();
  
  try {
    // Show loading state
    const submitButton = urlForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Shortening...';
    submitButton.disabled = true;
    
    // Call the Bitly API to shorten the URL
    const shortUrl = await shortenUrl(url);
    
    // Create and display the result
    addResultItem(url, shortUrl);
    
    // Clear the input field
    urlInput.value = '';
    
    // Restore button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
    
  } catch (error) {
    showError('Could not shorten the link. Please try again.');
    console.error('Error shortening URL:', error);
    
    // Restore button state
    const submitButton = urlForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Shorten It!';
    submitButton.disabled = false;
  }
});

// Validate URL format
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  urlInput.classList.add('error');
}

// Clear error message
function clearError() {
  errorMessage.textContent = '';
  urlInput.classList.remove('error');
}

// Shorten URL using Bitly API
async function shortenUrl(longUrl) {
 
  return `https://bit.ly/${Math.random().toString(36).substring(2, 8)}`;
}

// Add result item to the results container
function addResultItem(originalUrl, shortUrl) {
  // Create result item elements
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
  
  // Add event listener to copy button
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      // Update all copy buttons to original state
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      });
      
      // Update this button to copied state
      copyButton.textContent = 'Copied!';
      copyButton.classList.add('copied');
      
      // Reset button after 3 seconds
      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.classList.remove('copied');
      }, 3000);
    });
  });
  
  // Assemble the elements
  shortenedLink.appendChild(shortUrlElement);
  shortenedLink.appendChild(copyButton);
  
  resultItem.appendChild(originalLink);
  resultItem.appendChild(shortenedLink);
  
  // Add to results container
  resultsContainer.prepend(resultItem);
  
  // Save to local storage (optional enhancement)
  saveToLocalStorage(originalUrl, shortUrl);
}

// Save shortened URLs to local storage
function saveToLocalStorage(originalUrl, shortUrl) {
  let shortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  shortenedUrls.push({ original: originalUrl, short: shortUrl });
  localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
}

// Load shortened URLs from local storage
function loadFromLocalStorage() {
  const shortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || [];
  shortenedUrls.forEach(item => {
    addResultItem(item.original, item.short);
  });
}

// Load saved URLs when the page loads
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);