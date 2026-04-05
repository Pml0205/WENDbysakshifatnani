import { Link } from "react-router-dom";
import { motion } from "motion/react";

const imageModules = import.meta.glob("../../assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const imageEntries = Object.entries(imageModules).sort(([firstPath], [secondPath]) =>
  firstPath.localeCompare(secondPath),
);

function pickImage(folderName: string, fallbackIndex = 0) {
  const matching = imageEntries.filter(([path]) => path.includes(`/${folderName}/`));

  if (matching.length > 0) {
    return matching[Math.min(fallbackIndex, matching.length - 1)][1];
  }

  return imageEntries[fallbackIndex]?.[1] ?? "";
}

const imgImageMinimalistLivingRoom = pickImage("Living Room", 1);
const imgImageModernInteriorDesign = pickImage("Bedrooms", 2);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <motion.img
                  src={imgImageMinimalistLivingRoom}
                  alt="Interior design workspace"
                  className="w-full h-[600px] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-[#072c3c] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
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
                We believe that great design is not just about following trends—it's about understanding 
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
                With a degree in architecture and years of experience in residential and commercial design, 
                Sakshi brings a unique perspective that blends technical expertise with artistic sensibility. 
                Her passion for material exploration and spatial storytelling has shaped WEND into a studio 
                known for creating spaces that resonate on both aesthetic and emotional levels.
              </motion.p>
              <motion.p
                className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                "Design is not just about making things look beautiful—it's about creating environments 
                that support and enhance the way people live, work, and connect with each other."
              </motion.p>
            </motion.div>

            <motion.div
              className="relative group order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <motion.img
                  src={imgImageModernInteriorDesign}
                  alt="Sakshi Fatnani"
                  className="w-full h-[600px] object-cover"
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