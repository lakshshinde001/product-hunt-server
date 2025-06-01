import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false,
      });
    }

    const token = authHeader.split(' ')[1]; 
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export default isAuthenticated;
