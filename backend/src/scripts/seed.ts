import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Service from '../models/Service';
import Bulletin from '../models/Bulletin';
import GalleryImage from '../models/GalleryImage';
import Admin from '../models/Admin';

const services = [
  { title: 'Government Exam Form Filling', description: 'Assistance with filling government exam application forms.', icon: 'fas fa-file-alt', category: 'government', order: 0 },
  { title: 'PAN Card Application', description: 'Help with PAN card application and renewal.', icon: 'fas fa-id-card', category: 'government', order: 1 },
  { title: 'Aadhaar Card Application', description: 'Services for new Aadhaar card applications.', icon: 'fas fa-address-card', category: 'government', order: 2 },
  { title: 'Aadhaar Amendment/Correction', description: 'Update or correct Aadhaar card details.', icon: 'fas fa-edit', category: 'government', order: 3 },
  { title: 'Passport Services', description: 'Assistance with passport applications and renewals.', icon: 'fas fa-passport', category: 'government', order: 4 },
  { title: 'Driving Licence Services', description: 'Help with driving licence applications.', icon: 'fas fa-car', category: 'government', order: 5 },
  { title: 'CSC-related Government Services', description: 'Various government services through Common Service Centre.', icon: 'fas fa-building', category: 'government', order: 6 },
  { title: 'Other Online Public Services', description: 'Additional online public services and assistance.', icon: 'fas fa-globe', category: 'other', order: 7 },
];

const bulletins = [
  { title: 'Punjab ₹10 Lakh Health Card Scheme', description: 'Now offering registration for Mukh Mantri Sehat Yojana with cashless treatment up to ₹10 lakh per family.', date: '2024-03-14', isNew: true, order: 0 },
  { title: 'New Aadhaar Update Service', description: 'We now offer Aadhaar biometric update services.', date: '2024-03-01', isNew: true, order: 1 },
  { title: 'PAN Card Correction Service', description: 'Assistance for PAN card name/address corrections.', date: '2024-02-15', isNew: true, order: 2 },
];

const galleryImages = [
  { src: '/images/gallery-1.png', alt: 'Computer Training Lab', caption: 'Our Computer Training Lab', publicId: '', order: 0 },
  { src: '/images/gallery-2.png', alt: 'Service Desk', caption: 'Service Desk', publicId: '', order: 1 },
  { src: '/images/gallery-3.png', alt: 'Digital Services Center', caption: 'Digital Services', publicId: '', order: 2 },
  { src: '/images/gallery-4.png', alt: 'Form Filling Assistance', caption: 'Form Filling Assistance', publicId: '', order: 3 },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  await Service.deleteMany({});
  await Bulletin.deleteMany({});
  await GalleryImage.deleteMany({});
  await Admin.deleteMany({});

  await Service.insertMany(services);
  console.log(`Seeded ${services.length} services`);

  await Bulletin.insertMany(bulletins);
  console.log(`Seeded ${bulletins.length} bulletins`);

  await GalleryImage.insertMany(galleryImages);
  console.log(`Seeded ${galleryImages.length} gallery images`);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ username, passwordHash });
  console.log(`Created admin user: ${username}`);

  await mongoose.disconnect();
  console.log('Seed complete!');
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
