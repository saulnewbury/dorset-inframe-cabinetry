import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library'

export function customError(err) {
  const message =
    err instanceof PrismaClientKnownRequestError
      ? 'Prisma error: ' + err.code
      : err instanceof PrismaClientValidationError
      ? 'Prisma validation error'
      : err instanceof Error
      ? err.message
      : 'Operation failed'
  return Response.json({ error: message })
}
