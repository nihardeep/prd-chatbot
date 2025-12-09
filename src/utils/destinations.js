// Destination image mapping for search results
const destinationImages = {
  'kuala-lumpur': 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'bangkok': 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'bali': 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'singapore': 'https://images.pexels.com/photos/1534993/pexels-photo-1534993.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'default': 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

// Get destination display name from value
const getDestinationDisplayName = (destination) => {
  const mapping = {
    'kuala-lumpur': 'Kuala Lumpur',
    'bangkok': 'Bangkok',
    'bali': 'Bali',
    'singapore': 'Singapore'
  };
  return mapping[destination] || destination || 'Your Destination';
};

// Get destination image URL
const getDestinationImage = (destination) => {
  return destinationImages[destination] || destinationImages['default'];
};

export { getDestinationDisplayName, getDestinationImage };

