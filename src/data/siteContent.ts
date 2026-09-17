import { NewsItem, FaqItem } from '../types';

export const LATEST_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'The Coca-Cola Company Announces 2026 Global International Talent Initiative',
    date: 'September 12, 2026',
    category: 'Careers & Mobility',
    snippet: 'Expanding international career pathways across 160+ countries, offering cross-border leadership rotations and comprehensive relocation support.',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-2',
    title: 'Global Sustainability Milestone: Advancing 100% Circular Packaging',
    date: 'August 28, 2026',
    category: 'Sustainability',
    snippet: 'Our global bottling network achieved significant reduction in virgin plastic, pairing innovation with responsible stewardship worldwide.',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'news-3',
    title: 'Innovating Refreshment: Digital Supply Chain Expansion Across 5 Continents',
    date: 'August 14, 2026',
    category: 'Innovation',
    snippet: 'Investing in cutting-edge logistics, automated warehousing, and intelligent data systems to keep millions of partners refreshed daily.',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
  }
];

export const FAQS: FaqItem[] = [
  {
    question: 'Who is eligible to apply for international roles at Coca-Cola?',
    answer: 'Any qualified candidate globally is eligible. We hire diverse talents across all recognized nationalities for roles spanning supply chain, marketing, brand management, engineering, finance, and global digital technology.'
  },
  {
    question: 'What documents are required during the registration?',
    answer: 'To complete initial registration, you only need your full legal name, active email, gender, nationality, birth date, official passport number, and an identifiable photo.'
  },
  {
    question: 'How are applicants reviewed and approved by the recruitment team?',
    answer: 'Applications undergo formal evaluation by our international talent acquisition committee. Applicants start in "Pending" status. Verified submissions are reviewed and assigned "Approved" or "Rejected" status by Coca-Cola HR administration.'
  },
  {
    question: 'Is international relocation and visa sponsorship supported?',
    answer: 'Yes. Candidates approved for international placement receive comprehensive legal visa sponsorship, international relocation assistance, and cross-cultural onboarding tailored to their host country.'
  },
  {
    question: 'How is candidate privacy and sensitive passport information protected?',
    answer: 'Phone numbers are strictly classified as private across all public listings. Passport credentials and personal dates are securely audited and restricted to authorized Coca-Cola HR administrators.'
  }
];

export const COUNTRIES_LIST = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Egypt',
  'France', 'Germany', 'Ghana', 'India', 'Indonesia', 'Italy', 'Japan', 'Jordan',
  'Kenya', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Philippines',
  'Poland', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Vietnam'
];
