const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.classList.contains('active')) return;

    const targetId = btn.getAttribute('data-target');
    
    // Update Nav
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Switch Content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if(content.id === targetId) {
        content.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
