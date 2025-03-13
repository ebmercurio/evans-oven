import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Box, Container, Grid, Tabs, Tab, styled,
  Typography,
} from '@mui/material';
import { getAllTags, getRecipesByTag } from '../../../services/DbService';
import ITag from '../../../interfaces/ITag';
import RecipeCard from '../../../components/RecipeCards/recipeCard';
import { blackText, secondary, whiteBackground } from '../../../Constants';

const StyledTabs = styled(Tabs)({
  borderBottom: `2px solid ${secondary}`,
  '& .MuiTab-root': {
    minWidth: 'auto',
    marginRight: '16px',
    color: blackText,
    fontWeight: 'bold',
    fontSize: '1rem',
    textTransform: 'uppercase',
  },
  '& .MuiTab-root.Mui-selected': {
    color: secondary,
  },
  '& .MuiTabs-indicator': {
    backgroundColor: secondary,
  },
});

export default function HomeBottom() {
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);
  const { data: tagsData, error: tagsError } = useQuery(['tags'], getAllTags);
  const { data: recipesByTagData, error: recipesByTagError } = useQuery(
    ['recipesByTag', tags[selectedTagIndex]?.id],
    async () => {
      if (tagsData) {
        const res = await getRecipesByTag(tags[selectedTagIndex].id);
        return res;
      }
      return [];
    },
  );

  if (tagsError) {
    return (
      <Box>
        <Typography>
          Error loading tags
        </Typography>
      </Box>
    );
  }

  if (recipesByTagError) {
    return (
      <Box>
        <Typography>
          Error loading recipes by tag
        </Typography>
      </Box>
    );
  }

  useEffect(() => {
    if (tagsData) {
      const randomTags = tagsData.sort(
        () => 0.5 - Math.random(),
      ).slice(0, 5); // Randomly pick 5 tags
      setTags(randomTags);
    }
  }, [tagsData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTagIndex(newValue);
  };

  return (
    <Box sx={{
      backgroundColor: whiteBackground,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '48px 16px',
    }}
    >
      <Container>
        <StyledTabs value={selectedTagIndex} onChange={handleTabChange}>
          {tags.map((tag) => (
            <Tab key={tag.id} label={tag.name} />
          ))}
        </StyledTabs>
        <Grid container spacing={3} sx={{ marginTop: '24px' }}>
          {recipesByTagData?.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
              <RecipeCard
                recipe={recipe}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
