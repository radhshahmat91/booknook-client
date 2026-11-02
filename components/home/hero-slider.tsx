"use client";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Shelf from "@/components/shelf";

const SLIDES = [
  {
    bg: "#2B3FD6",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=85",
    title: "Add a book.\nBorrow a book.\nReturn a book.",
    text: "BookNook is a small community library. Every shelf is filled by readers like you, and every book can come home with you for a few days.",
    palette: ["#FFD54A", "#FFB6C9", "#8EE0BD", "#FFFFFF", "#9CC8FF", "#FF9248", "#FFD54A"],
  },
  {
    bg: "#0B6B53",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=85",
    title: "Find the story you've been looking for.",
    text: "Fiction, science, history and kids' picks, all added by the community. Browse the shelves and borrow whatever catches your eye.",
    palette: ["#FFB6C9", "#FFD54A", "#FFFFFF", "#9CC8FF", "#FF9248", "#8EE0BD", "#FFB6C9"],
  },
  {
    bg: "#7A2A8E",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=85",
    title: "Finished a book? Put it back on the shelf.",
    text: "Lend the books you've already loved. Add them to BookNook and let someone else enjoy them for a few days.",
    palette: ["#8EE0BD", "#FFD54A", "#FFB6C9", "#FFFFFF", "#FF9248", "#9CC8FF", "#FFD54A"],
  },
];

const group: Variants = { hide: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const line: Variants = {
  hide: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Slide({ slide }: { slide: (typeof SLIDES)[number] }) {
  const { isActive } = useSwiperSlide(); // text and shelf replay each time the slide becomes active
  return (
    <div className="relative isolate h-full overflow-hidden text-white" style={{ background: slide.bg }}>
      <div aria-hidden="true" className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `linear-gradient(90deg, ${slide.bg} 0%, transparent 100%), url(${slide.image})`, backgroundPosition: "center", backgroundSize: "cover" }} />
      <div className="wrap relative z-10 grid h-full items-center gap-6 py-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-10">
        <motion.div initial="hide" animate={isActive ? "show" : "hide"} variants={group} className="max-w-2xl">
          <motion.h2 variants={line} className="text-balance whitespace-pre-line text-4xl font-extrabold sm:text-6xl lg:text-7xl">
            {slide.title}
          </motion.h2>
          <motion.p variants={line} className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
            {slide.text}
          </motion.p>
          <motion.div variants={line} className="mt-9">
            <Link href="/books" className="btn btn-accent btn-lg rounded-full px-9">
              Browse Books
            </Link>
          </motion.div>
        </motion.div>
        <Shelf palette={slide.palette} active={isActive} />
      </div>
    </div>
  );
}

export default function HeroSlider() {
  return (
    <section aria-label="Featured">
      <Swiper
        className="hero-swiper h-[780px] sm:h-[700px] lg:h-[640px]"
        modules={[A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        rewind
        keyboard
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        a11y={{ prevSlideMessage: "Previous slide", nextSlideMessage: "Next slide" }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.bg}>
            <Slide slide={s} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
