import React from "react";
import { motion } from "motion/react";
import { fetchProjects, WebsiteProject } from "../lib/api";

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

function pickImages(folderName: string, fallbackIndex = 0, maxImages = 4) {
  const matching = imageEntries
    .filter(([path]) => path.includes(`/${folderName}/`))
    .map(([, src]) => src)
    .slice(0, maxImages);

  if (matching.length > 0) {
    return matching;
  }

  const fallbackImage = imageEntries[fallbackIndex]?.[1] ?? "";
  return fallbackImage ? [fallbackImage] : [];
}

type ProjectViewModel = {
  images: string[];
  title: string;
  category: string;
  description: string;
  location: string;
  features: string[];
};

const PROJECT_FILTER_CATEGORIES = ["Residential", "Commercial", "Hospitality", "Wellness"] as const;

function normalizeProjectCategory(rawCategory?: string) {
  const trimmedCategory = rawCategory?.trim();
  if (!trimmedCategory) {
    return "Residential";
  }

  if (PROJECT_FILTER_CATEGORIES.includes(trimmedCategory as (typeof PROJECT_FILTER_CATEGORIES)[number])) {
    return trimmedCategory;
  }

  const loweredCategory = trimmedCategory.toLowerCase();

  if (["living room", "bedroom", "kitchen", "dining", "residential", "home", "apartment", "villa"].some((keyword) => loweredCategory.includes(keyword))) {
    return "Residential";
  }

  if (["office", "studio", "workspace", "retail", "corporate", "commercial"].some((keyword) => loweredCategory.includes(keyword))) {
    return "Commercial";
  }

  if (["cafe", "lobby", "hotel", "hospitality", "restaurant", "bar"].some((keyword) => loweredCategory.includes(keyword))) {
    return "Hospitality";
  }

  if (["wellness", "pilates", "yoga", "spa", "gym", "clinic"].some((keyword) => loweredCategory.includes(keyword))) {
    return "Wellness";
  }

  return "Residential";
}

const fallbackProjects: ProjectViewModel[] = [
  {
    images: pickImages("Bedrooms", 2),
    title: "Private Residence Suite",
    category: "Residential",
    description: "A calm and layered bedroom program designed around comfort, integrated lighting, and tailored storage that enhances day-to-day living.",
    location: "Mumbai, Maharashtra",
    features: ["Layered Lighting", "Bespoke Wardrobes", "Soft Acoustics", "Material Harmony"],
  },
  {
    images: pickImages("Living Room", 1),
    title: "Urban Family Living",
    category: "Residential",
    description: "An open living zone that connects lounge and conversation areas with warm textures, contemporary lines, and high visual continuity.",
    location: "Nashik, Maharashtra",
    features: ["Open Layout", "Statement Ceiling", "Natural Textures", "Custom Joinery"],
  },
  {
    images: pickImages("Kitchen & dining", 0),
    title: "Kitchen and Dining Redesign",
    category: "Residential",
    description: "A practical and elegant kitchen-dining transformation with focused workflow planning, durable finishes, and layered ambient lighting.",
    location: "Pune, Maharashtra",
    features: ["Workflow Planning", "Durable Surfaces", "Ambient Lighting", "Integrated Storage"],
  },
  {
    images: pickImages("Lobby", 0),
    title: "Corporate Lobby Experience",
    category: "Commercial",
    description: "A high-impact reception and waiting experience built with clean geometry, directional lighting, and premium materials to strengthen first impressions.",
    location: "Pune, Maharashtra",
    features: ["Reception Identity", "Directional Lighting", "Premium Surfaces", "Visitor Flow"],
  },
  {
    images: pickImages("Cafe", 1),
    title: "Cafe Interior Experience",
    category: "Hospitality",
    description: "A compact hospitality space designed for high turnover and memorable ambience with curated textures, flexible seating, and warm branding cues.",
    location: "Nashik, Maharashtra",
    features: ["Flexible Seating", "Lighting Layers", "Brand-led Palette", "Service Efficiency"],
  },
  {
    images: pickImages("Pilate studio- Alcore", 2),
    title: "Pilates Studio at Alcore",
    category: "Wellness",
    description: "A movement-focused studio with clear circulation, calming tones, and spatial rhythm that supports both private and group training sessions.",
    location: "Mumbai, Maharashtra",
    features: ["Studio Zoning", "Calming Palette", "Training Flexibility", "Clean Detailing"],
  },
];

