document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 900) {
        VanillaTilt.init(document.querySelectorAll(".card"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });

        const cursor = document.getElementById('custom-cursor');
        const follower = document.getElementById('cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 17}px, ${e.clientY - 17}px, 0)`;
        });
    }

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("progress").style.width = scrolled + "%";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(50px) scale(0.95)";
        card.style.transition = `1.2s cubic-bezier(0.2, 1, 0.2, 1) ${i * 0.1}s`;
        observer.observe(card);
    });
});
