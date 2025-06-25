import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const originalScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);

        // CSS-Verhalten zurücksetzen nach einem Frame
        requestAnimationFrame(() => {
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
        });
    }, [pathname]);

    return null;
}

export default ScrollToTop;