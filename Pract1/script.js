// Initialize vote counts
const votes = {
  JavaScript: 0,
  Python: 0,
  Java: 0
};

// Function to handle voting
function vote(language) {
  votes[language]++;
  updateVotes();
}

// Update UI with current vote counts
function updateVotes() {
  document.getElementById('js-count').textContent = votes.JavaScript;
  document.getElementById('py-count').textContent = votes.Python;
  document.getElementById('java-count').textContent = votes.Java;
}

// Simulate real-time random votes every 2 seconds
setInterval(() => {
  const languages = ['JavaScript', 'Python', 'Java'];
  const randomLang = languages[Math.floor(Math.random() * languages.length)];
  votes[randomLang]++;
  updateVotes();
}, 2000);
