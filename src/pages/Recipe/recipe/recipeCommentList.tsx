import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import RecipeComment from './recipeComment';
import IComment from '../../../interfaces/IComment';
import { getCommentById } from '../../../services/DbService';
import { useRecipeContext } from '../../../providers/CurrentRecipeProvider';
import { blackText, searchText, warmGold } from '../../../Constants';
import CommentSortControls from './commentSortControls';

export default function RecipeCommentList(): JSX.Element {
  const { currentRecipe } = useRecipeContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  const {
    data: commentsData,
    error: commentsError,
    isLoading,
  } = useQuery(
    ['comments', currentRecipe.comments],
    async () => {
      const promises = currentRecipe.comments.map(async (commentId: string) => {
        const comment = await getCommentById(commentId);
        return comment;
      });
      const comments = await Promise.all(promises);
      return comments;
    },
  );

  const sortComments = (comments: IComment[]) => {
    if (!comments) return [];

    const sorted = [...comments];
    switch (sortBy) {
    case 'oldest':
      return sorted;
    case 'rating':
      return sorted.sort((a, b) => {
        if (a.rating === null || b.rating === null) return 0;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
    case 'newest':
    default:
      return sorted.reverse();
    }
  };

  const commentsPerPage = 10;
  const startIndex = (currentPage - 1) * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const sortedComments = sortComments(commentsData ?? []);
  const totalPages = Math.ceil((sortedComments?.length ?? 0) / commentsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (commentsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load comments. Please try refreshing the page.
        </Alert>
      </Box>
    );
  } if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: warmGold }} />
      </Box>
    );
  }

  if (!commentsData?.length) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color={searchText}>
          No comments yet. Be the first to share your thoughts!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}>
        <Typography color={blackText} fontWeight={500}>
          {commentsData.length}
          Comment
          {commentsData.length !== 1 ? 's' : ''}
        </Typography>
        <CommentSortControls sortBy={sortBy} onSortChange={handleSortChange} />
      </Box>

      {sortedComments?.slice(startIndex, endIndex).map((comment: IComment) => (
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
    </Box>
  );
}
