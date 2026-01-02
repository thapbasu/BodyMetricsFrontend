import { useState, useEffect } from 'react';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop',
        title: 'Start Your Journey',
        subtitle: 'Transform your fitness goals into reality'
    },
    {
        image: 'https://images.unsplash.com/photo-1594737625785-c5f2b8f89859?w=800&h=1000&fit=crop',
        title: 'Push Your Limits',
        subtitle: 'Every day is a new opportunity to grow'
    },
    {
        image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=1000&fit=crop',
        title: 'Achieve Your Goals',
        subtitle: 'Consistency is the key to success'
    }
];

export default function ImageSlider({ mounted }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 5000); // change every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === current ? 'opacity-100 z-20' : 'opacity-0 z-10'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 to-blue-600/60 z-10"></div>
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
                        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h3 className="text-4xl font-bold mb-4">{slide.title}</h3>
                            <p className="text-lg text-white/90 text-center">{slide.subtitle}</p>
                        </div>
                        <div className="absolute bottom-12 flex gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
