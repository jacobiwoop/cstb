fetch('https://019d4e39-de67-7459-b33e-48f94857d3a0.arena.site/')
  .then(res => res.text())
  .then(text => console.log(text))
  .catch(err => console.error(err));
