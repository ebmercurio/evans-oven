/* eslint-disable no-console */
/* eslint-disable max-len */
import {
  addDoc,
  arrayUnion,
  collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import IRecipe from '../interfaces/IRecipe';
import IIngredient from '../interfaces/IIngredient';
import { RHFSelectOption } from '../interfaces/RHFSelectOption';
import IAmount from '../interfaces/IAmount';
import INote from '../interfaces/INote';
import ITag from '../interfaces/ITag';
import IComment, { ICommentReply } from '../interfaces/IComment';
import ICategoryCard from '../interfaces/ICategoryCard';
import IUser from '../interfaces/IUser';
import IUnit from '../interfaces/IUnit';

const amountsCollection = collection(db, 'Amounts');
const unitsCollection = collection(db, 'Units');
const commentsCollection = collection(db, 'Comments');
const homeHeroItemsCollection = collection(db, 'HomeHeroItems');
const homeHeroSmallItemsCollection = collection(db, 'HomeHeroSmallItems');
const ingredientNotesCollection = collection(db, 'IngredientNotes');
const ingredientsCollection = collection(db, 'Ingredients');
const mealTypeCategoriesCollection = collection(db, 'MealTypeCategories');
const popularCategoriesCollection = collection(db, 'PopularCategories');
const recipesCollection = collection(db, 'Recipes');
const specialDietCategoriesCollection = collection(db, 'SpecialDietCategories');
const tagsCollection = collection(db, 'Tags');

// transforms
export const transformAmountsToOptions = (amounts: IAmount[]): RHFSelectOption[] => amounts.map((amount) => ({
  value: amount.id,
  label: amount.name,
}));
export const transformUnitsToOptions = (units: IUnit[]): RHFSelectOption[] => units.map((unit) => ({
  value: unit.id,
  label: unit.name,
}));
export const transformIngredientsToOptions = (ingredients: IIngredient[]): RHFSelectOption[] => ingredients.map((ingredient) => ({
  value: ingredient.id,
  label: ingredient.name,
}));
export const transformNotesToOptions = (notes: INote[]): RHFSelectOption[] => notes.map((note) => ({
  value: note.id,
  label: note.note,
}));

export const transformTagsToOptions = (tags: ITag[]): RHFSelectOption[] => tags.map((tag) => ({
  value: tag.id,
  label: tag.name,
}));

// export async function MigrateTagIdToName(dryRun = true) {
//   const recipesSnapshot = await getDocs(recipesCollection);

//   let total = 0;

//   const updatePromises = recipesSnapshot.docs.map(async (recipeDoc) => {
//     const recipe = recipeDoc.data();
//     const tagIds = recipe.tags || [];

//     const tagDocs = await Promise.all(
//       tagIds.map((tagId: string) => {
//         const tagRef = doc(db, 'Tags', tagId);
//         return getDoc(tagRef);
//       }),
//     );
//     // const tagDocs = await Promise.all(
//     //   tagIds.map((tagId: string) => getDoc(doc(db, 'tags', tagId))),
//     // );

//     console.log(recipe.title, 'recipetitle');
//     console.log(tagDocs, 'tagdocs');

//     const tagNames = tagDocs
//       .filter((tagDoc) => tagDoc.exists())
//       .map((tagDoc) => tagDoc.data()?.name)
//       .filter(Boolean);

//     if (dryRun) {
//       console.log(`Would update recipe "${recipe.title}" (${recipeDoc.id}) with tags:`, tagNames);
//     } else {
//       await updateDoc(recipeDoc.ref, { tags: tagNames });
//       console.log(`✅ Updated "${recipe.title}" (${recipeDoc.id}) with tags:`, tagNames);
//     }

//     // eslint-disable-next-line no-plusplus
//     total++;
//   });

//   await Promise.all(updatePromises);

//   console.log(`\n✅ ${dryRun ? 'Dry run complete' : 'Migration complete'} for ${total} recipes.`);
// }

export async function getAllHomeHeroItems(): Promise<ICategoryCard[]> {
  const querySnapshot = await getDocs(homeHeroItemsCollection);

  // Use Promise.all to wait for all promises to resolve
  const data = await Promise.all(querySnapshot.docs.map(async (document) => {
    const { id } = document;
    console.log(id, 'id');
    const documentData = document.data();
    const categoryCard: ICategoryCard = {
      id,
      tag: documentData.tag,
      image: documentData.image,
    };

    return categoryCard;
  }));

  return data;
}
export async function getAllHomeHeroSmallItems() {
  const querySnapshot = await getDocs(homeHeroSmallItemsCollection);

  // Use Promise.all to wait for all promises to resolve
  const data = await Promise.all(querySnapshot.docs.map(async (document) => {
    const { id } = document;
    const documentData = document.data();

    const categoryCard: ICategoryCard = {
      id,
      tag: documentData.tag,
      image: documentData.image,
    };

    return categoryCard;
  }));

  return data;
}
export async function getMealTypeCategories() {
  const querySnapshot = await getDocs(mealTypeCategoriesCollection);

  // Use Promise.all to wait for all promises to resolve
  const data = await Promise.all(querySnapshot.docs.map(async (document) => {
    const { id } = document;
    const documentData = document.data();

    const categoryCard: ICategoryCard = {
      id,
      tag: documentData.tag,
      image: documentData.image,
    };

    return categoryCard;
  }));

  // Filter out any null items
  const filteredData = data.filter((item): item is ICategoryCard => item !== null);

  return filteredData;
}
export async function getPopularCategories() {
  const querySnapshot = await getDocs(popularCategoriesCollection);

  // Use Promise.all to wait for all promises to resolve
  const data = await Promise.all(querySnapshot.docs.map(async (document) => {
    const { id } = document;
    const documentData = document.data();
    const categoryCard: ICategoryCard = {
      id,
      tag: documentData.tag,
      image: documentData.image,
    };

    return categoryCard;
  }));

  // Filter out any null items
  const filteredData = data.filter((item): item is ICategoryCard => item !== null);

  return filteredData;
}
export async function getSpecialDietCategories() {
  const querySnapshot = await getDocs(specialDietCategoriesCollection);

  // Use Promise.all to wait for all promises to resolve
  const data = await Promise.all(querySnapshot.docs.map(async (document) => {
    const { id } = document;
    const documentData = document.data();

    const categoryCard: ICategoryCard = {
      id,
      tag: documentData.tag,
      image: documentData.image,
    };

    return categoryCard;
  }));

  // Filter out any null items
  const filteredData = data.filter((item): item is ICategoryCard => item !== null);

  return filteredData;
}

export async function getAllUniqueIngredients() {
  const querySnapshot = await getDocs(ingredientsCollection);
  const data = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const ingredient: IIngredient = {
      id: document.id,
      name: documentData.name,
    };
    return ingredient;
  });
  return data;
}

