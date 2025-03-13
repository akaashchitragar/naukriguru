#!/bin/bash

# Create testimonials directory if it doesn't exist
mkdir -p public/testimonials
mkdir -p public/avatars

# Download placeholder images for testimonials
curl -o public/testimonials/testimonial-1.jpg https://randomuser.me/api/portraits/women/32.jpg
curl -o public/testimonials/testimonial-2.jpg https://randomuser.me/api/portraits/men/45.jpg
curl -o public/testimonials/testimonial-3.jpg https://randomuser.me/api/portraits/women/68.jpg

# Download placeholder images for user avatars in CTA section
curl -o public/avatars/avatar-1.jpg https://randomuser.me/api/portraits/women/22.jpg
curl -o public/avatars/avatar-2.jpg https://randomuser.me/api/portraits/men/33.jpg
curl -o public/avatars/avatar-3.jpg https://randomuser.me/api/portraits/women/56.jpg
curl -o public/avatars/avatar-4.jpg https://randomuser.me/api/portraits/men/78.jpg

echo "Testimonial and avatar images downloaded successfully!" 