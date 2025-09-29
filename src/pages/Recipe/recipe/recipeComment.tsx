import { useState } from 'react';
import {
  Grid,
  Avatar,
  Typography,
  Rating,
  Box,
  Chip,
  IconButton,
  Button,
  Stack,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../../../contexts/AuthContext';
import IComment, { ICommentReply } from '../../../interfaces/IComment';
import formatTimeAgo from '../../../utils/format-time-ago';
import {
  blackText, primary, searchText, straightFont, warmGold,
} from '../../../Constants';
import { toggleCommentLike, addCommentReply, reportComment } from '../../../services/DbService';

interface RecipeCommentProps {
  comment: IComment;
}

export default function RecipeComment(props: RecipeCommentProps): JSX.Element {
  const { comment } = props;
  const { currentUser } = useAuth();

  const isCurrentUser = currentUser?.displayName === comment.username;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(
    currentUser?.uid ? (comment.likes ?? []).includes(currentUser.uid) : false,
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = async () => {
    if (!currentUser) return;

    try {
      const newLikedState = await toggleCommentLike(comment.id!, currentUser.uid);
      setIsLiked(newLikedState);
    } catch (err) {
      setError('Failed to update like status. Please try again.');
    }
  };

  const handleReplyClick = () => {
    setIsReplyOpen(true);
  };

  const handleReplyClose = () => {
    setIsReplyOpen(false);
    setReplyContent('');
  };

  const handleReplySubmit = async () => {
    if (!currentUser?.displayName || !replyContent.trim()) return;

    try {
      const reply: ICommentReply = {
        id: Date.now().toString(),
        username: currentUser.displayName,
        content: replyContent.trim(),
        postedAt: new Date().toISOString(),
      };

      await addCommentReply(comment.id!, reply);
      handleReplyClose();
    } catch (commentError) {
      console.error('Error adding reply:', commentError);
    }
  };

  const handleReport = async () => {
    try {
      await reportComment(comment.id!);
      handleMenuClose();
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  return (
    <Box
      sx={{
        borderColor: '#D8D2C0',
        borderStyle: 'solid',
        borderWidth: '1px 0',
        my: 2,
        '&:first-of-type': {
          borderTop: 'none',
        },
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          padding: '16px 0',
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Grid item>
          <Avatar
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.username)}&backgroundColor=AD775F`}
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              bgcolor: warmGold,
              border: isCurrentUser ? `2px solid ${warmGold}` : 'none',
            }}
          >
            {comment.username.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>

        <Grid item xs>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  fontFamily={straightFont}
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    fontWeight: 600,
                    color: blackText,
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {comment.username}
                  {isCurrentUser && (
                    <Chip
                      label="You"
                      size="small"
                      sx={{
                        height: '20px',
                        backgroundColor: 'rgba(227, 183, 120, 0.1)',
                        color: warmGold,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  {comment.rating && comment.content && (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                      label="Verified Cook"
                      size="small"
                      sx={{
                        height: '20px',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4CAF50',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: '#4CAF50',
                        },
                      }}
                    />
                  )}
                </Typography>
                <Typography
                  fontFamily={straightFont}
                  sx={{
                    fontSize: '0.75rem',
                    color: '#A47D76',
                    mt: 0.5,
                  }}
                >
                  {formatTimeAgo(comment.postedAt)}
                </Typography>
              </Box>
            </Grid>

            {comment.rating && (
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <Typography
                  fontFamily={straightFont}
                  fontSize="0.8rem"
                  sx={{ color: searchText }}
                >
                  Recipe Rating:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    size="small"
                    value={comment.rating}
                    precision={0.1}
                    readOnly
                    sx={{
                      '& .MuiRating-iconEmpty': {
                        color: warmGold,
                      },
                    }}
                  />
                  <Typography
                    fontFamily={straightFont}
                    fontSize="0.8rem"
                    sx={{ color: warmGold, fontWeight: 600 }}
                  >
                    {comment.rating}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography
                fontFamily={straightFont}
                sx={{
                  color: searchText,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: 1.6,
                  mt: { xs: 1, sm: 0.5 },
                  whiteSpace: 'pre-line', // Preserves line breaks
                }}
              >
                {comment.content}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mt: 2,
                }}
              >
                <IconButton
                  onClick={handleLikeClick}
                  disabled={!currentUser}
                  size="small"
                  sx={{
                    color: isLiked ? warmGold : 'inherit',
                    '&:hover': {
                      color: warmGold,
                    },
                  }}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>

                {comment.likes && comment.likes.length > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {comment.likes.length} like{comment.likes.length !== 1 ? 's' : ''}
                  </Typography>
                )}

                <Button
                  startIcon={<ReplyIcon />}
                  size="small"
                  onClick={handleReplyClick}
                  disabled={!currentUser}
                  sx={{
                    color: searchText,
                    '&:hover': {
                      color: warmGold,
                      backgroundColor: 'rgba(227, 183, 120, 0.1)',
                    },
                  }}
                >
                  Reply
                </Button>

                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  sx={{
                    ml: 'auto',
                    color: searchText,
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {comment.replies && comment.replies.length > 0 && (
                <Box sx={{ mt: 2, ml: { xs: 2, sm: 6 } }}>
                  <Button
                    onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                    sx={{
                      color: warmGold,
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: 'rgba(227, 183, 120, 0.1)',
                      },
                    }}
                  >
                    {isRepliesVisible ? 'Hide' : 'Show'} {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                  </Button>

                  {isRepliesVisible && (
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {comment.replies.map((reply) => (
                        <Box
                          key={reply.id}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            padding: 2,
                            borderRadius: 1,
                            backgroundColor: 'rgba(227, 183, 120, 0.05)',
                          }}
                        >
                          <Avatar
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(reply.username)}&backgroundColor=AD775F`}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: warmGold,
                            }}
                          >
                            {reply.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              fontFamily={straightFont}
                              sx={{
                                fontWeight: 600,
                                color: blackText,
                                fontSize: '0.875rem',
                              }}
                            >
                              {reply.username}
                            </Typography>
                            <Typography
                              fontFamily={straightFont}
                              sx={{
                                color: searchText,
                                fontSize: '0.875rem',
                                mt: 0.5,
                              }}
                            >
                              {reply.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'block',
                                mt: 0.5,
                              }}
                            >
                              {formatTimeAgo(reply.postedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={handleReport}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
            },
          }}
        >
          Report Comment
        </MenuItem>
      </Menu>

      <Dialog
        open={isReplyOpen}
        onClose={handleReplyClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>Reply to {comment.username}&apos;s comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={3}
            fullWidth
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: primary,
                },
                '&:hover fieldset': {
                  borderColor: warmGold,
                },
                '&.Mui-focused fieldset': {
                  borderColor: warmGold,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReplyClose} sx={{ color: searchText }}>
            Cancel
          </Button>
          <Button
            onClick={handleReplySubmit}
            variant="contained"
            disabled={!replyContent.trim()}
            sx={{
              backgroundColor: warmGold,
              '&:hover': {
                backgroundColor: '#D9A253',
              },
            }}
          >
            Reply
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
