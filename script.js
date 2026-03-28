const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const targetId = btn.getAttribute('data-target');
    
    tabContents.forEach(content => {
      content.classList.remove('active');
    });

    const targetContent = document.getElementById(targetId);
    setTimeout(() => {
      targetContent.classList.add('active');
    }, 50);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
