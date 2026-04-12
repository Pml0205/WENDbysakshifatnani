/// <reference types="vite/client" />
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Home as HomeIcon,
  Ruler,
  Sparkles,
} from "lucide-react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
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

function pickImages(folderName: string, limit = 4) {
  const matching = imageEntries
    .filter(([path]) => path.includes(`/${folderName}/`))
    .map(([, src]) => src)
    .filter(Boolean);

  return matching.slice(0, limit);
}

const imgHeroBackground = pickImage("Living Room", 0);
const imgInteriorOne = pickImage("Bedrooms", 0);
const imgInteriorTwo = pickImage("Kitchen & dining", 0);
const imgInteriorThree = pickImage("Lobby", 0);
const imgInteriorFour = pickImage("Cafe", 0);
const imgInteriorFive = pickImage("Pilate studio- Alcore", 0);
const imgInteriorSix = pickImage("Living Room", 2);

const fallbackHeroImages = [
  { src: imgHeroBackground, alt: "Elegant neutral-toned living room" },
  { src: imgInteriorOne, alt: "Minimalist interior with statement lighting" },
  { src: imgInteriorTwo, alt: "Luxury kitchen with modern finishes" },
  { src: imgInteriorThree, alt: "Contemporary bedroom with layered textures" },
  { src: imgInteriorFour, alt: "Designer lounge with curated materials" },
  { src: imgInteriorFive, alt: "Boutique wellness interior with natural palette" },
  { src: imgInteriorSix, alt: "Modern living space with sculptural decor" },
].filter((image) => Boolean(image.src));

const publicHeroImages = [
  { src: "/1.png", alt: "WEND hero interior 1" },
  { src: "/2.png", alt: "WEND hero interior 2" },
  { src: "/3.png", alt: "WEND hero interior 3" },
  { src: "/4.png", alt: "WEND hero interior 4" },
  { src: "/5.png", alt: "WEND hero interior 5" },
  { src: "/6.png", alt: "WEND hero interior 6" },
  { src: "/7.png", alt: "WEND hero interior 7" },
  { src: "/8.png", alt: "WEND hero interior 8" },
  { src: "/9.png", alt: "WEND hero interior 9" },
  { src: "/10.png", alt: "WEND hero interior 10" },
];

const curatedAssetGalleryImages = [
  ...pickImages("Living Room", 2),
  ...pickImages("Bedrooms", 2),
  ...pickImages("Kitchen & dining", 2),
  ...pickImages("Lobby", 2),
  ...pickImages("Cafe", 2),
  ...pickImages("Pilate studio- Alcore", 2),
].filter(Boolean);

