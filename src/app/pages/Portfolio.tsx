import React from "react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { fetchPortfolios, WebsitePortfolio } from "../lib/api";

const imageModules = import.meta.glob("../../assets/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function normalizeImageKey(path: string) {
  const nameWithExt = path.split("/").pop() ?? "";
  const base = nameWithExt.replace(/\.[^.]+$/, "");

  return base
    .toLowerCase()
    .replace(/\(\d+\)/g, "")
    .replace(/[_\-\s]+/g, " ")
    .trim();
}

function getFolderFromPath(path: string) {
  const match = path.match(/\.\.\/\.\.\/assets\/([^/]+)\//);
  return match?.[1] ?? "Portfolio";
}

function toCategoryLabel(folder: string) {
  return folder
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Portfolio() {
  const knownOrder = [
    "Bedrooms",
    "Living Room",
    "Kitchen & dining",
    "Lobby",
    "Cafe",
  ];

  const excludedFolders = new Set(["Pilate studio- Alcore"]);

  const grouped = new Map<string, Array<{ img: string; key: string }>>();

  Object.entries(imageModules)
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
    .forEach(([path, img]) => {
      const folder = getFolderFromPath(path);
      const key = normalizeImageKey(path);
      const current = grouped.get(folder) ?? [];

      if (current.some((item) => item.key === key)) {
        return;
      }

      current.push({ img, key });
      grouped.set(folder, current);
    })

  const fallbackCategoryGroups = Array.from(grouped.entries())
    .filter(([folder]) => !excludedFolders.has(folder))
    .sort(([a], [b]) => {
      const aIndex = knownOrder.indexOf(a);
      const bIndex = knownOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    })
    .map(([folder, items]) => ({
      title: toCategoryLabel(folder),
      images: items.map((item) => item.img),
    }))
    .filter((group) => group.images.length > 0);

  const [categoryGroups, setCategoryGroups] = React.useState(fallbackCategoryGroups);

  React.useEffect(() => {
    let mounted = true;

    const loadPortfolios = async () => {
      try {
        const data = await fetchPortfolios();

        if (!mounted || data.length === 0) {
          return;
        }

        const mapped = data
          .map((portfolio: WebsitePortfolio) => ({
            title: portfolio.title?.trim() || "Portfolio",
            images: Array.isArray(portfolio.images) ? portfolio.images.filter(Boolean) : [],
          }))
          .filter((group) => group.images.length > 0);

        if (mapped.length > 0) {
          setCategoryGroups(mapped);
        }
      } catch {
        // Keep fallback category groups when backend is unavailable.
      }
    };

    loadPortfolios();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="gallery-theme-scope min-h-screen transition-colors duration-500">
      {/* Portfolio Header */}
      <section className="bg-[#072c3c] py-20">
        <div className="container mx-auto px-8 text-center">
          <motion.h1
            className="font-['Arimo:Regular',sans-serif] text-6xl text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Portfolio
          </motion.h1>
          <motion.p
            className="font-['Arimo:Regular',sans-serif] text-xl text-[#99a1af] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore our collection of thoughtfully designed spaces that blend functionality with aesthetic excellence
          </motion.p>
        </div>
      </section>

      {/* Category Carousels */}
      <section className="py-20">
        <div className="container mx-auto space-y-16 px-8">
          {categoryGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="space-y-6"
            >
              <h2 className="font-['Arimo:Regular',sans-serif] text-3xl text-[#0a0a0a] sm:text-4xl">
                {group.title}
              </h2>

              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent>
                  {group.images.map((img, imageIndex) => (
                    <CarouselItem
                      key={`${group.title}-${imageIndex}`}
                      className="basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="relative overflow-hidden rounded-2xl shadow-md">
                        <img
                          src={img}
                          alt={`${group.title} interior`}
                          className="gallery-image h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
                        />
                        <div className="gallery-day-overlay" aria-hidden="true"></div>
                        <div className="gallery-night-overlay" aria-hidden="true"></div>
                        <div className="gallery-night-lamp-glow" aria-hidden="true"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 top-1/2 z-20 -translate-y-1/2 border-white/70 bg-white/90 text-[#072c3c] hover:bg-white" />
                <CarouselNext className="right-3 top-1/2 z-20 -translate-y-1/2 border-white/70 bg-white/90 text-[#072c3c] hover:bg-white" />
              </Carousel>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}