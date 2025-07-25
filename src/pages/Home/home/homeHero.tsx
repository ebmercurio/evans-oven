import { useQuery } from '@tanstack/react-query';
import {
  Box, Button, Container, Grid, Hidden, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay to create the fade-in effect
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleCategoryClick = (tagName: string) => {
    const linkTo = paths.recipe.tagName(tagName);
    router.push(linkTo);
  };

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #6B8E72, #7C9D88)',
          transition: 'all 0.5s ease',
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          opacity: isVisible ? 1 : 0,
          marginTop: 11,
        }}
      >
        <Container>

          <Grid
            container
            id="homeHero"
            data-testid="homeHero"
            sx={{
              borderRadius: '12px',
              display: 'flex',
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: cursiveFont,
                  color: warmGold,
                  fontWeight: 'bold',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.15)',
                  textAlign: { xs: 'center', sm: 'right' }, // Center on small screens, right on larger
                  transition: 'opacity 1s ease-in',
                  opacity: isVisible ? 1 : 0,
                }}
              >
                Just recipes.
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => MigrateTagIdToName(true)}>
            migrate
          </Button>
        </Grid> */}
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: whiteBackground,
          width: '100%',
        }}
      >
        <Container>
          <Hidden mdDown>
            <Grid container display="flex">
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'start' }}>
                {/* <Box
              sx={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                marginTop: 2,
                // padding: '8px 12px',
              }}
            > */}
                <SearchBar />
                {/* </Box> */}
              </Grid>
            </Grid>
          </Hidden>
          <Grid container spacing={2}>
            {homeHeroItemsData?.map((categoryCard: ICategoryCard) => (
              <Grid
                item
                key={categoryCard.id}
                xs={12}
                sm={6}
                md={3}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <LargeCategoryCard onClick={() => handleCategoryClick(categoryCard.tag)}>
                    <img
                      src={categoryCard.image}
                      alt={categoryCard.tag}
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
                        {categoryCard.tag}
                      </Typography>
                    </Box>
                  </LargeCategoryCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{
              marginTop: 3,
              justifyContent: 'center',
            }}
          >
            {homeHeroSmallItemsData?.map((categoryCard: ICategoryCard) => (
              <Grid item xs={12} sm={2} key={categoryCard.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                >

                  <MediumCategoryCard onClick={() => handleCategoryClick(categoryCard.tag)}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={categoryCard.image}
                        alt={categoryCard.tag}
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
                          {categoryCard.tag}
                        </Typography>
                      </Box>
                    </Box>
                  </MediumCategoryCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            sx={{
              marginTop: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

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
    </>
  );
}
