import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface ScrollyVideoProps {
  videoSrc: string;
  posterSrc?: string;
  fallbackImageSrc?: string;
  className?: string;
  heightClass?: string; // e.g., 'h-[200vh]' to define scroll length
}

export function ScrollyVideo({ 
  videoSrc, 
  posterSrc, 
  fallbackImageSrc,
  className,
  heightClass = 'h-[300vh]'
}: ScrollyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Check for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Check for mobile (fallback to static or normal play on very small devices where scrubbing is heavy)
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileQuery.matches);
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', handleMobileChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isMobile || !videoRef.current || !containerRef.current) return;

    let animationFrameId: number;
    let targetTime = 0;
    
    // Attempt to preload the video for smooth scrubbing
    const video = videoRef.current;
    
    // We need to ensure the video metadata is loaded to know the duration
    const onLoadedMetadata = () => {
      setIsVideoLoaded(true);
    };
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    const handleScroll = () => {
      if (!containerRef.current || !video || !isVideoLoaded || !video.duration) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress (0 to 1)
      // Starts when the top of the container hits the top of the viewport
      // Ends when the bottom of the container hits the bottom of the viewport
      const totalScrollableDistance = containerRect.height - windowHeight;
      const scrollPosition = -containerRect.top;
      
      let progress = scrollPosition / totalScrollableDistance;
      progress = Math.max(0, Math.min(1, progress));
      
      targetTime = progress * video.duration;
    };

    const loop = () => {
      if (video && isVideoLoaded) {
        // Smooth interpolation for the scrubbing
        const diff = targetTime - video.currentTime;
        // Adjust the multiplier (0.1) to change the "weight" / smoothness
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.1;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(loop);
    
    // Trigger once on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [prefersReducedMotion, isMobile, isVideoLoaded]);

  // If user prefers reduced motion, or on mobile, show fallback or a static playing video
  if (prefersReducedMotion || isMobile) {
    return (
      <div className={cn("relative w-full h-[60vh] md:h-[80vh] overflow-hidden", className)}>
        {fallbackImageSrc ? (
          <img 
            src={fallbackImageSrc} 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 dark:to-background-dark/80" />
      </div>
    );
  }

  // Scrolly Video Implementation
  return (
    <div ref={containerRef} className={cn("relative w-full", heightClass, className)}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          preload="auto"
          muted
          playsInline
          className="w-full h-full object-cover"
          // Important for mobile safari to not full-screen
          style={{ willChange: 'transform' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 dark:to-background-dark/80" />
      </div>
    </div>
  );
}
