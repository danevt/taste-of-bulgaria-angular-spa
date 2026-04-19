const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const config = require('./config/config');
const { userModel, recipeModel } = require('./models');

const seedData = async () => {
    try {
        await mongoose.connect(config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await userModel.deleteMany({});
        await recipeModel.deleteMany({});
        console.log('Cleared existing data');

        // Create test users with PLAIN passwords (userModel hashes them via pre-save hook)
        const user1 = await userModel.create({
            email: 'john@example.com',
            username: 'john_chef',
            password: '12345', // ← plain text, pre-save hook хешира
        });

        const user2 = await userModel.create({
            email: 'maria@example.com',
            username: 'maria_cook',
            password: '12345', // ← plain text
        });

        console.log('Created test users');

        // Create test recipes (същото като преди)
        const recipe1 = await recipeModel.create({
            name: 'Shopska Salad',
            category: 'Salads & Appetizers',
            ingredients: [
                '4 tomatoes, diced',
                '2 cucumbers, diced',
                '1 onion, finely chopped',
                '2 peppers, diced',
                '200g sirene cheese, grated',
                'Olive oil',
                'Salt',
            ],
            instructions: [
                'Dice all vegetables into small cubes',
                'Mix tomatoes, cucumbers, onion, and peppers in a bowl',
                'Add salt and olive oil to taste',
                'Top with grated sirene cheese',
                'Serve immediately',
            ],
            imageUrl: '/images/recipe-shopska-salad.jpg',
            userId: user1._id,
        });

        const recipe2 = await recipeModel.create({
            name: 'Banitsa',
            category: 'Main Dishes',
            ingredients: [
                '500g filo pastry',
                '400g sirene cheese, crumbled',
                '4 eggs',
                '200ml yogurt',
                '100ml sunflower oil',
                'Pinch of salt',
            ],
            instructions: [
                'Preheat oven to 180°C',
                'Mix eggs, yogurt, and oil in a bowl',
                'Crumble cheese into the mixture',
                'Layer filo sheets in a greased pan, brushing each with egg mixture',
                'Add cheese filling between layers',
                'Bake for 40-45 minutes until golden',
            ],
            imageUrl: '/images/recipe-banitsa.jpg',
            userId: user2._id,
        });

        const recipe3 = await recipeModel.create({
            name: 'Pork Kavarma',
            category: 'Main Dishes',
            ingredients: [
                '800g pork shoulder, cubed',
                '2 onions, chopped',
                '2 peppers, sliced',
                '3 tomatoes, chopped',
                '100ml white wine',
                'Paprika, salt, black pepper',
                'Fresh parsley',
            ],
            instructions: [
                'Brown pork cubes in a clay pot or heavy pan',
                'Add onions and cook until soft',
                'Add peppers and tomatoes',
                'Season with paprika, salt, and pepper',
                'Add wine and simmer covered for 1.5 hours',
                'Garnish with fresh parsley before serving',
            ],
            imageUrl: '/images/recipe-kavarma.jpg',
            userId: user1._id,
        });

        // Update user recipes
        await userModel.updateOne(
            { _id: user1._id },
            { $push: { recipes: { $each: [recipe1._id, recipe3._id] } } },
        );

        await userModel.updateOne(
            { _id: user2._id },
            { $push: { recipes: recipe2._id } },
        );

        console.log('Created test recipes');
        console.log('\n=== Seed Complete ===');
        console.log('Test Users:');
        console.log('  john@example.com / 12345');
        console.log('  maria@example.com / 12345');
        console.log('\nRecipes created: 3');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedData();