export default function Home() {
  const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (isMounted) {
          setProjects(data);
          setProjectsError("");
        }
      } catch (error) {
        if (isMounted) {
          setProjects([]);
          setProjectsError(error instanceof Error ? error.message : "Failed to load projects.");
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!heroCarouselApi) {
      return;
    }

    const autoplayInterval = window.setInterval(() => {
      heroCarouselApi.scrollNext();
    }, 4000);

    return () => {
      window.clearInterval(autoplayInterval);
    };
  }, [heroCarouselApi]);

  const projectImagePool = projects.flatMap((project) =>
    project.images.map((imageUrl) => ({
      src: imageUrl,
      alt: `${project.title} interior design image`,
    })),
  );

  const heroCarouselImages = publicHeroImages;

  const serviceItems = [
    {
      icon: HomeIcon,
      title: "Residential Design",
      description:
        "Personalized interiors crafted for comfort, function, and timeless beauty in every room.",
    },
    {
      icon: Building2,
      title: "Commercial Spaces",
      description:
        "High-impact spaces for offices, hospitality, and retail that align with your brand vision.",
    },
    {
      icon: Ruler,
      title: "Space Planning",
      description:
        "Strategic layouts that optimize flow, storage, and usability while elevating aesthetics.",
    },
    {
      icon: Sparkles,
      title: "Styling & Consultation",
      description:
        "Expert guidance on materials, finishes, furniture, and styling for a cohesive final look.",
    },
  ];

  const featuredProjects =
    projects.length > 0
      ? projects.slice(0, 3).map((project) => ({
          img: project.images[0] ?? imgHeroBackground,
          title: project.title,
          category: project.category || "Interior",
        }))
      : [
          {
            img: imgHeroBackground,
            title: "Luxury Villa Renovation",
            category: "Residential",
          },
          {
            img: imgInteriorTwo,
            title: "Dining Experience Redesign",
            category: "Residential",
          },
          {
            img: imgInteriorOne,
            title: "Master Bedroom Makeover",
            category: "Residential",
          },
        ];

  const testimonials = [
    {
      name: "Rhea Malhotra",
      project: "Residential Renovation",
      review:
        "Wend translated our ideas into a calm, luxurious home with incredible attention to detail.",
    },
    {
      name: "Arjun Mehta",
      project: "Commercial Workspace",
      review:
        "The team balanced brand identity and functionality beautifully. The office now feels inspiring.",
    },
    {
      name: "Sana Kapoor",
      project: "Styling & Consultation",
      review:
        "Every material and finish was thoughtfully selected. The final result feels polished and effortless.",
    },
  ];

  const galleryImages = [
    ...projectImagePool.map((image) => image.src),
    ...curatedAssetGalleryImages,
  ]
    .filter((src, index, arr) => src && arr.indexOf(src) === index)
    .slice(0, 12);

  return (
    <>
      <section
        className="relative h-[100svh] min-h-[100svh] overflow-hidden"
        id="home"
      >
        <Carousel
          setApi={setHeroCarouselApi}
          opts={{ loop: true }}
          className="absolute inset-0 h-full w-full"
        >
          <CarouselContent className="ml-0 h-full">
            {heroCarouselImages.map((image, index) => (
              <CarouselItem key={index} className="h-[100svh] min-h-[100svh] bg-[#0f2430] pl-0">
                <div
                  role="img"
                  aria-label={image.alt}
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url("${image.src}")` }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 top-1/2 z-20 hidden -translate-y-1/2 border-white/70 bg-white/90 text-[#072c3c] hover:bg-white sm:inline-flex" />
          <CarouselNext className="right-4 top-1/2 z-20 hidden -translate-y-1/2 border-white/70 bg-white/90 text-[#072c3c] hover:bg-white sm:inline-flex" />
        </Carousel>

        <div className="absolute inset-0 z-10 bg-[#072c3c]/55" />

        <div className="relative z-20 flex h-full w-full items-center justify-center px-6 lg:px-8">
          <motion.div
            className="max-w-3xl space-y-5 text-center sm:space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-['Arimo:Regular',sans-serif] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Designing Spaces and Exploring Materials
            </h1>
            <p className="mx-auto max-w-md font-['Arimo:Regular',sans-serif] text-base text-white/90 sm:max-w-xl sm:text-lg">
              We create sophisticated interiors that blend form, function, and atmosphere for modern living.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sm bg-[#072c3c] px-8 py-4 font-['Arimo:Regular',sans-serif] text-lg text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0a3d52]"
            >
              Start Your Project
              <ArrowRight className="size-5" />
            </Link>
            {projectsError ? (
              <p className="text-sm text-white/80">Showing fallback content: {projectsError}</p>
            ) : null}
          </motion.div>
        </div>
      </section>

      <section className="py-20" id="services">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a] sm:text-5xl">Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {serviceItems.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card className="h-full rounded-xl border-white/60 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <CardHeader className="space-y-3">
                      <div className="inline-flex size-11 items-center justify-center rounded-full bg-[#072c3c]/10 text-[#072c3c]">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="font-['Arimo:Regular',sans-serif] text-2xl text-[#0a0a0a]">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="font-['Arimo:Regular',sans-serif] text-base leading-relaxed text-[#4a5565]">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-3 font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a] sm:text-5xl">
              Featured Work
            </h2>
            <p className="font-['Arimo:Regular',sans-serif] text-lg text-[#4a5565]">
              A quick look at some of our recent projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-['Arimo:Regular',sans-serif] text-2xl text-[#0a0a0a]">
                      {project.title}
                    </h3>
                    <span className="rounded bg-[#072c3c] px-3 py-1 text-xs text-white">
                      {project.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-block rounded-sm bg-[#072c3c] px-8 py-3 text-white transition-colors duration-300 hover:bg-[#0a3d52]"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f9fafb] py-20" id="about">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="/logo.png"
                alt="WEND logo"
                className="h-[480px] w-full object-contain bg-white p-6"
              />
            </motion.div>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a] sm:text-5xl">About Us</h2>
              <p className="font-['Arimo:Regular',sans-serif] text-lg leading-relaxed text-[#4a5565]">
                Our design philosophy combines refined materials, balanced proportions, and meaningful details to craft spaces that feel both elevated and deeply personal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f6ff] py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a] sm:text-5xl">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card className="h-full rounded-xl border-white/70 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-['Arimo:Regular',sans-serif] text-2xl text-[#0a0a0a]">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="font-['Arimo:Regular',sans-serif] text-sm text-[#072c3c]">
                      {item.project}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-['Arimo:Regular',sans-serif] text-base leading-relaxed text-[#4a5565]">
                      {item.review}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Arimo:Regular',sans-serif] text-4xl text-[#0a0a0a] sm:text-5xl">
              Design Gallery
            </h2>
          </motion.div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {galleryImages.map((image, index) => (
              <Dialog key={`${image}-${index}`}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-xl shadow-md"
                  >
                    <img
                      src={image}
                      alt={`Gallery interior ${index + 1}`}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
                  <img
                    src={image}
                    alt={`Gallery preview ${index + 1}`}
                    className="max-h-[82vh] w-full rounded-xl object-contain"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#072c3c] py-20">
        <div className="container mx-auto px-6 text-center lg:px-8">
          <motion.h2
            className="mb-4 font-['Arimo:Regular',sans-serif] text-4xl text-white sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Space?
          </motion.h2>
          <motion.p
            className="mx-auto mb-8 max-w-2xl font-['Arimo:Regular',sans-serif] text-lg text-white/85"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Let’s collaborate on a space that reflects your lifestyle, goals, and design aspirations.
          </motion.p>
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-white px-8 py-3 text-white transition-colors duration-300 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
