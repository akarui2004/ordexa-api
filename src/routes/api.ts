import { Router } from 'express';

const router = Router();

router.get('status', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
  });
});

router.post('status', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
  });
});

export default router;
