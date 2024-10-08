import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import httpStatus from 'http-status'
import passport from 'passport'

import config from './config/config'
import morgan from './config/morgan'
import { jwtStrategy } from './config/passport'

import { errorConverter, errorHandler } from './middlewares/error'
import { authLimiter } from './middlewares/rate-limiter'
import xss from './middlewares/xss'
import routes from './routes/v1'
import ApiError from './utils/api-error'

const app = express()

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

app.use(express.static(__dirname))
// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// sanitize request data
app.use(xss())

// gzip compression
app.use(compression())

// enable cors
app.use(
  cors({
    origin: '*'
  })
)
app.options('*', cors())

// jwt authentication
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter)
}

// v1 api routes
app.use('/v1', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export default app
