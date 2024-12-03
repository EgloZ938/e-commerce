import React, { useEffect } from 'react';

const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>
);

const HeroSection = ({ navigate }) => {
    useEffect(() => {
        // Animation des éléments au chargement
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((el, i) => {
            el.style.animationDelay = `${i * 200}ms`;
        });
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            <AnimatedBackground />

            <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center justify-center text-center z-10">
                <h2 className="animate-on-load opacity-0 animate-fade-in-up text-indigo-600 text-xl md:text-2xl font-medium tracking-wide uppercase mb-6 relative">
                    Bienvenue sur notre boutique
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-indigo-600/30 rounded-full"></div>
                </h2>

                <h1 className="animate-on-load opacity-0 animate-fade-in-up text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8 relative">
                    <span className="inline-block hover:scale-105 transition-transform duration-300">Des</span>{' '}
                    <span className="inline-block hover:scale-105 transition-transform duration-300">Produits</span>{' '}
                    <span className="inline-block hover:scale-105 transition-transform duration-300">d'Exception</span>
                </h1>

                <p className="animate-on-load opacity-0 animate-fade-in-up text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
                    Découvrez notre collection exclusive de produits qui redéfinissent l'excellence
                </p>

                <div className="animate-on-load opacity-0 animate-fade-in-up flex flex-col sm:flex-row justify-center gap-6">
                    <button
                        onClick={() => navigate('/products')}
                        className="group relative inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
                    >
                        <div className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full opacity-10"></div>
                        <span className="relative flex items-center">
                            Découvrir nos produits
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Animated decoration elements */}
            <div className="absolute left-0 top-1/4 w-24 h-24 border-8 border-indigo-200 rounded-full animate-spin-slow opacity-20"></div>
            <div className="absolute right-1/4 bottom-1/4 w-16 h-16 border-4 border-purple-300 rounded-full animate-bounce opacity-30"></div>
            <div className="absolute right-0 top-1/3 w-20 h-20 border-4 border-pink-200 rounded-full animate-ping opacity-20"></div>
        </div>
    );
};

export default HeroSection;