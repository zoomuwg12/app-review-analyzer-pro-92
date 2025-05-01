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
  processedContent?: string;
  originalContent?: string;
}

// Mock apps for development/fallback
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

// Transform gplay app data to our AppInfo format
const transformAppData = (appData: any): AppInfo => {
  return {
    appId: appData.appId,
    title: appData.title,
    developer: appData.developer,
    icon: appData.icon,
    score: appData.score,
    free: appData.free,
    priceText: appData.price,
    installs: appData.installs,
    summary: appData.summary,
    url: appData.url
  };
};

// Transform gplay review data to our AppReview format
const transformReviewData = (review: any): AppReview => {
  return {
    id: review.id,
    userName: review.userName,
    content: review.text,
    score: review.score,
    at: new Date(review.date),
    replyContent: review.replyText || undefined,
    replyAt: review.replyDate ? new Date(review.replyDate) : undefined,
    thumbsUpCount: review.thumbsUp || 0,
    reviewCreatedVersion: review.version || undefined
  };
};

// Function to fetch real app info
export const fetchAppInfo = async (appId: string): Promise<AppInfo> => {
  try {
    console.log(`Fetching app info for ${appId}...`);
    const appData = await gplay.app({ appId });
    console.log("App data fetched:", appData.title);
    return transformAppData(appData);
  } catch (error) {
    console.error(`Failed to fetch app info for ${appId}:`, error);
    
    // Fallback to mock data if available
    if (mockApps[appId]) {
      console.log(`Using mock data for ${appId}`);
      return mockApps[appId];
    }
    
    // If no mock data, create generic placeholder
    return {
      appId,
      title: `App ${appId.split('.').pop()}`,
      developer: 'Unknown Developer',
      icon: 'https://via.placeholder.com/96',
      score: 0,
      free: true,
      installs: 'Unknown',
      summary: 'No description available for this app.'
    };
  }
};

// Function to fetch real app reviews
export const fetchAppReviews = async (appId: string, count = 100): Promise<AppReview[]> => {
  try {
    console.log(`Fetching ${count} reviews for ${appId}...`);
    // Google Play Scraper allows pagination, so we'll batch the requests
    const batchSize = 100; // Max supported by the API
    const batches = Math.ceil(count / batchSize);
    let reviews: AppReview[] = [];

    for (let i = 0; i < batches; i++) {
      if (reviews.length >= count) break;
      
      const result = await gplay.reviews({
        appId,
        sort: gplay.sort.NEWEST,
        num: Math.min(batchSize, count - reviews.length),
        paginate: true,
        nextPaginationToken: i > 0 ? reviews[reviews.length - 1].id : undefined
      });
      
      const transformedReviews = result.data.map(transformReviewData);
      reviews = [...reviews, ...transformedReviews];
      
      // If we didn't get as many reviews as requested in this batch, stop
      if (result.data.length < batchSize) break;
    }

    console.log(`Fetched ${reviews.length} reviews for ${appId}`);
    return reviews.slice(0, count);
  } catch (error) {
    console.error(`Failed to fetch reviews for ${appId}:`, error);
    
    // Fallback to generating mock reviews
    console.log(`Using generated mock reviews for ${appId}`);
    return generateMockReviews(appId, count);
  }
};

// Mock function to generate reviews (used as fallback)
const generateMockReviews = (appId: string, count = 100): AppReview[] => {
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

  const reviews: AppReview[] = [];
  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * 5) + 1;
    
    let content;
    if (score >= 4) {
      content = positiveReviews[Math.floor(Math.random() * positiveReviews.length)];
    } else if (score >= 3) {
      content = neutralReviews[Math.floor(Math.random() * neutralReviews.length)];
    } else {
      content = negativeReviews[Math.floor(Math.random() * negativeReviews.length)];
    }

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    reviews.push({
      id: `review-${appId}-${i}`,
      userName: `User${Math.floor(Math.random() * 1000)}`,
      content,
      score,
      at: date,
      thumbsUpCount: Math.floor(Math.random() * 100),
      reviewCreatedVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
    });
  }
  
  return reviews;
};
