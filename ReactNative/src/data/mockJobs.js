export const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'gardening', label: 'Gardening', icon: '🌿' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'painting', label: 'Painting', icon: '🎨' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'moving', label: 'Moving', icon: '📦' },
  { id: 'tutoring', label: 'Tutoring', icon: '📚' },
  { id: 'eventHelp', label: 'Event Help', icon: '🎉' },
];

export const mockJobs = [
  { id: '1', title: 'Lawn Mowing & Garden Cleanup', category: 'gardening', rate: 'Rs. 2,500', rateUnit: 'per day', location: 'Colombo 05', postedAgo: '2 hours ago', urgent: true, posterInitials: 'PW', rating: 4.5 },
  { id: '2', title: 'House Deep Cleaning – 3BHK', category: 'cleaning', rate: 'Rs. 4,500', rateUnit: 'fixed', location: 'Dehiwala', postedAgo: '5 hours ago', urgent: false, posterInitials: 'RF', rating: 4.2 },
  { id: '3', title: 'Wall Painting – 2 Rooms', category: 'painting', rate: 'Rs. 8,000', rateUnit: 'fixed', location: 'Nugegoda', postedAgo: '1 day ago', urgent: false, posterInitials: 'NP', rating: 4.8 },
  { id: '4', title: 'Airport Drop – Katunayake', category: 'driving', rate: 'Rs. 3,500', rateUnit: 'per trip', location: 'Katunayake', postedAgo: '30 min ago', urgent: true, posterInitials: 'SI', rating: 3.9 },
  { id: '5', title: 'Furniture Moving – 1BHK Flat', category: 'moving', rate: 'Rs. 5,000', rateUnit: 'fixed', location: 'Kandy', postedAgo: '2 days ago', urgent: false, posterInitials: 'KD', rating: 4.6 },
  { id: '6', title: 'O/L Maths Tutor – Grade 11', category: 'tutoring', rate: 'Rs. 1,500', rateUnit: 'per hour', location: 'Borella', postedAgo: '3 days ago', urgent: false, posterInitials: 'DG', rating: 4.9 },
  { id: '7', title: 'Wedding Event Setup & Cleanup', category: 'eventHelp', rate: 'Rs. 6,000', rateUnit: 'fixed', location: 'Battaramulla', postedAgo: '1 day ago', urgent: false, posterInitials: 'PW', rating: 4.5 },
];

export const stats = {
  appliedJobs: 5,
  activeJobs: 2,
  earnings: 'Rs. 12,500',
};
