import * as gplay from 'google-play-scraper';

export interface AppInfo {
  appId: string;
  title: string;
  developer: string;
  icon: string;
  score: number;
  free: boolean;
  priceText?: string;
  installs?: string;
  summary?: string;
  url?: string;
}

export interface AppReview {
  id: string;
  userName: string;
  content: string;
  score: number;
  at: Date;
  replyContent?: string;
  replyAt?: Date;
  thumbsUpCount: number;
  reviewCreatedVersion?: string;
  // For preprocessing
  processedContent?: string;
  originalContent?: string;
}

// Mock app data for demo purposes
const mockApps: { [key: string]: AppInfo } = {
  'com.instagram.android': {
    appId: 'com.instagram.android',
    title: 'Instagram',
    developer: 'Meta Platforms, Inc.',
    icon: 'https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nD4JSvlhUQwrzsNLWjOuaIaeEsnzjJjOMyDI7IYbIogPtZ2Sg2A=w240-h480-rw',
    score: 4.3,
    free: true,
    installs: '1,000,000,000+',
    summary: 'Instagram allows you to create and share your photos, stories, and videos with the friends and followers you care about.'
  },
  'com.facebook.katana': {
    appId: 'com.facebook.katana',
    title: 'Facebook',
    developer: 'Meta Platforms, Inc.',
    icon: 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AReUHsXYcBGpLCJ_rNMDmwkDDGQuwATwYYRGUL_g=w240-h480-rw',
    score: 4.0,
    free: true,
    installs: '5,000,000,000+',
    summary: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.'
  },
  'com.whatsapp': {
    appId: 'com.whatsapp',
    title: 'WhatsApp',
    developer: 'Meta Platforms, Inc.',
    icon: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw',
    score: 4.2,
    free: true,
    installs: '5,000,000,000+',
    summary: 'Simple. Reliable. Private. WhatsApp is a FREE messaging and video calling app used by over 2B people in more than 180 countries.'
  },
  'com.google.android.youtube': {
    appId: 'com.google.android.youtube',
    title: 'YouTube',
    developer: 'Google LLC',
    icon: 'https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=w240-h480-rw',
    score: 4.4,
    free: true,
    installs: '10,000,000,000+',
    summary: 'Make watching your favorite videos easier with the YouTube app.'
  },
  'com.spotify.music': {
    appId: 'com.spotify.music',
    title: 'Spotify',
    developer: 'Spotify AB',
    icon: 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5vl8zyqY8aQ4hEMnWJsq0XtQnVp4=w240-h480-rw',
    score: 4.3,
    free: true,
    installs: '1,000,000,000+',
    summary: 'Spotify is the best way to listen to music and podcasts on mobile or tablet.'
  }
};

// Generate a random review
const generateReview = (appId: string, index: number): AppReview => {
  const positiveReviews = [
    "Great app, I love using it every day!",
    "This is my favorite app, very intuitive and helpful.",
    "Amazing features, highly recommended!",
    "Works perfectly, never had any issues.",
    "The best app in its category, incredible user experience."
  ];
  
  const neutralReviews = [
    "It's okay, gets the job done.",
    "Average app, some good features but also some issues.",
    "Not bad, but could be improved in some areas.",
    "Decent app, occasionally crashes but otherwise fine.",
    "It works, but I've seen better apps like this."
  ];
  
  const negativeReviews = [
    "Terrible app, constantly crashes on my device.",
    "Very buggy and slow, needs a lot of improvement.",
    "Waste of storage space, don't recommend it.",
    "Frustrating experience, too many ads and popups.",
    "Uninstalled after a day, couldn't stand the user interface."
  ];

  // Generate a random score between 1-5
  const score = Math.floor(Math.random() * 5) + 1;
  
  // Choose a review based on the score
  let content;
  if (score >= 4) {
    content = positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
  } else if (score >= 3) {
    content = neutralReviews[Math.floor(Math.random() * neutralReviews.length)];
  } else {
    content = negativeReviews[Math.floor(Math.random() * negativeReviews.length)];
  }

  // Generate a random date within the last year
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  
  return {
    id: `review-${appId}-${index}`,
    userName: `User${Math.floor(Math.random() * 1000)}`,
    content,
    score,
    at: date,
    thumbsUpCount: Math.floor(Math.random() * 100),
    reviewCreatedVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
  };
};

// Replace the mock function to fetch app info
export const fetchAppInfo = async (appId: string): Promise<AppInfo> => {
  try {
    const appDetails = await gplay.app({ appId });
    return {
      appId: appDetails.appId,
      title: appDetails.title,
      developer: appDetails.developer,
      icon: appDetails.icon,
      score: appDetails.score,
      free: appDetails.free,
      priceText: appDetails.priceText,
      installs: appDetails.installs,
      summary: appDetails.summary,
      url: appDetails.url,
    };
  } catch (error) {
    console.error(`Error fetching app info for ${appId}:`, error);
    throw error;
  }
};

// Replace the mock function to fetch app reviews
export const fetchAppReviews = async (appId: string, count = 100): Promise<AppReview[]> => {
  try {
    const reviews = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: count
    });
    return reviews.data.map((review, index) => ({
      id: review.id || `review-${appId}-${index}`,
      userName: review.userName || 'Anonymous',
      content: review.text,
      score: review.score,
      at: new Date(review.date), // Convert to Date object
      replyContent: review.replyText,
      replyAt: review.replyDate ? new Date(review.replyDate) : undefined, // Convert if present
      thumbsUpCount: review.thumbsUp,
      reviewCreatedVersion: review.version,
    }));
  } catch (error) {
    console.error(`Error fetching reviews for ${appId}:`, error);
    throw error;
  }
};
