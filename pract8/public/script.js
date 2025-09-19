
async function fetchCounter() {
  const res = await fetch('/counter');
  const data = await res.json();
  document.getElementById('counter').textContent = data.counter;
}

async function updateCounter(action) {
  const res = await fetch('/counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  const data = await res.json();
  document.getElementById('counter').textContent = data.counter;
}

fetchCounter();
