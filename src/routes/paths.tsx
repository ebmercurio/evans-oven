/* eslint-disable import/prefer-default-export */
function path(sublink: string) {
  return `${sublink}`;
}

export const paths = {
  recipe: {
    root: path('/recipe'),
    recipe: (recipeId: string) => path(`/recipe/${recipeId}`),
    tagName: (tagName: string) => path(`/recipeTag/${tagName}`),
    admin: path('/admin'),
  },
};
