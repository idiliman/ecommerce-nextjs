import Product from '@/models/Product';
const { default: User } = require('@/models/User');
const { default: data } = require('@/utils/data');
const { default: db } = require('@/utils/db');

// mongosh "mongodb+srv://cluster0.soub0b9.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin

// Seed user to DB
// const handler = async (req, res) => {
//   await db.connect();
//   await User.insertMany(data.users);
//   await db.disconnect();
//   res.send({ message: 'Seeded successfully' });
// };

// Seed product to DB
const handler = async (req, res) => {
  await db.connect();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Seeded successfully' });
};

// Delete data in DB
// const handler = async (req, res) => {
//   await db.connect();
//   await Product.deleteMany();
//   // await User.deleteMany();
//   await db.disconnect();
//   res.send({ message: 'Deleted successfully' });
// };

export default handler;
