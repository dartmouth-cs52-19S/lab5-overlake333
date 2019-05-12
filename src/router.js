import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.post('/posts', requireAuth, Posts.createPost);
router.get('/posts', Posts.getPosts);

router.get('/posts/:id', Posts.getPost);
router.put('/posts/:id', requireAuth, Posts.updatePost);
router.delete('/posts/:id', requireAuth, Posts.deletePost);

// /your routes will go here
export default router;
