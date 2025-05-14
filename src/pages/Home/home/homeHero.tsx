import { useQuery } from '@tanstack/react-query';
import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  cursiveFont,
  secondary,
  straightFont,
  warmGold,
  whiteBackground,
  blackText,
  darkGold,
} from '../../../Constants';
import { getAllHomeHeroItems, getAllHomeHeroSmallItems } from '../../../services/DbService';
import { paths } from '../../../routes/paths';
import SearchBar from '../../../components/SearchBar';
import MediumCategoryCard from '../../../components/CategoryCard/MediumCategoryCard';
import LargeCategoryCard from '../../../components/CategoryCard/LargeCategoryCard';
import useRouter from '../../../hooks/use-router';
import ICategoryCard from '../../../interfaces/ICategoryCard';

export default function HomeHero() {
  const router = useRouter();

  const { data: homeHeroItemsData, error: heroItemsError } = useQuery(['homeHeroItems'], async () => {
    const res = await getAllHomeHeroItems();
    return res;
  });
  const { data: homeHeroSmallItemsData, error: smallHeroItemsError } = useQuery(
    ['homeHeroSmallItems'],
    async () => {
      const res = await getAllHomeHeroSmallItems();
      return res;
    },
  );

  if (heroItemsError || smallHeroItemsError) {
    return (
      <Box>
        <Typography>
          Error loading home hero items
        </Typography>
      </Box>
    );
  }

  const handleCategoryClick = (tagId: string) => {
    const linkTo = paths.recipe.tag(tagId);
    router.push(linkTo);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #6B8E72, #7C9D88)',

      }}
    >
      <Container sx={{ padding: 0 }}>
        <Grid
          container
          id="homeHero"
          data-testid="homeHero"
          sx={{
            borderRadius: '12px',
            width: '100%',
            display: 'flex',
            padding: '24px 0px',
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: straightFont,
                color: blackText,
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textAlign: { xs: 'center', sm: 'left' }, // Center on small screens, left on larger
              }}
            >
              No stories.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: cursiveFont,
                color: warmGold,
                fontWeight: 'bold',
                textShadow: '1px 1px 4px rgba(0,0,0,0.15)',
                textAlign: { xs: 'center', sm: 'right' }, // Center on small screens, right on larger
              }}
            >
              Just recipes.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          backgroundColor: whiteBackground,
          width: '100%',
          padding: '32px 0',
        }}
      >
        <Container>
          <Grid container spacing={3}>
            {homeHeroItemsData?.map((categoryCard: ICategoryCard) => (
              <Grid item key={categoryCard.tag.id} xs={12} sm={6} md={3}>
                <LargeCategoryCard onClick={() => handleCategoryClick(categoryCard.tag.id)}>
                  <img
                    src={categoryCard.image}
                    alt={categoryCard.tag.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '8%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80%',
                      backgroundColor: secondary,
                      textAlign: 'center',
                      py: 1,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontFamily: straightFont, fontWeight: 'bold' }}>
                      {categoryCard.tag.name}
                    </Typography>
                  </Box>
                </LargeCategoryCard>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: 5,
              justifyContent: 'center',
            }}
          >
            {homeHeroSmallItemsData?.map((categoryCard: ICategoryCard) => (
              <Grid item xs={12} sm={2} key={categoryCard.id}>
                <MediumCategoryCard onClick={() => handleCategoryClick(categoryCard.tag.id)}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={categoryCard.image}
                      alt={categoryCard.tag.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '70%',
                        backgroundColor: secondary,
                        textAlign: 'center',
                        py: 1,
                        borderRadius: '4px',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontFamily: straightFont, fontWeight: 'bold' }}>
                        {categoryCard.tag.name}
                      </Typography>
                    </Box>
                  </Box>
                </MediumCategoryCard>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            sx={{
              marginTop: 5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <SearchBar />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box component={Link} to="/recipes">
                <Button
                  sx={{
                    backgroundColor: warmGold,
                    height: '60px',
                    borderRadius: '12px',
                    transition: 'background 0.3s ease, color 0.3s ease',
                    '&:hover': { backgroundColor: darkGold },
                    py: 1,
                    px: 3,
                  }}
                >
                  <Typography sx={{ fontFamily: straightFont, color: 'white', fontWeight: 'bold' }}>
                    View All Recipes
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
