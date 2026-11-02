import type { Metadata } from "next";
import HeroSlider from "@/components/home/hero-slider";
import Marquee from "@/components/home/marquee";
import NewArrivals from "@/components/home/new-arrivals";
import HowItWorks from "@/components/home/how-it-works";
import Categories from "@/components/home/categories";
import Reviews from "@/components/home/reviews";
import Cta from "@/components/home/cta";

export const metadata: Metadata = { title: "BookNook | Home" };

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">BookNook, a small online library</h1>
      <HeroSlider />
      <Marquee />
      <NewArrivals />
      <HowItWorks />
      <Categories />
      <Reviews />
      <Cta />
    </>
  );
}
