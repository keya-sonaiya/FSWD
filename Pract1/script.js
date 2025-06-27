const votes = {
  JavaScript: 0,
  Python: 0,
  Java: 0
};

function vote(language) {
  votes[language]++;
  updateVotes();
}

function updateVotes() {
  document.getElementById('js-count').textContent = votes.JavaScript;
  document.getElementById('py-count').textContent = votes.Python;
  document.getElementById('java-count').textContent = votes.Java;
}

// Simulate real-time voting
setInterval(() => {
  const languages = ['JavaScript', 'Python', 'Java'];
  const random = languages[Math.floor(Math.random() * languages.length)];
  votes[random]++;
  updateVotes();
}, 2000);
