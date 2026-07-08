import type { ProfileActivityItem, ProfileDetails, ProfileStatistic } from '@/types/profile';

export const profileDetails: ProfileDetails = {
  name: 'Alex Morgan',
  email: 'alex@company.com',
  company: 'Acme Corp',
  role: 'Head of Product',
  location: 'San Francisco, CA',
  biography: 'Product leader passionate about AI, design systems, and building products that people love. Currently exploring the intersection of AI and productivity with cross-functional teams.',
  skills: ['AI/ML', 'Product Strategy', 'Design Systems', 'Startups', 'Writing', 'Analytics'],
  socials: [
    { id: 'linkedin', label: 'LinkedIn', url: 'linkedin.com/in/alexmorgan' },
    { id: 'github', label: 'GitHub', url: 'github.com/alexmorgan' },
    { id: 'website', label: 'Website', url: 'alexmorgan.design' },
  ],
  joined: 'November 2024',
  timezone: 'Pacific Time',
  plan: 'Pro',
};

export const profileStatistics: ProfileStatistic[] = [
  { label: 'Conversations', value: '1,247', change: '+18%' },
  { label: 'Documents', value: '89', change: '+12%' },
  { label: 'Hours Saved', value: '847h', change: '+34%' },
  { label: 'AI Score', value: '94/100', change: '+4pt' },
];

export const profileRecentActivity: ProfileActivityItem[] = [
  { id: '1', action: 'Started a new chat', detail: 'Market Research Analysis', time: '2m ago', category: 'Chat' },
  { id: '2', action: 'Uploaded document', detail: 'Q3 Financial Report.xlsx', time: '1h ago', category: 'Document' },
  { id: '3', action: 'Created workspace', detail: 'Product Strategy Q4', time: '3h ago', category: 'Workspace' },
  { id: '4', action: 'Updated profile', detail: 'Added product strategy skills', time: '6h ago', category: 'Profile' },
  { id: '5', action: 'Analyzed document', detail: 'Brand Guidelines 2025.pdf', time: '1d ago', category: 'AI' },
  { id: '6', action: 'Changed theme', detail: 'Switched to system mode', time: '2d ago', category: 'Settings' },
];

export const profileAchievements = [
  { label: 'Early Adopter', earned: true },
  { label: '7-Day Streak', earned: true },
  { label: 'Power User', earned: true },
  { label: 'Doc Master', earned: true },
  { label: 'Team Builder', earned: true },
  { label: 'Top 1%', earned: false },
];
