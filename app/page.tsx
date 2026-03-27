import { Suspense } from 'react';
import VideoHero from '@/components/VideoHero';
import HeroSlider from '@/components/HeroSlider';
import CategoryGrid from '@/components/CategoryGrid';
import RecentlyViewed from '@/components/RecentlyViewed';
import MayoristaBanner from '@/components/MayoristaBanner';
import CitiesSection from '@/components/CitiesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CityGuideBanner from '@/components/CityGuideBanner';
import InfoBanners from '@/components/InfoBanners';
import AlliesSection from '@/components/AlliesSection';

export default function Home() {
  return (
    <div style={{ paddingTop: '140px' }} className="bg-navy">
      <VideoHero />
      <HeroSlider />
      <CategoryGrid />
      <FeaturedProducts />
      <AlliesSection />
      <CityGuideBanner />
      <MayoristaBanner />
      <CitiesSection />
      <InfoBanners />
      <RecentlyViewed />
    </div>
  );
}
