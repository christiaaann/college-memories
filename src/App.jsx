import { useState, useRef, useEffect } from 'react'
import image1 from './assets/image1.jpg'
import image2 from './assets/image2.jpg'
import image3 from './assets/image3.jpg'
import image4 from './assets/image4.jpg'
import image5 from './assets/image5.jpg'
import image6 from './assets/image6.jpg'
import image7 from './assets/image7.jpg'
import image8 from './assets/image8.jpg'
import image9 from './assets/image9.jpg'
import image10 from './assets/image10.jpg'
import image11 from './assets/image11.jpg'
import image12 from './assets/image12.jpg'
import video1 from './assets/video1.mp4'
import video2 from './assets/video2.mp4'
import video3 from './assets/video3.mp4'

import christian from './assets/christian.jpg'
import nico from './assets/nico.jpg'
import jane from './assets/jane.jpg'
import patricia from './assets/patricia.jpg'
import zara from './assets/zara.jpg'
import lyn from './assets/lyn.jpg'
import analeth from './assets/analeth.jpg'
import elimina from './assets/elimina.jpg'
import bea from './assets/bea.jpg'

function App() {
  const [graduates] = useState([
    { id: 1, name: "Christian P. Heje", course: "BS Information Technology", quote: "Strive for greatness. The journey is just beginning.", image: christian },
    { id: 2, name: "Nico Jay Balonso", course: "BS Information Technology", quote: "The future belongs to those who believe in the beauty of their dreams.", image: nico },
    { id: 3, name: "Jane Enfal Balderama", course: "BS Information Technology", quote: "Simple things done well. Code is poetry.", image: jane },
    { id: 4, name: "Patricia Cambe", course: "BS Information Technology", quote: "Dream big, work hard, and stay humble through it all.", image: patricia },
    { id: 5, name: "Zara Gapas", course: "BS Information Technology", quote: "Consistency beats talent when talent doesn't work hard.", image: zara },
    { id: 6, name: "Lyn Garrote", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: lyn },
    { id: 7, name: "Analeth Garrot", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: analeth },
    { id: 8, name: "Elmina Gepiga", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: elimina },
    { id: 9, name: "Bea Barcelona", course: "BS Information Technology", quote: "Keep moving forward, exploring, and learning every day.", image: bea },
  ])

  const [messages] = useState([
    {
      id: 1,
      tag: "Message to My Classmates",
      title: "Through the Deadlines and Coffee Runs",
      body: "We spent years chasing points, debugging broken codes, and sharing snacks in hallways. This platform is our living archive a space where our best memories won't fade. Let's look back with pride and forward with absolute hope.",
      author: ""
    }
  ])

  const marqueeImages = [
    image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11
  ]

  const collageImages = [
    image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11
  ]

  const collageVideos = [
    video1, video2, video3
  ]

  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const timeoutRef = useRef(null);

  // Auto-scrolling logic loop for Class of 2026 (Left roll)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId;
    const speed = 0.6; 

    const render = () => {
      if (isAutoScrolling) {
        container.scrollLeft += speed;
        
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoScrolling]);

  const handleUserScroll = () => {
    setIsAutoScrolling(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3500);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsAutoScrolling(false);
      const scrollAmount = window.innerWidth < 768 ? 290 : 360; 
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#191919] font-sans antialiased selection:bg-[#f1ece4] overflow-x-hidden">
      
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 45s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 35s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        /* Custom slow marquee specifically for the Class of 2026 header track if needed */
        .animate-marquee-graduates {
          display: flex;
          width: max-content;
          animation: marqueeLeft 55s linear infinite;
        }
        .animate-marquee-graduates:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <header className="max-w-5xl mx-auto text-center pt-28 md:pt-36 pb-16 md:pb-20 px-6">
        <h1 className="font-serif text-5xl md:text-8xl font-normal tracking-tight mb-6 text-[#1a1a1a] leading-none">
          Batch 2026
        </h1>
        <p className="text-[#66635e] font-serif italic text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
          A widescreen, living archive of our shared, unforgettable journey.
        </p>
      </header>

      {/* --- RESPONSIVE OFFICIAL VIDEO & BACKGROUND SCROLLER --- */}
      <section className="w-full relative mb-24 md:mb-32 py-10 md:py-16 bg-[#f5f1e9]/40 border-y border-[#e8e2d5]/60">
        {/* Dynamic Infinite Moving Background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-0 opacity-20 filter grayscale">
          <div className="animate-marquee-left gap-4 md:gap-8 py-4">
            {marqueeImages.map((src, idx) => (
              <img key={`large-m1-${idx}`} src={src} alt="Memory backdrop" className="w-52 h-36 md:w-72 md:h-48 object-cover rounded-xl border border-[#dcd5c9]" />
            ))}
            {marqueeImages.map((src, idx) => (
              <img key={`large-m2-${idx}`} src={src} alt="Memory backdrop copy" className="w-52 h-36 md:w-72 md:h-48 object-cover rounded-xl border border-[#dcd5c9]" />
            ))}
          </div>
        </div>

        {/* Video Frame */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
          <div className="relative min-h-[340px] md:aspect-video w-full rounded-2xl md:rounded-3xl bg-[#fdfdfc]/90 backdrop-blur-xl border border-[#decbba] shadow-[0_24px_48px_-12px_rgba(40,35,30,0.06)] flex items-center justify-center overflow-hidden group hover:border-[#bfae99] transition-all duration-500">
            <div className="text-center p-6 py-12 md:py-16 px-4 md:px-16 flex flex-col items-center w-full relative z-10">
              
              {/* Glowing Video Recording Style Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold tracking-widest uppercase bg-[#5c4e3c] text-[#fbfaf7] mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                </span>
                Coming Soon
              </div>

              {/* Responsive Elegant Play Button Container */}
              <div className="mb-6 relative flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#5c4e3c] text-[#fbfaf7] flex items-center justify-center shadow-lg border border-[#fbfaf7]/10 group-hover:scale-110 group-hover:bg-[#473b2c] transition-all duration-300 cursor-pointer">
                  {/* Triangle Play SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 ml-1 text-[#fbfaf7]">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="font-serif text-2xl md:text-4xl font-normal mb-4 text-[#1a1a1a] tracking-tight">
                The Official Batch Video
              </h3>
              
              <p className="text-[#524f4a] text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light text-center px-2">
                I am currently fine-tuning and editing this video compilation for all of us. It will bring together our untold stories, inside jokes, and unforgettable milestones spanning from <span className="font-semibold text-[#5c4e3c]">1st Year to 4th Year</span>. Stay tuned!
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* --- LETTERS & REFLECTIONS SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 mb-24 md:mb-32">
        <div className="flex items-center gap-6 mb-12 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight text-[#1a1a1a] whitespace-nowrap">Letters & Reflections</h2>
          <div className="w-full h-[1px] bg-[#e8e2d5]" />
        </div>

        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-[#fdfdfc] border border-[#e8e2d5] rounded-2xl p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between hover:border-[#ccbfad] transition-colors duration-300">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8c7e6b] bg-[#f4f0e8] px-3 py-1 rounded-md border border-[#e8e2d5]">
                  {msg.tag}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-normal text-[#1a1a1a] mt-5 mb-3">
                  {msg.title}
                </h3>
                <p className="text-[#524f4a] text-sm md:text-base leading-relaxed font-light text-justify">
                  {msg.body}
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-[#f4f0e8] text-right">
                <span className="font-serif italic text-xs md:text-sm text-[#8c7e6b]">— {msg.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- GRADUATES SECTION (ANIMATED TULAD NG IBA) --- */}
      <section className="w-full bg-[#fbfaf7] mb-20 md:mb-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6 w-full">
            <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight text-[#1a1a1a] whitespace-nowrap">Class of 2026</h2>
            <div className="w-full h-[1px] bg-[#e8e2d5]" />
          </div>
        </div>

        {/* Infinite Loop Animation para sa mga Graduado (Katulad ng lagari sa ibaba) */}
        <div className="w-full overflow-hidden py-2 select-none">
          <div className="animate-marquee-graduates gap-6 px-6">
            {/* Unang Set */}
            {graduates.map((grad) => (
              <div 
                key={`track-1-${grad.id}`} 
                className="w-[270px] md:w-[320px] h-[420px] md:h-[480px] rounded-[2rem] overflow-hidden relative border border-[#e8e2d5] shadow-[0_12px_32px_rgba(40,35,30,0.03)] hover:shadow-[0_30px_70px_rgba(25,25,25,0.15)] hover:border-[#bfae99] hover:-translate-y-2 transition-all duration-500 bg-[#f5f1e9] flex-shrink-0 group"
              >
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={grad.image} 
                    alt={grad.name} 
                    className="w-full h-full object-cover object-top filter contrast-[1.01] saturate-[1.02] transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:saturate-120" 
                    draggable="false"
                  />
                </div>

                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/10 p-5 md:p-6 text-left flex flex-col justify-end shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:bg-black/50 group-hover:border-white/20">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#ebdccb] tracking-widest uppercase mb-1 md:mb-1.5 opacity-90">
                    {grad.course}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-normal text-white mb-2 tracking-tight leading-tight">
                    {grad.name}
                  </h3>
                  <div className="w-6 h-[1.5px] bg-[#ebdccb]/60 mb-2 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-[#ebdccb]" />
                  <p className="font-serif text-[11px] md:text-[12.5px] text-[#e0deda]/95 italic leading-relaxed line-clamp-3 transition-colors duration-300 group-hover:text-white">
                    "{grad.quote}"
                  </p>
                </div>
              </div>
            ))}

            {/* Pangalawang Set (Para sa walang patid na dugtungan o loop) */}
            {graduates.map((grad) => (
              <div 
                key={`track-2-${grad.id}`} 
                className="w-[270px] md:w-[320px] h-[420px] md:h-[480px] rounded-[2rem] overflow-hidden relative border border-[#e8e2d5] shadow-[0_12px_32px_rgba(40,35,30,0.03)] hover:shadow-[0_30px_70px_rgba(25,25,25,0.15)] hover:border-[#bfae99] hover:-translate-y-2 transition-all duration-500 bg-[#f5f1e9] flex-shrink-0 group"
              >
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={grad.image} 
                    alt={grad.name} 
                    className="w-full h-full object-cover object-top filter contrast-[1.01] saturate-[1.02] transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:saturate-120" 
                    draggable="false"
                  />
                </div>

                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4 rounded-[1.5rem] bg-black/40 backdrop-blur-md border border-white/10 p-5 md:p-6 text-left flex flex-col justify-end shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:bg-black/50 group-hover:border-white/20">
                  <span className="text-[9px] md:text-[10px] font-bold text-[#ebdccb] tracking-widest uppercase mb-1 md:mb-1.5 opacity-90">
                    {grad.course}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-normal text-white mb-2 tracking-tight leading-tight">
                    {grad.name}
                  </h3>
                  <div className="w-6 h-[1.5px] bg-[#ebdccb]/60 mb-2 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-[#ebdccb]" />
                  <p className="font-serif text-[11px] md:text-[12.5px] text-[#e0deda]/95 italic leading-relaxed line-clamp-3 transition-colors duration-300 group-hover:text-white">
                    "{grad.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PHOTO COLLAGE MARQUEE --- */}
      <section className="w-full bg-[#f4f0e8]/30 pt-10 pb-4 border-t border-[#e8e2d5]">
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <span className="font-serif italic text-xs tracking-wider text-[#8c7e6b] uppercase block text-center md:text-left">
            Captured Moments (Photos)
          </span>
        </div>

        <div className="w-full overflow-hidden">
          <div className="animate-marquee-right gap-4 md:gap-6 px-4">
            {collageImages.map((src, idx) => (
              <div key={`col1-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                <img 
                  src={src} 
                  alt={`Batch 2026 Memory ${idx + 1}`} 
                  className="w-full h-64 md:h-80 object-cover object-center rounded-lg mb-3 saturate-110 contrast-105" 
                />
                <div className="h-1.5 md:h-2 w-12 md:w-16 bg-[#ebdccb]/50 rounded-full mx-auto" />
              </div>
            ))}
            {collageImages.map((src, idx) => (
              <div key={`col2-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                <img 
                  src={src} 
                  alt={`Batch 2026 Memory Copy ${idx + 1}`} 
                  className="w-full h-64 md:h-80 object-cover object-center rounded-lg mb-3 saturate-110 contrast-105" 
                />
                <div className="h-1.5 md:h-2 w-12 md:w-16 bg-[#ebdccb]/50 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VIDEO COLLAGE MARQUEE --- */}
      <section className="w-full bg-[#f4f0e8]/30 pb-12 pt-4">
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <span className="font-serif italic text-xs tracking-wider text-[#8c7e6b] uppercase block text-center md:text-left">
            Moving Memories (Autoplay Videos)
          </span>
        </div>

        <div className="w-full overflow-hidden">
          <div className="animate-marquee-left gap-4 md:gap-6 px-4">
            {collageVideos.map((src, idx) => (
              <div key={`vid1-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md transform -rotate-1 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                <video 
                  src={src} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-64 md:h-80 object-cover object-center rounded-lg mb-3 saturate-110 contrast-105 bg-[#f5f1e9]"
                />
                <div className="h-1.5 md:h-2 w-16 md:w-20 bg-[#ebdccb]/70 rounded-full mx-auto" />
              </div>
            ))}
            {collageVideos.map((src, idx) => (
              <div key={`vid2-${idx}`} className="w-48 md:w-60 bg-[#fdfdfc] p-2 md:p-3 pb-5 md:pb-6 rounded-xl border border-[#e3dac9] shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
                <video 
                  src={src} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-64 md:h-80 object-cover object-center rounded-lg mb-3 saturate-110 contrast-105 bg-[#f5f1e9]"
                />
                <div className="h-1.5 md:h-2 w-16 md:w-20 bg-[#ebdccb]/70 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-5xl mx-auto px-6 py-12 md:py-16 text-center text-xs md:text-sm text-[#a19b8f] font-serif italic">
        <p>In elegant preservation of our university memories.</p>
      </footer>

    </div>
  )
}

export default App