import { Suspense, lazy } from 'react';

// Lazy load section components
const IntroSection = lazy(() => import('./sections/IntroSection'));
const CompaniesSection = lazy(() => import('./sections/CompaniesSection'));
const ServicesSection = lazy(() => import('./sections/ServicesSection'));
const PortfolioSection = lazy(() => import('./sections/PortfolioSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

export default function HomeScreen() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IntroSection />
            <CompaniesSection />
            <ServicesSection />
            <PortfolioSection />
            <ContactSection />
        </Suspense>
    );
}