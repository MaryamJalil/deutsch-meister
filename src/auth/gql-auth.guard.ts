import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // Ensure we return a request-like object for Passport/JWT extractor
  getRequest(context: ExecutionContext) {
    // GraphQL execution context
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext?.() ?? {};

    // Queries/Mutations (typical)
    const req = ctx.req ?? ctx.request ?? ctx?.extra?.request;
    if (req) {
      return req;
    }

    // Subscriptions: headers may live on connection params
    const headers =
      ctx.connectionParams?.headers ??
      ctx.connection?.context?.headers ??
      ctx.headers;

    if (headers) {
      // Return a minimal request-like object so ExtractJwt.fromAuthHeaderAsBearerToken works
      return { headers };
    }

    // Fallback to HTTP (in case this guard is used outside GQL)
    return context.switchToHttp().getRequest();
  }

  // Provide clearer Unauthorized feedback (optional)
  handleRequest(err: any, user: any, info?: any) {
    if (err || !user) {
      const message =
        (typeof info === 'string' && info) ||
        info?.message ||
        info?.name ||
        'Unauthorized';
      throw err ?? new UnauthorizedException(message);
    }
    return user;
  }
}

