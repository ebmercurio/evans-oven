import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import RecipeComment from './recipeComment';
import IComment from '../../../interfaces/IComment';
import { getCommentById } from '../../../services/DbService';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import { searchText, warmGold } from '../../../Constants';

export default function RecipeCommentList() {
  const { currentRecipe } = useRecipeContext();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: commentsData, error: commentsError } = useQuery(
    ['comments', currentRecipe.comments],
    async () => {
      const promises = currentRecipe.comments.map(async (commentId: string) => {
        const comment = await getCommentById(commentId);
        return comment;
      });
      const comments = await Promise.all(promises);
      return comments.reverse();
    },
  );

  const commentsPerPage = 10;
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const totalPages = Math.ceil(currentRecipe.comments.length / commentsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (commentsError) {
    return <div>Error loading comments</div>;
  }

  return (
    <>
      {commentsData?.slice(startIndex, endIndex).map((comment: IComment) => (
        <RecipeComment key={comment.id} comment={comment} />
      ))}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{
          mx: 'auto',
          my: 5,
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
          // Style for active page button
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: warmGold, // Warm gold background for active page
            color: 'white', // White text for contrast
            borderRadius: '50%', // Makes it a circular button
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#D9A253', // Slightly darker gold on hover
            },
          },
          // Style for inactive page buttons
          '& .MuiPaginationItem-root': {
            color: searchText,
            fontWeight: '500',
            '&:hover': {
              backgroundColor: 'rgba(227, 183, 120, 0.2)', // Light transparent gold on hover
            },
          },
          // Hide the default MUI outline on focus
          '& .MuiPaginationItem-root:focus': {
            outline: 'none',
          },
        }}
      />
    </>
  );
}
