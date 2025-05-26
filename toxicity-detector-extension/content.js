// === content.js ===

// === Configuration ===
const API_KEY = 'AIzaSyCjsazvQpiMlWL4JpQlYEi1NUQHpxf30jw'; // Replace with your approved key
const API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;
const TOXICITY_THRESHOLD = 0.75;

// === State ===
let toxicityEnabled = true;
const observedFields = new Set();
const bubble = createBubble();

// === Utility: Debounce ===
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// === Analyze Text via Perspective API ===
async function analyzeToxicity(text) {
  const body = {
    comment: { text },
    languages: ['en'],
    requestedAttributes: { TOXICITY: {} }
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const json = await res.json();

    // Safely check if score is available
    const score = json?.attributeScores?.TOXICITY?.summaryScore?.value;
    if (typeof score === 'number') {
      return score;
    } else {
      console.warn('Perspective API returned no TOXICITY score:', json);
      return null;
    }
  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}

// === Create Bubble ===
function createBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'toxicity-bubble';
  bubble.style.display = 'none';
  bubble.style.position = 'absolute';
  bubble.style.zIndex = '9999';
  bubble.style.padding = '8px 12px';
  bubble.style.background = '#fff';
  bubble.style.border = '2px solid';
  bubble.style.borderRadius = '8px';
  bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  bubble.style.fontFamily = 'sans-serif';
  bubble.style.fontSize = '14px';
  document.body.appendChild(bubble);
  return bubble;
}

// === Update Bubble ===
function updateBubble(bubble, score, target) {
  const percent = Math.round(score * 100);
  let color = '#4caf50';
  let label = '✅ Clean';

  if (score > 0.5 && score < TOXICITY_THRESHOLD) {
    color = '#ff9800';
    label = '⚠️ Mild';
  } else if (score >= TOXICITY_THRESHOLD) {
    color = '#f44336';
    label = '🚨 Toxic';
  }

  bubble.innerHTML = `<strong style="color: ${color};">${label}</strong><br><small>Toxicity: ${percent}%</small>`;
  const rect = target.getBoundingClientRect();
  bubble.style.top = `${window.scrollY + rect.bottom + 8}px`;
  bubble.style.left = `${window.scrollX + rect.left}px`;
  bubble.style.display = 'block';
  bubble.style.borderColor = color;
}

// === Attach Input Listener ===
function attachInputListener(field, bubble) {
  if (observedFields.has(field)) return;

  const onInput = debounce(async () => {
    if (!toxicityEnabled) {
      bubble.style.display = 'none';
      return;
    }

    const text = field.value || field.innerText;
    if (!text || text.length < 3) {
      bubble.style.display = 'none';
      return;
    }

    const score = await analyzeToxicity(text);
    if (score !== null) updateBubble(bubble, score, field);
  }, 800);

  field.addEventListener('input', onInput);
  observedFields.add(field);
}

// === Observe Input Fields ===
function monitorDynamicFields() {
  const scan = () => {
    const fields = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
    fields.forEach(field => attachInputListener(field, bubble));
  };
  scan();

  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, { childList: true, subtree: true });
}

// === Listen for Toggle from Popup ===
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'setEnabled') {
    toxicityEnabled = request.enabled;
    if (!toxicityEnabled) {
      bubble.style.display = 'none';
    }
  }
});

// === Init ===
monitorDynamicFields();