export async function getAllAmounts() {
  const querySnapshot = await getDocs(amountsCollection);
  const data = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const amount: IAmount = {
      id: document.id,
      name: documentData.name,
    };
    return amount;
  });
  return data;
}

export async function getAllUnits() {
  const querySnapshot = await getDocs(unitsCollection);
  const data = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const unit: IUnit = {
      id: document.id,
      name: documentData.name,
    };
    return unit;
  });
  return data;
}

export async function getAllNotes() {
  const querySnapshot = await getDocs(ingredientNotesCollection);
  const data = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const note: INote = {
      id: document.id,
      note: documentData.note,
    };
    return note;
  });
  return data.sort();
}

export async function getAllTags() {
  const querySnapshot = await getDocs(tagsCollection);
  const data = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const tag: ITag = {
      id: document.id,
      name: documentData.name,
    };
    return tag;
  });
  return data.sort();
}

export async function getRecipesByTag(tag: string) {
  const queryRecipesDb = query(collection(db, 'Recipes'), where('tags', 'array-contains', tag));
  const querySnapshot = await getDocs(queryRecipesDb);
  const recipes: IRecipe[] = [];
  querySnapshot.forEach((document) => {
    const documentData = document.data();
    const recipe: IRecipe = {
      id: document.id,
      dateCreated: documentData.date,
      favorites: documentData.favorites,
      instructions: documentData.instructions,
      image: documentData.image,
      ingredients: documentData.ingredients,
      comments: documentData.comments,
      servings: documentData.servings,
      tags: documentData.tags,
      title: documentData.title,
      totalStars: documentData.totalStars,
      commentsWithRatings: documentData.commentsWithRatings,
      averageRating: 0,
    };

    let averageRating = 0;
    if (recipe.totalStars && recipe.commentsWithRatings) {
      averageRating = recipe.totalStars / recipe.commentsWithRatings;
    }
    recipe.averageRating = averageRating;
    recipes.push(recipe);
  });
  return recipes;
}

