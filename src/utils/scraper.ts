
// Mock implementation for browser environment
// The real google-play-scraper requires Node.js environment

export interface AppReview {
  id: string;
  userName: string;
  userImage: string;
  content: string;
  score: number;
  scoreText: string;
  thumbsUpCount: number;
  reviewCreatedVersion: string;
  at: Date;
  replyContent?: string;
  replyAt?: Date;
  appVersion?: string;
  title?: string;
}

export interface AppInfo {
  appId: string;
  title: string;
  summary: string;
  developer: string;
  developerId: string;
  icon: string;
  score: number;
  scoreText: string;
  priceText: string;
  free: boolean;
}

// Mock data for app info
const mockAppInfos: Record<string, AppInfo> = {
  'com.instagram.android': {
    appId: 'com.instagram.android',
    title: 'Instagram',
    summary: 'Photo and video sharing',
    developer: 'Meta',
    developerId: 'meta',
    icon: 'https://play-lh.googleusercontent.com/c2DcVsBUhJb3a-Q-LOdCIJ7iQMbSfCfrjDLuzGvPQFiA-AGbVi9P7AdMCwL0FvJRQPP-=w240-h480-rw',
    score: 4.2,
    scoreText: '4.2',
    priceText: 'Free',
    free: true
  },
  'com.facebook.katana': {
    appId: 'com.facebook.katana',
    title: 'Facebook',
    summary: 'Social networking app',
    developer: 'Meta',
    developerId: 'meta',
    icon: 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=w240-h480-rw',
    score: 4.0,
    scoreText: '4.0',
    priceText: 'Free',
    free: true
  },
  'com.whatsapp': {
    appId: 'com.whatsapp',
    title: 'WhatsApp',
    summary: 'Messaging app',
    developer: 'WhatsApp LLC',
    developerId: 'whatsapp',
    icon: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw',
    score: 4.1,
    scoreText: '4.1',
    priceText: 'Free',
    free: true
  }
};

// Helper to generate random reviews
const generateMockReviews = (appId: string, count: number = 100): AppReview[] => {
  const reviews: AppReview[] = [];
  const possibleScores = [1, 2, 3, 4, 5];
  
  const reviewTexts = [
    "Great app, I use it daily!",
    "Could use some improvements but overall good.",
    "The latest update broke several features.",
    "Love this app, it's very helpful.",
    "Terrible experience, constant crashes.",
    "App works as expected, no complaints.",
    "Useful features but slow performance.",
    "Best app in its category!",
    "Too many ads, considering uninstalling.",
    "The interface is confusing."
  ];
  
  const userNames = [
    "John Smith", "Emma Wilson", "Michael Brown", 
    "Sophia Johnson", "William Davis", "Olivia Miller",
    "James Taylor", "Ava Anderson", "Robert Thomas",
    "Isabella White"
  ];
  
  const versions = ["1.0.0", "1.1.0", "2.0.0", "2.1.5", "3.0.1"];
  
  for (let i = 0; i < count; i++) {
    const score = possibleScores[Math.floor(Math.random() * possibleScores.length)];
    const randomDaysAgo = Math.floor(Math.random() * 90); // Random date within last 90 days
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);
    
    const hasReply = Math.random() > 0.7; // 30% chance of having a reply
    let replyDate;
    if (hasReply) {
      replyDate = new Date(reviewDate);
      replyDate.setDate(replyDate.getDate() + Math.floor(Math.random() * 7)); // Reply within 7 days
    }
    
    reviews.push({
      id: `review-${appId}-${i}`,
      userName: userNames[Math.floor(Math.random() * userNames.length)],
      userImage: `https://i.pravatar.cc/150?u=${appId}-${i}`,
      content: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      score,
      scoreText: score.toString(),
      thumbsUpCount: Math.floor(Math.random() * 50),
      reviewCreatedVersion: versions[Math.floor(Math.random() * versions.length)],
      at: reviewDate,
      replyContent: hasReply ? "Thank you for your feedback! We're working to improve the app." : undefined,
      replyAt: hasReply ? replyDate : undefined,
      appVersion: versions[Math.floor(Math.random() * versions.length)]
    });
  }
  
  return reviews;
};

export async function fetchAppInfo(appId: string): Promise<AppInfo> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const appInfo = mockAppInfos[appId];
      if (appInfo) {
        resolve(appInfo);
      } else {
        // Create a generic app info if not found in mockAppInfos
        resolve({
          appId,
          title: appId.split('.').pop() || appId,
          summary: 'App from Google Play Store',
          developer: 'Unknown Developer',
          developerId: 'unknown',
          icon: `https://via.placeholder.com/150?text=${appId.slice(0, 2)}`,
          score: 4.0,
          scoreText: '4.0',
          priceText: 'Free',
          free: true
        });
      }
    }, 500); // Simulate network delay
  });
}

export async function fetchAppReviews(appId: string, count: number = 100): Promise<AppReview[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockReviews(appId, count));
    }, 800); // Simulate network delay
  });
}
