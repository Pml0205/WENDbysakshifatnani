import { motion } from "motion/react";
import SakshiFatnani from "../../assets/Sakshi_Fatnani.png";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* About Header */}
      <section className="bg-[#072c3c] py-20">
        <div className="container mx-auto px-8 text-center">
          <motion.h1
            className="font-['Arimo:Regular',sans-serif] text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="font-['Arimo:Regular',sans-serif] text-xl text-[#99a1af] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Creating timeless spaces that inspire and elevate everyday living
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative mx-auto flex h-[560px] w-full max-w-[780px] items-center justify-center overflow-hidden rounded-lg bg-white p-7 shadow-2xl">
                <motion.img
                  src="/logo.png"
                  alt="WEND Logo"
                  className="block h-auto w-full max-w-[680px] object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-[#072c3c] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6 lg:pt-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="font-['Arimo:Regular',sans-serif] text-5xl text-[#0a0a0a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Our Story
              </motion.h2>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                WEND by Sakshi Fatnani was founded with a simple yet profound vision: to create 
                spaces that don't just look beautiful, but feel extraordinary. With a background 
                in architecture and a passion for material exploration, we've built a studio that 
                bridges the gap between aesthetic excellence and functional living.
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Our approach combines timeless design principles with contemporary aesthetics, 
                ensuring every project stands the test of time while remaining relevant and inspiring. 
                We believe that great design is not just about following trends, it's about understanding 
                people, their stories, and creating environments that enhance their lives.
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                From concept to completion, we're committed to excellence in every detail, 
                ensuring that each project reflects our dedication to quality, creativity, and client satisfaction.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6 order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="font-['Arimo:Regular',sans-serif] text-5xl text-[#0a0a0a]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Sakshi Fatnani
              </motion.h2>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-xl text-[#072c3c] italic"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Founder & Principal Designer
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                An Interior Designer committed and exuberant about designing, developing conceptualization, and visualization skills. Always eager to acquire knowledge and explore prolific, modernist approaches to design.
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Armed with a Bachelor's Degree (Hons) in Interior Design from Raffles Design Institute, Singapore under Coventry University, UK, bringing a strong foundation in design theory and practice. Her expertise spans residential, commercial, and hotel design proposals.
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                With hands-on experience across planning, construction drawings, material selection, 3D perspective renders, and presentations, she excels at transforming conceptual ideas into tangible, inspiring spaces that enhance the way people live and work.
              </motion.p>
            </motion.div>

            <motion.div
              className="relative group order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative mx-auto max-w-[380px] overflow-hidden rounded-lg bg-white p-4 shadow-2xl">
                <motion.img
                  src={SakshiFatnani}
                  alt="Sakshi Fatnani"
                  className="block h-auto w-full object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-[#072c3c] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}