export async function getRecipesByIngredient(ingredient: string) {
  const queryRecipesDb = query(collection(db, 'Recipes'), where('ingredients', 'array-contains', ingredient));
  const querySnapshot = await getDocs(queryRecipesDb);
  const recipes: IRecipe[] = [];
  querySnapshot.forEach((document) => {
    const documentData = document.data();
    const recipe: IRecipe = {
      id: document.id,
      dateCreated: documentData.date,
      favorites: documentData.favorites,
      instructions: documentData.instructions,
      image: documentData.image,
      ingredients: documentData.ingredients,
      comments: documentData.comments,
      servings: documentData.servings,
      tags: documentData.tags,
      title: documentData.title,
      totalStars: documentData.totalStars,
      commentsWithRatings: documentData.commentsWithRatings,
      averageRating: 0,
    };

    let averageRating = 0;
    if (recipe.totalStars && recipe.commentsWithRatings) {
      averageRating = recipe.totalStars / recipe.commentsWithRatings;
    }
    recipe.averageRating = averageRating;
    recipes.push(recipe);
  });
  return recipes;
}

export async function getAllRecipes() {
  const querySnapshot = await getDocs(recipesCollection);
  const recipesData = querySnapshot.docs.map((document) => {
    const documentData = document.data();
    const recipe: IRecipe = {
      id: document.id,
      dateCreated: documentData.date,
      favorites: documentData.favorites,
      instructions: documentData.instructions,
      image: documentData.image,
      ingredients: documentData.ingredients,
      comments: documentData.comments,
      servings: documentData.servings,
      tags: documentData.tags,
      title: documentData.title,
      totalStars: documentData.totalStars,
      commentsWithRatings: documentData.commentsWithRatings,
      averageRating: 0,
    };

    let averageRating = 0;
    if (recipe.totalStars && recipe.commentsWithRatings) {
      averageRating = recipe.totalStars / recipe.commentsWithRatings;
    }
    recipe.averageRating = averageRating;

    return recipe;
  });
  return recipesData;
}

export async function getAmountById(documentId: string) {
  const docRef = doc(db, 'Amounts', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const amountData = docSnap.data();
    const amount: IAmount = {
      id: documentId,
      name: amountData.name,
    };
    return amount;
  }
  throw new Error('Amount not found');
}

export async function getUnitById(documentId: string) {
  const docRef = doc(db, 'Units', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const unitData = docSnap.data();
    const unit: IUnit = {
      id: documentId,
      name: unitData.name,
    };
    return unit;
  }
  throw new Error('Unit not found');
}

export async function getTagById(documentId: string) {
  const docRef = doc(db, 'Tags', documentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const tagData = docSnap.data();
    const tag: ITag = {
      id: documentId,
      name: tagData.name,
    };
    return tag;
  }

  throw new Error('Tag not found');
}