export default function Projects() {
  const [filter, setFilter] = React.useState<string>("All");
  const [projects, setProjects] = React.useState<ProjectViewModel[]>(fallbackProjects);
  const [projectError, setProjectError] = React.useState("");
  const [activeSlides, setActiveSlides] = React.useState<Record<number, number>>({});
  const [lightboxProjectIndex, setLightboxProjectIndex] = React.useState<number | null>(null);
  const [lightboxSlideIndex, setLightboxSlideIndex] = React.useState(0);
  const touchStartX = React.useRef<Record<number, number>>({});
  const lightboxTouchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (!mounted || data.length === 0) {
          return;
        }

        const mapped: ProjectViewModel[] = data.map((item: WebsiteProject) => {
          const normalizedCategory = normalizeProjectCategory(item.category);

          return {
            images:
              Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : pickImages("Living Room", 0),
            title: item.title,
            category: normalizedCategory,
            description: item.description,
            location: item.location?.trim() || "Location available on request",
            features: ["Tailored Design", "Material Planning", "Execution Support", "Client-first Process"],
          };
        });

        setProjects(mapped);
        setProjectError("");
      } catch (error) {
        setProjectError(error instanceof Error ? error.message : "Failed to load projects.");
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredProjects = projects;

  const getActiveSlide = React.useCallback(
    (projectIndex: number, totalImages: number) => {
      const current = activeSlides[projectIndex] ?? 0;
      if (totalImages <= 0) {
        return 0;
      }

      return Math.min(current, totalImages - 1);
    },
    [activeSlides],
  );

  const goToSlide = React.useCallback((projectIndex: number, nextIndex: number, totalImages: number) => {
    if (totalImages <= 0) {
      return;
    }

    const normalized = ((nextIndex % totalImages) + totalImages) % totalImages;
    setActiveSlides((previous) => ({ ...previous, [projectIndex]: normalized }));
  }, []);

  const onTouchStart = React.useCallback((projectIndex: number, clientX: number) => {
    touchStartX.current[projectIndex] = clientX;
  }, []);

  const onTouchEnd = React.useCallback(
    (projectIndex: number, clientX: number, totalImages: number) => {
      const startX = touchStartX.current[projectIndex];
      if (typeof startX !== "number") {
        return;
      }

      const deltaX = startX - clientX;
      const swipeThreshold = 40;
      const currentSlide = getActiveSlide(projectIndex, totalImages);

      if (Math.abs(deltaX) < swipeThreshold) {
        return;
      }

      if (deltaX > 0) {
        goToSlide(projectIndex, currentSlide + 1, totalImages);
      } else {
        goToSlide(projectIndex, currentSlide - 1, totalImages);
      }
    },
    [getActiveSlide, goToSlide],
  );

  const openLightbox = React.useCallback((projectIndex: number, slideIndex: number) => {
    setLightboxProjectIndex(projectIndex);
    setLightboxSlideIndex(slideIndex);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setLightboxProjectIndex(null);
    setLightboxSlideIndex(0);
    lightboxTouchStartX.current = null;
  }, []);

  const goToLightboxSlide = React.useCallback((nextIndex: number, totalImages: number) => {
    if (totalImages <= 0) {
      return;
    }

    const normalized = ((nextIndex % totalImages) + totalImages) % totalImages;
    setLightboxSlideIndex(normalized);
  }, []);

  const onLightboxTouchStart = React.useCallback((clientX: number) => {
    lightboxTouchStartX.current = clientX;
  }, []);

  const onLightboxTouchEnd = React.useCallback(
    (clientX: number, totalImages: number) => {
      if (typeof lightboxTouchStartX.current !== "number") {
        return;
      }

      const deltaX = lightboxTouchStartX.current - clientX;
      const swipeThreshold = 40;

      if (Math.abs(deltaX) < swipeThreshold) {
        return;
      }

      if (deltaX > 0) {
        goToLightboxSlide(lightboxSlideIndex + 1, totalImages);
      } else {
        goToLightboxSlide(lightboxSlideIndex - 1, totalImages);
      }
    },
    [goToLightboxSlide, lightboxSlideIndex],
  );

  // compute filtered list based on current filter
  const filteredProjects = React.useMemo(() => {
    if (filter === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === filter);
  }, [filter, featuredProjects]);

  return (
    <div className="gallery-theme-scope min-h-screen transition-colors duration-500">
      {/* Projects Header */}
      <section className="bg-[#072c3c] py-20">
        <div className="container mx-auto px-8 text-center">
          <motion.h1
            className="font-['Arimo:Regular',sans-serif] text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Featured Projects
          </motion.h1>
          <motion.p
            className="font-['Arimo:Regular',sans-serif] text-xl text-[#99a1af] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforming visions into reality through thoughtful design, innovative solutions, and exceptional craftsmanship
          </motion.p>
          {projectError ? (
            <p className="mt-3 text-sm text-[#d9dde2]">Showing saved design entries while live data loads: {projectError}</p>
          ) : null}
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white py-8 border-b border-[#d1d5dc]">
        <div className="container mx-auto px-8">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {["All", ...PROJECT_FILTER_CATEGORIES].map((tab) => (
              <motion.button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-['Arimo:Regular',sans-serif] ${
                  filter === tab
                    ? "bg-[#072c3c] text-white"
                    : "bg-[#f3f6ff] text-[#072c3c] hover:bg-[#072c3c] hover:text-white"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="space-y-24">
            {filteredProjects.map((project, index) => {
              const totalImages = project.images.length;
              const activeSlide = getActiveSlide(index, totalImages);
              const activeImage = project.images[activeSlide] ?? pickImage("Living Room", 0);

              return (
              <motion.div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {/* Image */}
                <motion.div
                  className={`relative group ${
                    index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-2xl"
                    onTouchStart={(event) => onTouchStart(index, event.touches[0].clientX)}
                    onTouchEnd={(event) => onTouchEnd(index, event.changedTouches[0].clientX, totalImages)}
                  >
                    <motion.img
                      key={`${project.title}-${activeSlide}`}
                      src={activeImage}
                      alt={project.title}
                      className="gallery-image h-[500px] w-full cursor-zoom-in object-cover"
                      onClick={() => openLightbox(index, activeSlide)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                    />
                    <div className="gallery-day-overlay pointer-events-none" aria-hidden="true"></div>
                    <div className="gallery-night-overlay pointer-events-none" aria-hidden="true"></div>
                    <div className="gallery-night-lamp-glow pointer-events-none" aria-hidden="true"></div>
                    <div className="pointer-events-none absolute inset-0 bg-[#072c3c] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>

                    {totalImages > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label={`Previous image for ${project.title}`}
                          onClick={() => goToSlide(index, activeSlide - 1, totalImages)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white backdrop-blur-sm transition hover:bg-black/65"
                        >
                          &lt;
                        </button>
                        <button
                          type="button"
                          aria-label={`Next image for ${project.title}`}
                          onClick={() => goToSlide(index, activeSlide + 1, totalImages)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-white backdrop-blur-sm transition hover:bg-black/65"
                        >
                          &gt;
                        </button>

                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                          {project.images.map((_, imageIndex) => (
                            <button
                              key={`${project.title}-dot-${imageIndex}`}
                              type="button"
                              aria-label={`Go to image ${imageIndex + 1} for ${project.title}`}
                              onClick={() => goToSlide(index, imageIndex, totalImages)}
                              className={`h-2.5 w-2.5 rounded-full transition ${
                                activeSlide === imageIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>

                </motion.div>

                {/* Content */}
                <motion.div
                  className={`space-y-6 ${
                    index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <span className="bg-[#072c3c] text-white px-4 py-1 rounded text-sm">
                      {project.category}
                    </span>
                    <span className="text-[#4a5565] text-sm">
                      {project.location}
                    </span>
                  </motion.div>

                  <motion.h2
                    className="font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {project.title}
                  </motion.h2>

                  <motion.p
                    className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565] leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <h3 className="font-['Arimo:Regular',sans-serif] text-[#072c3c] mb-3">
                      Key Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, i) => (
                        <motion.span
                          key={i}
                          className="bg-white border border-[#d1d5dc] px-3 py-1 rounded-full text-sm text-[#4a5565]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                          whileHover={{ scale: 1.1, backgroundColor: "#072c3c", color: "#ffffff" }}
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {lightboxProjectIndex !== null && filteredProjects[lightboxProjectIndex] ? (() => {
        const project = filteredProjects[lightboxProjectIndex];
        const totalImages = project.images.length;
        const currentImage = project.images[lightboxSlideIndex] ?? project.images[0] ?? "";

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6"
            onClick={closeLightbox}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeLightbox();
              }
              if (event.key === "ArrowLeft") {
                goToLightboxSlide(lightboxSlideIndex - 1, totalImages);
              }
              if (event.key === "ArrowRight") {
                goToLightboxSlide(lightboxSlideIndex + 1, totalImages);
              }
            }}
            role="presentation"
            tabIndex={-1}
          >
            <div className="relative flex w-full max-w-6xl flex-col gap-4" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                aria-label="Close image viewer"
                onClick={closeLightbox}
                className="absolute -top-2 right-0 z-10 rounded-full bg-white/90 px-4 py-2 text-[#072c3c] shadow-lg transition hover:bg-white"
              >
                Close
              </button>

              <div className="relative overflow-hidden rounded-2xl bg-[#0f1720] shadow-2xl">
                <div
                  className="flex items-center justify-center"
                  onTouchStart={(event) => onLightboxTouchStart(event.touches[0].clientX)}
                  onTouchEnd={(event) => onLightboxTouchEnd(event.changedTouches[0].clientX, totalImages)}
                >
                  <img
                    src={currentImage}
                    alt={project.title}
                    className="max-h-[80vh] w-full object-contain"
                  />
                </div>

                {totalImages > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label={`Previous image for ${project.title}`}
                      onClick={() => goToLightboxSlide(lightboxSlideIndex - 1, totalImages)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl leading-none text-[#072c3c] shadow-lg transition hover:bg-white"
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      aria-label={`Next image for ${project.title}`}
                      onClick={() => goToLightboxSlide(lightboxSlideIndex + 1, totalImages)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl leading-none text-[#072c3c] shadow-lg transition hover:bg-white"
                    >
                      &gt;
                    </button>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-4 py-2 backdrop-blur-sm">
                      {project.images.map((_, imageIndex) => (
                        <button
                          key={`${project.title}-lightbox-dot-${imageIndex}`}
                          type="button"
                          aria-label={`Go to image ${imageIndex + 1} for ${project.title}`}
                          onClick={() => goToLightboxSlide(imageIndex, totalImages)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            lightboxSlideIndex === imageIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })() : null}

      {/* Process Section */}
      <section className="bg-[#f9fafb] py-20">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Arimo:Regular',sans-serif] text-5xl text-[#0a0a0a] mb-4">
              Our Process
            </h2>
            <p className="font-['Arimo:Regular',sans-serif] text-xl text-[#4a5565]">
              A collaborative approach from concept to completion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "Understanding your vision, needs, and lifestyle"
              },
              {
                step: "02",
                title: "Design",
                description: "Creating concepts that bring your vision to life"
              },
              {
                step: "03",
                title: "Development",
                description: "Refining details and selecting materials"
              },
              {
                step: "04",
                title: "Delivery",
                description: "Executing the design with precision and care"
              }
            ].map((phase, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <motion.div
                  className="text-5xl font-['Arimo:Regular',sans-serif] text-[#072c3c] opacity-20 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                >
                  {phase.step}
                </motion.div>
                <h3 className="font-['Arimo:Regular',sans-serif] text-2xl text-[#0a0a0a] mb-3">
                  {phase.title}
                </h3>
                <p className="font-['Arimo:Regular',sans-serif] text-[#4a5565]">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
