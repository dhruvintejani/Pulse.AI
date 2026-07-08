export interface ProfileSocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ProfileDetails {
  name: string;
  email: string;
  company: string;
  role: string;
  location: string;
  biography: string;
  skills: string[];
  socials: ProfileSocialLink[];
  joined: string;
  timezone: string;
  plan: string;
}

export interface ProfileActivityItem {
  id: string;
  action: string;
  detail: string;
  category: string;
  time: string;
}

export interface ProfileStatistic {
  label: string;
  value: string;
  change: string;
}