export async function getIngredientById(documentId: string) {
  const docRef = doc(db, 'Ingredients', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ingredientData = docSnap.data();
    const ingredient: IIngredient = {
      id: documentId,
      name: ingredientData.name,
    };
    return ingredient;
  }

  throw new Error('Ingredient not found');
}

export async function getIngredientNotesById(documentId: string): Promise<INote> {
  const docRef = doc(db, 'IngredientNotes', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ingredientNotesData = docSnap.data();
    const ingredientNotes: INote = {
      id: documentId,
      note: ingredientNotesData.note,
    };
    return ingredientNotes;
  }

  throw new Error('Ingredient notes not found');
}

export async function getRecipeById(documentId: string) {
  const docRef = doc(db, 'Recipes', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const recipeData = docSnap.data();
    const recipe: IRecipe = {
      id: documentId,
      dateCreated: recipeData.date,
      favorites: recipeData.favorites,
      instructions: recipeData.instructions,
      image: recipeData.image,
      ingredients: recipeData.ingredients,
      comments: recipeData.comments,
      servings: recipeData.servings,
      tags: recipeData.tags,
      title: recipeData.title,
      totalStars: recipeData.totalStars,
      commentsWithRatings: recipeData.commentsWithRatings,
      averageRating: 0,
    };

    console.log(recipe.servings, 'recipeservs');
    let averageRating = 0;
    if (recipe.totalStars && recipe.commentsWithRatings) {
      averageRating = recipe.totalStars / recipe.commentsWithRatings;
    }
    recipe.averageRating = averageRating;

    return recipe;
  }

  throw new Error('Recipe not found');
}

export async function getFavoriteRecipes(userId: string) {
  const docRef = doc(db, 'Users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = docSnap.data();
    const recipes = await Promise.all(
      user.favorites.map(async (recipeId: string) => {
        const recipe = await getRecipeById(recipeId);
        return recipe;
      }),
    );
    return recipes;
  }

  return [];
}

export async function getCommentById(documentId: string) {
  const docRef = doc(db, 'Comments', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const commentData = docSnap.data();
    const comment: IComment = {
      id: documentId,
      username: commentData.username,
      content: commentData.content,
      postedAt: commentData.postedAt,
      rating: commentData.rating,
    };

    return comment;
  }

  throw new Error('Comment not found');
}

export async function addRecipe(recipe: IRecipe) {
  console.log(recipe, 'recipetoadd');
  const docRef = await addDoc(recipesCollection, {
    comments: recipe.comments,
    dateCreated: recipe.dateCreated,
    image: recipe.image,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    servings: recipe.servings,
    tags: recipe.tags,
    title: recipe.title,
  });
  console.log('docId', docRef.id);
}

export async function createUserInFirestore(userAuth: User, displayName: string) {
  const userRef = doc(db, 'Users', userAuth.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // If the user document does not exist, create it
    await setDoc(userRef, {
      id: userAuth.uid,
      email: userAuth.email,
      displayName,
      favorites: [], // Set an empty favorites array initially
    });
    console.log('New user document created in Firestore');
  }
}

export async function getUserData(authUser: User) {
  const userRef = doc(db, 'Users', authUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Merge Auth user data with Firestore user data
    console.log(userSnap.data(), 'usersnapdata');
    const firebaseuser = userSnap.data();
    const userData: IUser = {
      uid: authUser.uid,
      email: authUser.email,
      favorites: firebaseuser.favorites,
      displayName: firebaseuser.displayName,
      photoURL: authUser.photoURL,
    };
    console.log('Merged user data:', userData);
    return userData;
  }
  console.error('User document not found in Firestore');
  return null;
}

export async function addIngredient(ingredient: string) {
  await addDoc(ingredientsCollection, {
    name: ingredient,
  });
}
export async function addAmount(amount: string) {
  await addDoc(amountsCollection, {
    name: amount,
  });
}
export async function addUnit(unit: string) {
  await addDoc(unitsCollection, {
    name: unit,
  });
}
export async function addNote(note: string) {
  await addDoc(ingredientNotesCollection, {
    note,
  });
}

