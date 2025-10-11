import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext?.() ?? {};
    const req = ctx.req ?? ctx.request ?? ctx?.extra?.request;
    return req?.user;
  },
);