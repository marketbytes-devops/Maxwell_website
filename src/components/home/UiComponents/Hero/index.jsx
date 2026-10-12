"use client";

import { motion } from "framer-motion";

export default function HeroBanner({
  badge,
  title,
  highlightedText,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  features,
  bgImage,
  bgVideo,
  stamp
}) {
  return (
    <div className="w-full flex justify-center bg-gray-50 font-inter overflow-hidden">
      <div 
        className="w-full max-w-[1728px] h-auto min-h-[600px] md:min-h-[750px] pt-[60px] md:pt-[80px] px-4 md:px-[40px] xl:px-[80px] pb-10 md:pb-0 flex flex-col gap-[35px] bg-cover bg-center bg-no-repeat relative mt-0 overflow-hidden"
        style={!bgVideo ? {
          backgroundImage: `
            linear-gradient(78.08deg, rgba(15, 23, 42, 0.69) 3.96%, rgba(0, 0, 0, 0) 97.47%),
            linear-gradient(96.45deg, rgba(0, 0, 0, 0.43) 11.54%, rgba(0, 0, 0, 0) 74.95%),
            url('${bgImage || "/banner.jpg"}') 
          `
        } : undefined}
      >
        {/* Background Video (if provided) */}
        {bgVideo && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={bgImage || "/bannerimage.webp"}
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
            {/* Gradient Overlay for Text Readability */}
            <div 
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background: `
                  linear-gradient(78.08deg, rgba(15, 23, 42, 0.75) 3.96%, rgba(0, 0, 0, 0.3) 97.47%),
                  linear-gradient(96.45deg, rgba(0, 0, 0, 0.5) 11.54%, rgba(0, 0, 0, 0.2) 74.95%)
                `
              }}
            />
          </>
        )}
        {/* Main Text Container */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col gap-[24px] w-full max-w-[800px]"
        >
          {badge && (
            <div className="w-fit border border-gray-400 rounded-full px-4 py-1.5 backdrop-blur-sm bg-black/20">
              <span className="text-white text-sm font-medium">{badge}</span>
            </div>
          )}

          <h1 
            className="text-[#FFFFFF] w-full text-[36px] md:text-[56px] leading-[1.2] md:leading-[115%]"
            style={{ 
              fontFamily: "'42dot Sans', sans-serif", 
              fontWeight: 800, 
              letterSpacing: '-0.02em'
            }}
          >
            {title} {highlightedText && <span className="text-[#E11D48]">{highlightedText}</span>}
          </h1>

          <p 
            className="text-[#F1F5F9] w-full"
            style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 300, 
              fontSize: '18px', 
              lineHeight: '160%'
            }}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* Buttons Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-wrap md:flex-nowrap items-center gap-[16px] w-full max-w-[415px] h-auto mt-2"
        >
          {primaryButtonText && (
            <button 
              className="flex items-center justify-center bg-[#E11D48] text-white hover:bg-red-700 transition-colors w-full sm:w-[197px] h-[56px] rounded-[8px] py-[16px] px-[32px] gap-[8px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {primaryButtonText}
            </button>
          )}
          
          {secondaryButtonText && (
            <button 
              className="flex items-center justify-center bg-transparent border border-white text-white hover:bg-white/10 transition-colors w-full sm:w-[202px] h-[56px] rounded-[8px] py-[16px] px-[32px] gap-[8px]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {secondaryButtonText}
            </button>
          )}
        </motion.div>

        {/* Bottom Features Bar */}
        {features && features.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-[825px] h-auto gap-4 mt-6 md:mt-0"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                {feature.icon}
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>{feature.text}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tilted Stamp (e.g. Built for Professional Performance) */}
        {stamp && (
          <div 
            className="absolute z-10 hidden xl:flex items-center justify-center pointer-events-none"
            style={{
              width: stamp.width || '300px',
              height: stamp.height || '159px',
              top: stamp.top,
              left: stamp.left,
              right: stamp.right,
              bottom: stamp.bottom,
              transform: `rotate(${stamp.angle || '-19.01deg'})`
            }}
          >
            {stamp.content}
          </div>
        )}
      </div>
    </div>
  );
}
