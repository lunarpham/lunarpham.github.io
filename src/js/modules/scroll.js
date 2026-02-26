export function initScrollToTop() {
    const scrollBtnHTML = `
        <button id="scroll-to-top" class="scroll-to-top" aria-label="Scroll page">
            <svg class="progress-circle" width="100%" height="100%" viewBox="-1 -1 102 102">
                <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>
            <i class="fa-solid fa-chevron-down" id="scroll-icon" style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></i>
        </button>
    `;

    if (!document.getElementById('scroll-to-top')) {
        document.body.insertAdjacentHTML('beforeend', scrollBtnHTML);
    }

    const scrollBtn = document.getElementById('scroll-to-top');
    const scrollIcon = document.getElementById('scroll-icon');
    const progressPath = scrollBtn?.querySelector('path');

    if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.transition = 'none';
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect(); // trigger layout
        progressPath.style.transition = 'stroke-dashoffset 10ms linear';

        let isAtTop = true;

        const updateProgress = () => {
            const scroll = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Show button always, but flip icon
            if (scroll > 100) {
                if (isAtTop) {
                    isAtTop = false;
                    scrollIcon.style.transform = 'rotate(180deg)';
                    scrollIcon.style.marginTop = '-2px';
                }
            } else {
                if (!isAtTop) {
                    isAtTop = true;
                    scrollIcon.style.transform = 'rotate(0deg)';
                    scrollIcon.style.marginTop = '0';
                }
            }

            // Show button immediately so they can click down
            scrollBtn.classList.add('visible');

            // Calculate progress
            if (docHeight > 0) {
                const progress = scroll / docHeight;
                progressPath.style.strokeDashoffset = pathLength - (progress * pathLength);
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });

        // Allow layout to settle before initial check
        setTimeout(updateProgress, 100);

        scrollBtn?.addEventListener('click', () => {
            if (isAtTop) {
                // Scroll to bottom
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
            } else {
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}
