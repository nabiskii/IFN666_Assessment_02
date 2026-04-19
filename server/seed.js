require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/user");
const Shelter = require("./src/models/shelter");
const Pet = require("./src/models/pet");
const Application = require("./src/models/application");

const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/pawmatch";

async function seed() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");

  // Clear existing data
  await User.deleteMany({});
  await Shelter.deleteMany({});
  await Pet.deleteMany({});
  await Application.deleteMany({});
  console.log("Cleared existing data");

  // Users
  const admin = await User.create({
    username: "admin",
    password: "Admin123!",
    is_admin: true,
  });

  const john = await User.create({
    username: "johndoe",
    password: "User1234!",
    is_admin: false,
  });

  const jane = await User.create({
    username: "janedoe",
    password: "User1234!",
    is_admin: false,
  });

  console.log("Created users");

  // Shelters
  const s1 = await Shelter.create({
    name: "Happy Paws Rescue",
    address: "42 George St, Brisbane QLD 4000",
    phone: "07 3210 5678",
    email: "info@happypaws.org.au",
    description: "A volunteer-run rescue dedicated to rehoming dogs and cats across Southeast Queensland.",
  });

  const s2 = await Shelter.create({
    name: "Second Chance Animal Shelter",
    address: "15 Meadow Lane, Gold Coast QLD 4215",
    phone: "07 5555 1234",
    email: "adopt@secondchance.org.au",
    description: "Specialising in rescuing abandoned and surrendered animals along the Gold Coast.",
  });

  const s3 = await Shelter.create({
    name: "Sunshine Coast Pet Haven",
    address: "88 Ocean Drive, Maroochydore QLD 4558",
    phone: "07 5443 9876",
    email: "hello@pethaven.org.au",
    description: "A no-kill shelter providing care for dogs, cats, birds and rabbits.",
  });

  console.log("Created shelters");

  // Pets
  const p1 = await Pet.create({
    name: "Buddy", species: "dog", breed: "Golden Retriever", age: 3, gender: "male",
    description: "Friendly and energetic golden retriever who loves walks, swimming, and belly rubs. Great with kids.",
    status: "available", shelter: s1._id,
  });

  const p2 = await Pet.create({
    name: "Luna", species: "cat", breed: "Domestic Shorthair", age: 2, gender: "female",
    description: "Calm and affectionate indoor cat. Loves lounging in sunny spots and gentle cuddles.",
    status: "available", shelter: s1._id,
  });

  const p3 = await Pet.create({
    name: "Max", species: "dog", breed: "German Shepherd", age: 4, gender: "male",
    description: "Loyal and intelligent shepherd. Well trained, knows basic commands. Needs an active owner.",
    status: "available", shelter: s2._id,
  });

  const p4 = await Pet.create({
    name: "Coco", species: "rabbit", breed: "Holland Lop", age: 1, gender: "female",
    description: "Adorable lop-eared bunny. Very social and loves being held. Perfect for families.",
    status: "available", shelter: s2._id,
  });

  const p5 = await Pet.create({
    name: "Kiwi", species: "bird", breed: "Cockatiel", age: 2, gender: "male",
    description: "Playful cockatiel who can whistle tunes. Hand-raised and very tame.",
    status: "available", shelter: s3._id,
  });

  const p6 = await Pet.create({
    name: "Milo", species: "cat", breed: "Ragdoll", age: 5, gender: "male",
    description: "Gentle giant who gets along with other cats and dogs. Very relaxed temperament.",
    status: "pending", shelter: s3._id,
  });

  const p7 = await Pet.create({
    name: "Bella", species: "dog", breed: "Labrador Mix", age: 2, gender: "female",
    description: "Sweet and playful lab mix rescued from the streets. Loves fetch and learning new tricks.",
    status: "adopted", shelter: s1._id,
  });

  const p8 = await Pet.create({
    name: "Whiskers", species: "cat", breed: "Tabby", age: 7, gender: "male",
    description: "Senior tabby looking for a quiet home. Indoor only. Very affectionate once comfortable.",
    status: "available", shelter: s2._id,
  });

  console.log("Created pets");

  // Applications
  await Application.create({
    applicant: john._id, pet: p1._id, status: "pending",
    message: "I have a large backyard and work from home. Buddy would be a perfect companion for my daily walks.",
  });

  await Application.create({
    applicant: john._id, pet: p6._id, status: "pending",
    message: "I already have one cat and Milo seems like he would get along well. My home is very calm.",
  });

  await Application.create({
    applicant: jane._id, pet: p7._id, status: "approved",
    message: "We are a family of four with experience owning labradors. We have a fenced yard and lots of love to give.",
  });

  await Application.create({
    applicant: jane._id, pet: p4._id, status: "pending",
    message: "My daughter has been wanting a rabbit for years. We have an indoor enclosure ready.",
  });

  await Application.create({
    applicant: john._id, pet: p3._id, status: "rejected",
    message: "I run 5km every morning and would love a running partner. Max seems perfect.",
  });

  console.log("Created applications");

  console.log("\nSeed complete!");
  console.log("Admin login  - username: admin, password: Admin123!");
  console.log("User login   - username: johndoe, password: User1234!");
  console.log("User login   - username: janedoe, password: User1234!");

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
