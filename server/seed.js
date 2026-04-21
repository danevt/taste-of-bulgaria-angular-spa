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

        await userModel.deleteMany({});
        await recipeModel.deleteMany({});
        console.log('Cleared existing data');

        const user1 = await userModel.create({
            email: 'john@example.com',
            username: 'john_chef',
            password: '12345',
        });

        const user2 = await userModel.create({
            email: 'maria@example.com',
            username: 'maria_cook',
            password: '12345',
        });

        console.log('Created test users');

        const recipe1 = await recipeModel.create({
            name: 'Shopska Salad',
            category: 'Salads',
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
            name: 'Tarator',
            category: 'Salads',
            ingredients: [
                '500g yogurt',
                '2 cucumbers, finely diced',
                '2 cloves garlic, minced',
                '3 tbsp dill, chopped',
                '2 tbsp walnuts, crushed',
                '2 tbsp sunflower oil',
                'Salt',
                'Cold water',
            ],
            instructions: [
                'Mix yogurt with cold water to desired consistency',
                'Add diced cucumbers and minced garlic',
                'Stir in chopped dill and crushed walnuts',
                'Add sunflower oil and salt to taste',
                'Chill in refrigerator for at least 1 hour before serving',
            ],
            imageUrl: '/images/recipe-tarator.jpg',
            userId: user2._id,
        });

        const recipe3 = await recipeModel.create({
            name: 'Snezhanka Salad',
            category: 'Salads',
            ingredients: [
                '500g strained yogurt',
                '2 cucumbers, finely diced',
                '2 cloves garlic, minced',
                '3 tbsp fresh dill, chopped',
                '2 tbsp walnuts, crushed',
                '1 tbsp olive oil',
                'Salt and pepper',
            ],
            instructions: [
                'Strain yogurt through cheesecloth for 2-3 hours',
                'Mix strained yogurt with minced garlic',
                'Add finely diced cucumbers',
                'Stir in chopped dill and crushed walnuts',
                'Season with salt, pepper, and drizzle with olive oil',
                'Chill before serving',
            ],
            imageUrl: '/images/recipe-snezhanka.jpg',
            userId: user1._id,
        });

        const recipe4 = await recipeModel.create({
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

        const recipe5 = await recipeModel.create({
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

        const recipe6 = await recipeModel.create({
            name: 'Moussaka',
            category: 'Main Dishes',
            ingredients: [
                '1kg potatoes, sliced',
                '500g ground meat (pork and beef mix)',
                '1 onion, chopped',
                '2 eggs',
                '300ml yogurt',
                '2 tbsp flour',
                'Paprika, salt, pepper',
                'Oil for frying',
            ],
            instructions: [
                'Fry potato slices until golden',
                'Cook ground meat with onion and spices',
                'Layer potatoes and meat in a baking dish',
                'Mix eggs, yogurt, and flour for topping',
                'Pour mixture over layers',
                'Bake at 180°C for 45 minutes until golden',
            ],
            imageUrl: '/images/recipe-moussaka.jpg',
            userId: user2._id,
        });

        const recipe7 = await recipeModel.create({
            name: 'Mekitsi',
            category: 'Desserts',
            ingredients: [
                '500g flour',
                '250ml yogurt',
                '1 egg',
                '1 tsp baking soda',
                '1 tsp salt',
                '1 tbsp sugar',
                'Oil for frying',
                'Powdered sugar or jam for serving',
            ],
            instructions: [
                'Mix yogurt with baking soda and let it foam slightly',
                'Add egg, salt, sugar, and mix well',
                'Gradually add flour and knead into a soft dough',
                'Let the dough rest for 20-30 minutes',
                'Shape small pieces into flat rounds',
                'Fry in hot oil until golden on both sides',
                'Serve warm with powdered sugar or jam',
            ],
            imageUrl: '/images/recipe-mekitsi.jpg',
            userId: user1._id,
        });

        const recipe8 = await recipeModel.create({
            name: 'Baklava',
            category: 'Desserts',
            ingredients: [
                '500g filo pastry',
                '300g walnuts, crushed',
                '200g butter, melted',
                '1 cup sugar',
                '1 cup water',
                '1 tbsp lemon juice',
                'Cinnamon',
            ],
            instructions: [
                'Mix crushed walnuts with cinnamon and 2 tbsp sugar',
                'Layer filo sheets in a pan, brushing each with melted butter',
                'Add walnut mixture between layers',
                'Cut into diamond shapes before baking',
                'Bake at 180°C for 30-40 minutes until golden',
                'Boil sugar, water, and lemon juice for syrup',
                'Pour hot syrup over cooled baklava',
            ],
            imageUrl: '/images/recipe-baklava.jpg',
            userId: user2._id,
        });

        const recipe9 = await recipeModel.create({
            name: 'Garash Cake',
            category: 'Desserts',
            ingredients: [
                '6 eggs',
                '200g sugar',
                '200g walnuts, ground',
                '100g dark chocolate',
                '100g butter',
                '3 tbsp flour',
                '300ml heavy cream',
                '150g chocolate for ganache',
            ],
            instructions: [
                'Beat eggs with sugar until fluffy',
                'Melt chocolate with butter',
                'Fold chocolate mixture into eggs',
                'Add ground walnuts and flour',
                'Bake at 180°C for 30-35 minutes',
                'Cool and prepare chocolate ganache with cream',
                'Cover cake with ganache and chill',
            ],
            imageUrl: '/images/recipe-garash.jpg',
            userId: user1._id,
        });

        await userModel.updateOne(
            { _id: user1._id },
            {
                $push: {
                    recipes: {
                        $each: [
                            recipe1._id,
                            recipe3._id,
                            recipe5._id,
                            recipe7._id,
                            recipe9._id,
                        ],
                    },
                },
            },
        );

        await userModel.updateOne(
            { _id: user2._id },
            {
                $push: {
                    recipes: {
                        $each: [
                            recipe2._id,
                            recipe4._id,
                            recipe6._id,
                            recipe8._id,
                        ],
                    },
                },
            },
        );

        console.log('Created test recipes');
        console.log('\n=== Seed Complete ===');
        console.log('Test Users:');
        console.log('  john@example.com / 12345');
        console.log('  maria@example.com / 12345');
        console.log('\nRecipes created: 9');

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedData();