export async function addComment(comment: IComment, recipe: IRecipe): Promise<string> {
  const docRef = await addDoc(commentsCollection, {
    username: comment.username,
    content: comment.content,
    postedAt: comment.postedAt,
    rating: comment.rating,
    recipeId: recipe.id,
    likes: [],
    replies: [],
    reportCount: 0,
  });

  console.log('New comment ID:', docRef.id);

  const updatedRecipe = { ...recipe };

  if (comment.rating != null) {
    updatedRecipe.totalStars = (updatedRecipe.totalStars ?? 0) + comment.rating;
    updatedRecipe.commentsWithRatings = (updatedRecipe.commentsWithRatings ?? 0) + 1;

    const recipeRef = doc(db, 'Recipes', recipe.id);
    await updateDoc(recipeRef, {
      comments: arrayUnion(docRef.id),
      totalStars: updatedRecipe.totalStars,
      commentsWithRatings: updatedRecipe.commentsWithRatings,
    });

    return docRef.id;
  }

  const recipeRef = doc(db, 'Recipes', recipe.id);
  await updateDoc(recipeRef, {
    comments: arrayUnion(docRef.id),
  });

  return docRef.id;
}

export async function toggleCommentLike(commentId: string, userId: string): Promise<boolean> {
  const commentRef = doc(db, 'Comments', commentId);
  const commentDoc = await getDoc(commentRef);

  if (!commentDoc.exists()) {
    throw new Error('Comment not found');
  }

  const commentData = commentDoc.data();
  const likes = commentData.likes || [];
  const hasLiked = likes.includes(userId);

  await updateDoc(commentRef, {
    likes: hasLiked
      ? likes.filter((id: string) => id !== userId)
      : [...likes, userId],
  });

  return !hasLiked;
}

export async function addCommentReply(commentId: string, reply: ICommentReply): Promise<void> {
  const commentRef = doc(db, 'Comments', commentId);
  const commentDoc = await getDoc(commentRef);

  if (!commentDoc.exists()) {
    throw new Error('Comment not found');
  }

  await updateDoc(commentRef, {
    replies: arrayUnion(reply),
  });
}

export async function reportComment(commentId: string): Promise<void> {
  const commentRef = doc(db, 'Comments', commentId);
  const commentDoc = await getDoc(commentRef);

  if (!commentDoc.exists()) {
    throw new Error('Comment not found');
  }

  const commentData = commentDoc.data();
  const currentReports = commentData.reportCount || 0;

  await updateDoc(commentRef, {
    reportCount: currentReports + 1,
  });
}

export async function updateRecipe(recipe: IRecipe) {
  const recipeRef = doc(db, 'Recipes', recipe.id);
  await updateDoc(recipeRef, {
    instructions: recipe.instructions,
    image: recipe.image,
    ingredients: recipe.ingredients,
    tags: recipe.tags,
    title: recipe.title,
    comments: recipe.comments,
    totalStars: recipe.totalStars,
    commentsWithRatings: recipe.commentsWithRatings,
  });
}

export async function updateUserFavorites(user: IUser, recipeId: string) {
  const userRef = doc(db, 'Users', user.uid); // Get the user's document reference

  console.log(userRef, 'userref');
  let favoriteRecipes = [...user.favorites]; // Copy the user's current favorites array
  console.log(favoriteRecipes, 'fav1');

  if (favoriteRecipes.includes(recipeId)) {
    // If the recipe is already in favorites, remove it
    favoriteRecipes = favoriteRecipes.filter((fav) => fav !== recipeId);
    console.log(favoriteRecipes, 'fav2');
  } else {
    // Otherwise, add the recipeId to the favorites array
    favoriteRecipes.push(recipeId);
    console.log(favoriteRecipes, 'fav3');
  }

  // Update the Firestore document with the new favorites array
  await updateDoc(userRef, {
    favorites: favoriteRecipes,
  });

  console.log('Updated favorites:', favoriteRecipes);
}
