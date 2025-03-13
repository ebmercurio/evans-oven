import {
  Grid, Avatar, Typography, Rating,
} from '@mui/material';
import IComment from '../../../interfaces/IComment';
import {
  blackText, searchText, straightFont, warmGold,
} from '../../../Constants';

interface RecipeCommentProps {
  comment: IComment
}

export default function RecipeComment(props: RecipeCommentProps) {
  const { comment } = props;

  return (
    <>
      <Grid
        container
        sx={{
          display: 'flex',
          borderTop: '1px solid #D8D2C0',
          margin: '10px 0',
        }}
      >
        <Grid item xs={1} sx={{ my: '10px' }}>
          <Avatar
            src="https://firebasestorage.googleapis.com/v0/b/evansoven-2c943.appspot.com/o/home%2Fimage_processing20210904-28619-igjrwl.gif?alt=media&token=3bf17df6-18af-4a0d-8c62-b621ec876659"
            sx={{
              width: { xs: 48, md: 64 },
              height: { xs: 48, md: 64 },
            }}
          />
        </Grid>
        <Grid item xs={11} sx={{}}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                paddingRight: 1,
              }}
            >
              <Typography
                fontFamily={straightFont}
                fontSize="1.2rem"
                fontWeight="bold"
                color={blackText}
                sx={{ textgdecoration: 'underline' }}

              >
                {comment.username}
              </Typography>
            </Grid>
            {comment.rating && (
            <Grid item xs={6} sx={{}}>
              <Typography fontFamily={straightFont} fontSize="0.8rem">Recipe Rating</Typography>
              <Rating
                size="small"
                value={comment.rating}
                precision={0.1}
                readOnly
                sx={{
                  mr: 1,
                  '& .MuiRating-iconEmpty': {
                    color: warmGold,
                  },
                }}
              />
            </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography fontFamily={straightFont} color={searchText}>{comment.content}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography
            fontFamily={straightFont}
            fontSize="0.8rem"
            color="#A47D76"
          >
            {comment.postedAt}
          </Typography>
        </Grid>
      </Grid>
      {/* <Divider sx={{ marginLeft: 2, marginRight: 2 }} /> */}
    </>
  );
}
